import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { z } from "zod";
import { isAdmin} from "~/app/api/auth/check";

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

    create: publicProcedure
    .input(z.object({
      name: z.string().min(1, "Название не может быть пустым"),
    }))
    .mutation(async ({ input }) => {
      const isUserAdmin = await isAdmin();
      if (!isUserAdmin) {
        throw new Error("Доступ запрещён. Добавлять аудитории может только администратор.");
      }

      const existing = await db.classroom.findUnique({
        where: { name: input.name },
      });

      if (existing) {
        throw new Error("Аудитория с таким названием уже существует.");
      }

      return db.classroom.create({
        data: { name: input.name },
      });
    }),
});
