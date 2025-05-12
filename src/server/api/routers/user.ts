import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { isAdmin} from "~/app/api/auth/check";
import { auth } from "~/server/auth";

export const userRouter = createTRPCRouter({
  getPaginated: publicProcedure
    .input(z.object({ page: z.number().default(1), limit: z.number().default(10) }))
    .query(async ({ input }) => {
      const { page, limit } = input;
      const skip = (page - 1) * limit;

      const [users, total] = await Promise.all([
        db.user.findMany({
          orderBy: { emailVerified: "desc" },
          skip,
          take: limit,
        }),
        db.user.count(),
      ]);

      return {
        users,
        total,
      };
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.user.findUnique({
        where: { id: input.id },
        include: {
          teacherProfile: {
            include: {
              subjects: true,
            },
          },
        },
      });
    }),

    update: publicProcedure
    .input(z.object({
      id: z.string(),
      firstname: z.string().nullable(),
      surname: z.string().nullable(),
      lastname: z.string().nullable(),
      email: z.string().nullable(),
      role: z.enum(["ADMIN", "TEACHER", "STUDENT"]),
      subjectIds: z.array(z.string()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const admin = await isAdmin();
      if (!admin) {
        throw new Error("Доступ запрещён. Только администратор может обновлять пользователей.");
      }

      const { id, firstname, surname, lastname, email, role, subjectIds } = input;
  
      const user = await db.user.findUnique({
        where: { id },
        include: { teacherProfile: true },
      });
  
      
      if (user?.role === "TEACHER" && (role === "STUDENT" || role === "ADMIN")) {
        await db.lesson.deleteMany({ where: { teacherId: id } });
        await db.teacher.delete({ where: { userId: id } });
      }
  
      
      if (role === "TEACHER") {
        let teacher = user?.teacherProfile;
  
        
        if (!teacher) {
          teacher = await db.teacher.create({
            data: { userId: id },
          });
        }
  
        if (subjectIds) {
          const currentSubjects = await db.subject.findMany({
            where: { teacherId: teacher.id },
          });
  
          const currentSubjectIds = currentSubjects.map((s) => s.id);
  
          
          const removedSubjectIds = currentSubjectIds.filter((id) => !subjectIds.includes(id));
  
          
          await db.lesson.deleteMany({
            where: {
              teacherId: teacher.id,
              subjectId: { in: removedSubjectIds },
            },
          });
  
          
          await db.subject.updateMany({
            where: { teacherId: teacher.id },
            data: { teacherId: undefined },
          });
  
          
          await Promise.all(subjectIds.map((subjectId) =>
            db.subject.update({
              where: { id: subjectId },
              data: { teacherId: teacher!.id },
            })
          ));
        }
      }
  
      
      return db.user.update({
        where: { id },
        data: {
          firstname,
          surname,
          lastname,
          email,
          role,
        },
      });
    }),
  

  create: publicProcedure
    .input(
      z.object({
        firstname: z.string(),
        surname: z.string(),
        lastname: z.string(),
        email: z.string().email(),
        role: z.enum(["ADMIN", "TEACHER", "STUDENT"]),
      })
    )
    .mutation(async ({ input }) => {
      const admin = await isAdmin();
      if (!admin) {
        throw new Error("Доступ запрещён. Только администратор может создавать пользователей.");
      }

      const { firstname, surname, lastname, email, role } = input;

      const newUser = await db.user.create({
        data: {
          firstname,
          surname,
          lastname,
          email,
          role,
        },
      });

      if (role === "TEACHER") {
        await db.teacher.create({
          data: {
            userId: newUser.id,
          },
        });
      }

      return newUser;
    }),


    getCurrent: publicProcedure.query(async () => {
      const session = await auth();
    
      if (!session?.user) {
        return null;
      }
    
      return {
        id: session.user.id,
        email: session.user.email,
        role: session.user.role,
        name: session.user.name,
      };
    }),
});
