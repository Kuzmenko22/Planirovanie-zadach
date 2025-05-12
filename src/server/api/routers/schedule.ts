import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { db } from "~/server/db";

export const scheduleRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        groupId: z.string().optional(),
        date: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const groupId = input.groupId?.trim();
      if (!groupId) return [];

      return db.lesson.findMany({
        where: {
          OR: [
            { groups: { some: { id: groupId } } },
            { subgroup: { groupId } },
          ],
        },
        include: {
          subject: true,
          teacher: { include: { user: true } },
          classroom: true,
          groups: true,
          subgroup: true,
        },
      });
    }),
    
});


