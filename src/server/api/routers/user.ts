import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc"; //разобраться с publicProcedure и protectedProcedure
import { db } from "~/server/db";

//разобраться
import { auth } from "~/server/auth";
import { isAdmin,Uzerid} from "~/app/api/auth/check";



export const userRouter = createTRPCRouter({

//------------------------Изменение таблицы (набросок для первоначальной рабоы сайта)-------------------------
//создание пользователя (админом)
  createUser: publicProcedure
    .input(
      z.object({
        firstname: z.string().optional(),
        surname: z.string().optional(),
        lastname: z.string().optional(),
        email: z.string().email().optional(),           //точно ли email не обязателен???
        emailVerified: z.coerce.date(),                 //нужно ли???
        role: z.enum(["ADMIN", "USER"]),
      })
    )
    .mutation(async ({ input }) => {
      const admin = await isAdmin();
      if (!admin) {
        throw new Error("Только администратор может создавать пользователей.");
      }

      const { ...createData } = input;

      return db.user.create({
        data: createData,
      }); 
    }),

    //обновление юзера (доступно пользователям/админу)
    updateUser: publicProcedure
      .input(
        z.object({
          iduser: z.string().cuid(),
          firstname: z.string().optional(),
          surname: z.string().optional(),
          lastname: z.string().optional(),
          email: z.string().email().optional(),           
          emailVerified: z.coerce.date().optional(),                 
          role: z.enum(["ADMIN", "USER"]).optional(),
        })
      )
      .mutation(async ({ input }) => {
        const admin = await isAdmin();
        //если это не админ и он хочет изменить чужие данные или хочет поменять себе роль то нельзя
        const id = await Uzerid()
        const conditions = (!admin && id !== input.iduser || !admin && input.role !== undefined)
        if (conditions) {
          throw new Error("Только администратор может менять роль пользователей.");
        }

        const { iduser, ...createData } = input;

        return db.user.update({
          where: {
                id: input.iduser,
            },
          data: createData,
        }); 
    }),

    //удаление пользователя (пользователем/админом)
    deleteUser: publicProcedure
    .input(
        z.object({
          iduser: z.string().cuid(),
        })
      )
      .mutation(async ({ input }) => {
        const id = await Uzerid()
        const admin = await isAdmin();
        if (!admin && id !== input.iduser) {
          throw new Error("Только администратор может удалять других пользователей пользователей.");
        }

        return db.user.delete({
          where: {
            id: input.iduser,
          }
        }); 
    }),

//-------------------------------------------------------------

//----------------------запросы к таблице--------------------
//Получение данных пользователя для отображения профиля
    getUserInfo: publicProcedure
    .input(z.object({ 
        idUser: z.string().cuid(),      
      }))
    .query(async ({ input }) => {
        const id = await Uzerid()
        const admin = await isAdmin();
        if(id !== input.idUser && !admin)
          throw new Error("Попытка получить информацию другого профиля");
        return db.task.findFirst({
          where: {
            id: input.idUser
          },
        });
    }),

//Получить список пользователей, для админа (ошибка в коде из-за призмы обсудить)
    getUserlist: publicProcedure
    .query(async ({  }) => {
        const admin = await isAdmin()
        if(!admin)
          throw new Error("Попытка получить список пользователей простым пользователем");
        return db.task.findMany({
          select: {
            id: true,
            firstname: true,
            lastname: true,
            surname: true,
            role: true,
          },
          orderBy: { id: "asc" },
        });
    }),





  // getPaginated: publicProcedure
  //   .input(z.object({ page: z.number().default(1), limit: z.number().default(10) }))
  //   .query(async ({ input }) => {
  //     const { page, limit } = input;
  //     const skip = (page - 1) * limit;

  //     const [users, total] = await Promise.all([
  //       db.user.findMany({
  //         orderBy: { emailVerified: "desc" },
  //         skip,
  //         take: limit,
  //       }),
  //       db.user.count(),
  //     ]);

  //     return {
  //       users,
  //       total,
  //     };
  //   }),

//-------------------------------------------------------------  
});
