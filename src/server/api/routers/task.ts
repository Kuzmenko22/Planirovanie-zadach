// server/api/routers/task.ts
import { z } from "zod";
import {startOfWeek,endOfMonth,endOfWeek, startOfMonth} from "date-fns"
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { db } from "src/server/db"; 

export const taskRouter = createTRPCRouter({
//-----------------------Изменение таблицы-------------------------
//создание задачи (пользователем/админом)
  create: protectedProcedure
    .input(z.object({
        idUser: z.string().cuid().optional(),   //передает админ когда добавляет юзеру задачу
        date: z.coerce.date(),                          
        color: z.enum(["NO", "GREEN", "YELLOW", "RED"]), 
        status: z.enum(["COMPLETED", "NOTCOMPLETED"]),   
        priority: z.number().min(1).max(10),             
        task: z.string().min(1),                        
        description: z.string().optional(),          
    }))
    .mutation(async ({ ctx , input }) => {
      //если передается id юзера и это делает админ, то задача добавляется для выбранного админом юзеру,
      //иначе задача добавляется юзеру, который ее добавил
      const id = input.idUser && ctx.session.user.role === "ADMIN"  ? input.idUser : ctx.session.user.id

      return db.task.create({
        data: {
          date: input.date,
          userId: id,
          color: input.color,
          status: input.status,
          priority: input.priority,
          task: input.task,
          description: input.description,   
        },
      });
    }),

//обновление задачи (пользователем/админом)
    update: protectedProcedure
        .input(z.object({
            idUser: z.string().cuid().optional(),          //передает админ когда обновляет юзеру задачу
            id_task: z.string().cuid(),                    //обязателен чтобы найти задачу
            date: z.coerce.date().optional(),
            color: z.enum(["NO", "GREEN", "YELLOW", "RED"]).optional(),
            status: z.enum(["COMPLETED", "NOTCOMPLETED"]).optional(),
            priority: z.number().min(1).max(10).optional(),
            task: z.string().min(1).optional(),
            description: z.string().optional(), 
    }))
    .mutation(async ({ ctx, input }) => {
        const id = input.idUser && ctx.session.user.role === "ADMIN"  ? input.idUser : ctx.session.user.id

        const { id_task,idUser, ...updateData } = input;
        return db.task.update({
            where: {
                id: input.id_task,
                userId: id,
            },
            data: updateData, // Prisma автоматически пропустит undefined-поля
        });
    }),

//удаление задачи (пользователем/админом)
    delete: protectedProcedure
      .input(z.object({ 
        id_task: z.string().cuid(),
        idUser: z.string().cuid().optional(),          //передает админ когда удаляет юзеру задачу
      }))
      .mutation(async ({ ctx, input }) => {
          const id = input.idUser && ctx.session.user.role === "ADMIN"  ? input.idUser : ctx.session.user.id

          return db.task.delete({
            where: {
              id: input.id_task,
              userId: id,
            },
          });
    }),
//------------------------------------------------

//----------------------запросы к таблице--------------------
//Запрос на получение записей на неделю (пользователем/админом записей пользователя)
    getByWeek: protectedProcedure
    .input(z.object({
      idUser: z.string().cuid().optional(),          //передает админ когда хочет получить задачи юзера
      date: z.coerce.date(),                         // клиент присылает любую дату внутри недели
    }))
    .query(async ({ ctx, input }) => {
      const weekStart = startOfWeek(input.date, { weekStartsOn: 1 }); // Понедельник
      const weekEnd = endOfWeek(input.date, { weekStartsOn: 1 });     // Воскресенье
      const id = input.idUser && ctx.session.user.role === "ADMIN"  ? input.idUser : ctx.session.user.id

      return db.task.findMany({
        where: {
          userId: id,
          date: {
            gte: weekStart,
            lte: weekEnd,
          },
        },
        orderBy: { date: "asc" },
      });
    }),

//Запрос на получение записей на месяц
    getByMonth: protectedProcedure
    .input(z.object({
      idUser: z.string().cuid().optional(),          //передает админ когда хочет получить задачи юзера
      date: z.coerce.date()                          // клиент присылает любую дату внутри месяца
    }))
    .query(async({ ctx, input }) => {
      const monthStart = startOfMonth(input.date);
      const monthEnd = endOfMonth(input.date);
      const id = input.idUser && ctx.session.user.role === "ADMIN"  ? input.idUser : ctx.session.user.id

      return db.task.findMany({
        where: {
          userId: id,
          date: {
            gte: monthStart,
            lte: monthEnd,
          },
        },
        orderBy: { date: "asc" },
      });
    })

});


