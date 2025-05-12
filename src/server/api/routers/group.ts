import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { z } from "zod";
import { isAdmin} from "~/app/api/auth/check";

export const groupRouter = createTRPCRouter({
  getAll: publicProcedure.query(async () => {
    return db.group.findMany();
  }),
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        subgroups: z
          .array(z.string().min(1))
          .min(1, "Минимум одна подгруппа")
          .max(2, "Максимум две подгруппы"),
      })
    )
    .mutation(async ({ input }) => {
      const isUserAdmin = await isAdmin();
      if (!isUserAdmin) {
        throw new Error("У вас нет прав на создание группы. Это может делать только администратор.");
      }

      const existingGroup = await db.group.findUnique({
        where: { name: input.name },
        include: { subgroups: true },
      });

      if (existingGroup) {
        const newSubgroupNames = input.subgroups;
        const existingSubgroups = existingGroup.subgroups;

        
        const subgroupsToDelete = existingSubgroups.filter(
          (sub) => !newSubgroupNames.includes(sub.name)
        );

        const subgroupsToDeleteIds = subgroupsToDelete.map((sub) => sub.id);

        
        if (subgroupsToDeleteIds.length > 0) {
          await db.lesson.deleteMany({
            where: {
              subgroupId: {
                in: subgroupsToDeleteIds,
              },
            },
          });

          
          await db.subgroup.deleteMany({
            where: {
              id: {
                in: subgroupsToDeleteIds,
              },
            },
          });
        }

        
        const subgroupsToCreate = newSubgroupNames.filter(
          (name) => !existingSubgroups.some((sub) => sub.name === name)
        );

        const updatedGroup = await db.group.update({
          where: { id: existingGroup.id },
          data: {
            subgroups: {
              create: subgroupsToCreate.map((name) => ({ name })),
            },
          },
          include: { subgroups: true },
        });

        return updatedGroup;
      } else {
        
        const newGroup = await db.group.create({
          data: {
            name: input.name,
            subgroups: {
              create: input.subgroups.map((name) => ({ name })),
            },
          },
          include: {
            subgroups: true,
          },
        });

        return newGroup;
      }
    }),
});
