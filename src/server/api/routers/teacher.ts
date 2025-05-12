import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";

export const teacherRouter = createTRPCRouter({
  getAll: publicProcedure.query(() => {
    return db.teacher.findMany({
      include: {
        user: true,
      },
    });
  }),

  getAllLessons: publicProcedure
    .input(z.object({ teacherId: z.string() }))
    .query(async ({ input }) => {
      return db.lesson.findMany({
        where: {
          teacherId: input.teacherId,
        },
        include: {
          subject: true,
          classroom: true,
          groups: true,
          subgroup: {
            include: {
              group: true,
            },
          },
          teacher: {
            include: {
              user: true,
            },
          },
        },
      });
    }),

  getSubjectsByTeacher: publicProcedure
  .input(z.object({ teacherId: z.string() }))
  .query(async ({ input }) => {
    return db.subject.findMany({
      where: {
        teacherId: input.teacherId,
      },
    });
  }),
});