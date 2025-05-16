"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { api } from "~/trpc/react";
import { TeacherScheduleTable } from "../_components/teacherSchedule/teacherScheduleTable";
import { AddLessonForm } from "../_components/teacherSchedule/AddLessonForm";
import { FindFreeClassrooms } from "../_components/teacherSchedule/FindFreeClassrooms";
import { AddClassroomForm } from "../_components/teacherSchedule/AddClassroom";


export default function TeacherSchedulePage() {
  const searchParams = useSearchParams();
  const selectedId = searchParams.get("teacherId");
  const router = useRouter();

  const { data: teachers = [], isLoading } = api.teacher.getAll.useQuery();
  const { data: currentUser, isLoading: isUserLoading } = api.user.getCurrent.useQuery();

  useEffect(() => {
    if (!selectedId && teachers.length > 0) {
      const defaultId = teachers[0]?.id;
      if (defaultId) {
        router.replace(`/teacherSchedule?teacherId=${defaultId}`);
      }
    }
  }, [selectedId, teachers, router]);

  if (isLoading || isUserLoading) {
    return <div className="p-4">Загрузка...</div>;
  }

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Расписание преподавателя</h1>

      <div className="mb-4">
        <label htmlFor="teacherSelect" className="mr-2">
          Выберите преподавателя для просмотра расписания:
        </label>
        <select
          id="teacherSelect"
          className="border p-2 rounded"
          value={selectedId ?? ""}
          onChange={(e) =>
            router.push(`/teacherSchedule?teacherId=${e.target.value}`)
          }
        >
          {teachers.map((teacher) => (
            <option key={teacher.id} value={teacher.id}>
              {teacher.user.surname} {teacher.user.firstname} {teacher.user.lastname}
            </option>
          ))}
        </select>
      </div>

      <TeacherScheduleTable />

      <div className="flex justify-center mb-4">
        <FindFreeClassrooms />
      </div>

      {currentUser?.role !== "STUDENT" && (
      <>
      <hr className="my-6" />
      <h2 className="text-xl font-semibold mb-2">Добавить занятие</h2>
      <AddLessonForm teacherId={selectedId ?? ""} />
      </>
      )}

      {currentUser?.role === "ADMIN" && (
        <>
          <hr className="my-6" />
          <h2 className="text-xl font-semibold mb-2">Добавить аудиторию</h2>
          <AddClassroomForm />
        </>
      )}
    </div>
  );
}
