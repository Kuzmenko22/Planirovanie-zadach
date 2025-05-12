import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";

export const subjectRouter = createTRPCRouter({
  getAll: publicProcedure.query(async () => {
    return db.subject.findMany({
      include: {
        teacher: {
          include: {
            user: true,
          },
        },
      },
    });
  }),
});
