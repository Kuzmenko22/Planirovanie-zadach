import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { z } from "zod";

export const classroomRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.classroom.findMany();
  }),

  getAvailable: publicProcedure
    .input(z.object({
      weekType: z.enum(["ODD", "EVEN"]),
      dayOfWeek: z.enum([
        "MONDAY", "TUESDAY", "WEDNESDAY",
        "THURSDAY", "FRIDAY", "SATURDAY",
      ]),
      startTime: z.string(),
      endTime: z.string(),
    }))
    .query(async ({ input, ctx }) => {
      const { weekType, dayOfWeek, startTime, endTime } = input;

      const busy = await ctx.db.lesson.findMany({
        where: {
          weekType,
          dayOfWeek,
          startTime,
          endTime,
        },
        select: { classroomId: true },
      });
      const busyIds = busy.map((b) => b.classroomId);

      return ctx.db.classroom.findMany({
        where: busyIds.length > 0
          ? { id: { notIn: busyIds } }
          : {},
        orderBy: { name: "asc" },
      });
    }),
});
