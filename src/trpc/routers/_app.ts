import {
  baseProcedure,
  createTRPCRouter
} from "../init";
export const appRouter = createTRPCRouter({
  health: baseProcedure.query(async () => {
    //Uncomment to demo Suspense loading state:
    // await new Promise((resolve) => setTimeout(resolve, 5000))

    // Uncomment to demo ErrorBoundray
    // throw new Error("Something Went Wrong!")

    return { status: "ok" }
  })
});
// export type definition of API
export type AppRouter = typeof appRouter;
