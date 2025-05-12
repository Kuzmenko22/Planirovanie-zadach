import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { isTeacherOrAdminForCurrentLesson } from "~/app/api/auth/check";

export const lessonRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({
      teacherId: z.string(),
      subjectId: z.string(),
      classroomId: z.string(),
      groupIds: z.array(z.string()),
      subgroupId: z.string().nullable(),
      type: z.enum(["LECTURE", "LAB", "KSR"]),
      dayOfWeek: z.enum(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"]),
      startTime: z.string(), 
      endTime: z.string(),  
      weekType: z.enum(["ODD", "EVEN"]),
    }))
    .mutation(async ({ input }) => {
      const hasPermission = await isTeacherOrAdminForCurrentLesson(input.teacherId);
      if (!hasPermission) {
        return {
          success: false,
          message: "У вас нет прав на добавление этого занятия.",
        };
      }

      const {
        teacherId,
        subjectId,
        classroomId,
        groupIds,
        subgroupId,
        type,
        dayOfWeek,
        startTime,
        endTime,
        weekType,
      } = input;

      
      const teacherConflict = await db.lesson.findFirst({
        where: {
          teacherId,
          dayOfWeek,
          weekType,
          startTime,
          endTime,
        },
      });

      if (teacherConflict) {
        return {
          success: false,
          message: "У преподавателя уже есть занятие в это время.",
        };
      }

      
      const conflictingClassroom = await db.lesson.findFirst({
        where: {
          classroomId,
          dayOfWeek,
          weekType,
          startTime,
          endTime,
        },
      });

      if (conflictingClassroom) {
        return {
          success: false,
          message: "Аудитория занята в указанное время.",
        };
      }

      
      const groupConflicts = await db.lesson.findMany({
        where: {
          dayOfWeek,
          weekType,
          startTime,
          endTime,
          
          OR: [
            {
              groups: {
                some: {
                  id: { in: groupIds },
                },
              },
            },
            {
              
              subgroupId: subgroupId ?? undefined,
            },
          ],
        },
      });

    
      if (type === "LAB" && groupIds.length > 0) {
      
        const groupConflictWithAnyType = await db.lesson.findMany({
          where: {
            dayOfWeek,
            weekType,
            startTime,
            endTime,
            groups: {
              some: {
                id: { in: groupIds },
              },
            },
          },
        });

        if (groupConflictWithAnyType.length > 0) {
          return {
            success: false,
            message: "Конфликт с другим занятием (лекция или КСР) для выбранных групп в это время.",
          };
        }
      }

    
      if (type === "LAB" && subgroupId) {
        const subgroupConflicts = await db.lesson.findMany({
          where: {
            dayOfWeek,
            weekType,
            startTime,
            endTime,
            type: "LAB", 
            subgroupId: { not: subgroupId }, 
            groups: {
              some: {
                id: { in: groupIds },
              },
            },
          },
        });

        if (subgroupConflicts.length > 0) {
          return {
            success: false,
            message: "Конфликт с лабораторными занятиями для выбранных подгрупп.",
          };
        }
      } else if (groupConflicts.length > 0) {
        return {
          success: false,
          message: "Конфликт с другими занятиями выбранных групп или подгрупп.",
        };
      }

    
      const newLesson = await db.lesson.create({
        data: {
          teacherId,
          subjectId,
          classroomId,
          subgroupId: subgroupId ?? undefined,
          type,
          weekType,
          dayOfWeek,
          startTime,
          endTime,
          groups: {
            connect: groupIds.map((id) => ({ id })),
          },
        },
      });

      return {
        success: true,
        lesson: newLesson,
      };
    }),


  update: publicProcedure
  .input(z.object({
    id: z.string(),
    teacherId: z.string(),
    subjectId: z.string(),
    classroomId: z.string(),
    groupIds: z.array(z.string()),
    subgroupId: z.string().nullable(),
    type: z.enum(["LECTURE", "LAB", "KSR"]),
    dayOfWeek: z.enum(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"]),
    startTime: z.string(),
    endTime: z.string(),
    weekType: z.enum(["ODD", "EVEN"]),
  }))
  .mutation(async ({ input }) => {
    const hasPermission = await isTeacherOrAdminForCurrentLesson(input.teacherId);
    if (!hasPermission) {
      return {
        success: false,
        message: "У вас нет прав на редактирование этого занятия.",
      };
    }
    const {
      id,
      teacherId,
      subjectId,
      classroomId,
      groupIds,
      subgroupId,
      type,
      dayOfWeek,
      startTime,
      endTime,
      weekType,
    } = input;

    
    const teacherConflict = await db.lesson.findFirst({
      where: {
        id: { not: id },
        teacherId,
        dayOfWeek,
        weekType,
        startTime,
        endTime,
      },
    });

    if (teacherConflict) {
      return {
        success: false,
        message: "У преподавателя уже есть занятие в это время.",
      };
    }

    
    const conflictingClassroom = await db.lesson.findFirst({
      where: {
        id: { not: id },
        classroomId,
        dayOfWeek,
        weekType,
        startTime,
        endTime,
      },
    });

    if (conflictingClassroom) {
      return {
        success: false,
        message: "Аудитория занята в указанное время.",
      };
    }

    
    const groupConflicts = await db.lesson.findMany({
      where: {
        id: { not: id },
        dayOfWeek,
        weekType,
        startTime,
        endTime,
        OR: [
          {
            groups: {
              some: {
                id: { in: groupIds },
              },
            },
          },
          {
            subgroupId: subgroupId ?? undefined,
          },
        ],
      },
    });

    if (type === "LAB" && groupIds.length > 0) {
      const groupConflictWithAnyType = await db.lesson.findMany({
        where: {
          id: { not: id },
          dayOfWeek,
          weekType,
          startTime,
          endTime,
          groups: {
            some: {
              id: { in: groupIds },
            },
          },
        },
      });

      if (groupConflictWithAnyType.length > 0) {
        return {
          success: false,
          message: "Конфликт с другим занятием (лекция или КСР) для выбранных групп в это время.",
        };
      }
    }

    if (type === "LAB" && subgroupId) {
      const subgroupConflicts = await db.lesson.findMany({
        where: {
          id: { not: id },
          dayOfWeek,
          weekType,
          startTime,
          endTime,
          type: "LAB",
          subgroupId: { not: subgroupId },
          groups: {
            some: {
              id: { in: groupIds },
            },
          },
        },
      });

      if (subgroupConflicts.length > 0) {
        return {
          success: false,
          message: "Конфликт с лабораторными занятиями для выбранных подгрупп.",
        };
      }
    } else if (groupConflicts.length > 0) {
      return {
        success: false,
        message: "Конфликт с другими занятиями выбранных групп или подгрупп.",
      };
    }

    const updated = await db.lesson.update({
      where: { id },
      data: {
        teacherId,
        subjectId,
        classroomId,
        subgroupId: subgroupId ?? undefined,
        type,
        weekType,
        dayOfWeek,
        startTime,
        endTime,
        groups: {
          set: groupIds.map((id) => ({ id })),
        },
      },
    });

    return {
      success: true,
      lesson: updated,
    };
  }),

  delete: publicProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ input }) => {
    const lesson = await db.lesson.findUnique({
      where: { id: input.id },
      select: { teacherId: true },
    });
    
    if (!lesson) {
      throw new Error("Занятие не найдено.");
    }
    
    const hasPermission = await isTeacherOrAdminForCurrentLesson(lesson.teacherId);
    if (!hasPermission) {
      throw new Error("У вас нет прав на удаление этого занятия.");
    }

    await db.lesson.delete({
      where: { id: input.id },
    });

    return {
      success: true,
    };
  }),
});


