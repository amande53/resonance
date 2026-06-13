import * as Sentry from "@sentry/nextjs"
import { TEXT_MAX_LENGTH } from "@/features/text-to-speech/data/constants";
import { chatterbox } from "@/lib/chatterbox-client";
import { prisma } from "@/lib/db";
import { deleteAudio, uploadAudio } from "@/lib/r2";
import { createTRPCRouter, orgProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
export const generationsRouter = createTRPCRouter({
  getById: orgProcedure.input(z.object({ id: z.string() })).query(async ({ input, ctx }) => {
    const generation = await prisma.generation.findUnique({
      where: { id: input.id, orgId: ctx.orgId },
      omit: {
        orgId: true,
        r2ObjectKey: true,
      },
    });

    if (!generation) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }

    return {
      ...generation,
      audioUrl: `/api/audio/${generation.id}`,
    };
  }),

  getAll: orgProcedure.query(async ({ ctx }) => {
    const generations = await prisma.generation.findMany({
      where: { orgId: ctx.orgId },
      orderBy: { createdAt: "desc" },
      omit: {
        orgId: true,
        r2ObjectKey: true,
      },
    });

    return generations;
  }),

  create: orgProcedure
    .input(
      z.object({
        text: z.string().min(1).max(TEXT_MAX_LENGTH),
        voiceId: z.string().min(1),
        temperature: z.number().min(0).max(2).default(0.8),
        topP: z.number().min(0).max(1).default(0.95),
        topK: z.number().min(1).max(10000).default(1000),
        repetitionPenalty: z.number().min(1).max(2).default(1.2),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const voice = await prisma.voice.findUnique({
        where: {
          id: input.voiceId,
          OR: [{ variant: "SYSTEM" }, { variant: "CUSTOM", orgId: ctx.orgId }],
        },
      });

      if (!voice) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Voice not found",
        });
      }

      if (!voice.r2ObjectKey) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Voice audio not available",
        });
      }

      const { data, error } = await chatterbox.POST("/generate", {
        body: {
          prompt: input.text,
          voice_key: voice.r2ObjectKey,
          temperature: input.temperature,
          top_p: input.topP,
          top_k: input.topK,
          repetition_penalty: input.repetitionPenalty,
          norm_loudness: true,
        },
        parseAs: "arrayBuffer",
      });

      Sentry.logger.info("Generation Started", {
        orgId: ctx.orgId,
        voiceId: input.voiceId,
        textLength: input.text.length,
      });

      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to generate audio",
        });
      }

      if (!(data instanceof ArrayBuffer)) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Invalid audio response",
        });
      }


      const buffer = Buffer.from(data);
      let uploadedR2ObjectKey: string | null = null;

      try {
        const { generationId } = await prisma.$transaction(async (tx) => {
          const generation = await tx.generation.create({
            data: {
              orgId: ctx.orgId,
              text: input.text,
              voiceName: voice.name,
              voiceId: voice.id,
              temperature: input.temperature,
              topP: input.topP,
              topK: input.topK,
              repetitionPenalty: input.repetitionPenalty,
            },
            select: {
              id: true,
            },
          });

          const r2ObjectKey = `generations/orgs/${ctx.orgId}/${generation.id}`;

          await uploadAudio({ buffer, key: r2ObjectKey });
          uploadedR2ObjectKey = r2ObjectKey;

          await tx.generation.update({
            where: {
              id: generation.id,
            },
            data: {
              r2ObjectKey,
            },
          });

          return { generationId: generation.id };
        });

        return {
          id: generationId,
        };
      } catch (error) {
        if (uploadedR2ObjectKey) {
          await deleteAudio(uploadedR2ObjectKey).catch((cleanupError) => {
            console.error("Failed to delete generated audio from R2", {
              r2ObjectKey: uploadedR2ObjectKey,
              error: cleanupError,
            });
          });
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to store generated audio",
          cause: error,
        });
      }
    }),
});
