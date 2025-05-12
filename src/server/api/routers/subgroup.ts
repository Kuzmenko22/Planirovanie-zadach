import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const subgroupRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(z.object({ groupId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.subgroup.findMany({
        where: {
          groupId: input.groupId,
        },
      });
    }),
});
