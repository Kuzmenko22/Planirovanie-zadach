import { postRouter } from "~/server/api/routers/post";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "./routers/user";
import { scheduleRouter } from "./routers/schedule";
import { groupRouter } from "./routers/group";
import { teacherRouter } from "./routers/teacher";
import { subgroupRouter } from "./routers/subgroup";
import { classroomRouter } from "./routers/classroom";
import { lessonRouter } from "./routers/lesson";
import { subjectRouter } from "./routers/subject";
//import { gradeRouter } from "./routers/grade";
//import { squadRouter } from "./routers/squad";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  teacher: teacherRouter,
  group: groupRouter,
  schedule: scheduleRouter,
  post: postRouter,
  subgroup: subgroupRouter,
  classroom: classroomRouter,
  user: userRouter,
  lesson: lessonRouter,
  subject: subjectRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
