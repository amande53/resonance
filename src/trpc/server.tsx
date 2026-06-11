import type React from "react";
import "server-only";

import { cache } from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";

import { createTRPCContext } from "./init";
import { makeQueryClient } from "./query-client";
import { appRouter } from "./routers/_app";

// IMPORTANT: Create a stable getter for the query client that
// will return the same client during the same request.
export const getQueryClient = cache(makeQueryClient);

export const trpc = createTRPCOptionsProxy({
  ctx: createTRPCContext,
  router: appRouter,
  queryClient: getQueryClient,
});

export function HydrateClient(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return <HydrationBoundary state={dehydrate(queryClient)}>{props.children}</HydrationBoundary>;
}

type QueryClient = ReturnType<typeof makeQueryClient>;
type PrefetchQueryOptions = Parameters<QueryClient["prefetchQuery"]>[0];
type PrefetchInfiniteQueryOptions = Parameters<QueryClient["prefetchInfiniteQuery"]>[0];
type PrefetchOptions = {
  queryKey: readonly unknown[];
};
type QueryKeyWithType = readonly [unknown, { type?: unknown }?, ...unknown[]];

export function prefetch(queryOptions: PrefetchOptions) {
  const queryClient = getQueryClient();

  const queryType = (queryOptions.queryKey as QueryKeyWithType)[1]?.type;

  if (queryType === "infinite") {
    return queryClient.prefetchInfiniteQuery(
      queryOptions as PrefetchInfiniteQueryOptions
    );
  }

  return queryClient.prefetchQuery(queryOptions as PrefetchQueryOptions);
}
