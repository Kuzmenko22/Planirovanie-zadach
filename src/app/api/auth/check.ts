import { $Enums } from "@prisma/client";
import { auth } from "~/server/auth";


export async function isAdmin() {
  const session = await auth();
  if (!session) return false;
  return session.user.role === $Enums.Role.ADMIN;
}


export async function isTeacherOrAdmin() {
  const session = await auth();
  if (!session) return false;
  return session.user.role === $Enums.Role.ADMIN || session.user.role === $Enums.Role.TEACHER;
}


export async function isStudent() {
  const session = await auth();
  if (!session) return false;
  return session.user.role === $Enums.Role.STUDENT;
}


export async function isTeacherOrAdminForCurrentLesson(lessonTeacherUserId: string) {
    const session = await auth();
    if (!session) return false;
  
    const isAdmin = session.user.role === $Enums.Role.ADMIN;
    //const isOwnLesson = session.user.role === $Enums.Role.TEACHER && session.user.id === lessonTeacherUserId;
    const isOwnLesson = session.user.role === $Enums.Role.TEACHER && session.user.teacherId === lessonTeacherUserId;

    return isAdmin || isOwnLesson;
  }
  
