import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  createBug: publicProcedure
    .input(z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      priority: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.bug.create({
        data: {
          title: input.title,
          description: input.description,
          priority: input.priority,
          status: "Open",
        },
      });
    }),

  getAllBugs: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.bug.findMany({
      orderBy: { createdAt: "desc" },
    });
  }),
});