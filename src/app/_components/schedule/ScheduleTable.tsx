"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { api } from "~/trpc/react";

const daysOfWeek = [
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
];

const timeSlots = [
  "08:00 - 09:35",
  "09:45 - 11:20",
  "11:30 - 13:05",
  "13:55 - 15:30",
  "15:40 - 17:15",
];

const lessonTypeMap: Record<string, string> = {
  LECTURE: "Лекция",
  LAB: "Лабораторная",
  KSR: "КСР",
};


type WeekType = "EVEN" | "ODD";

const dayMap: Record<string, string> = {
  MONDAY: "Понедельник",
  TUESDAY: "Вторник",
  WEDNESDAY: "Среда",
  THURSDAY: "Четверг",
  FRIDAY: "Пятница",
  SATURDAY: "Суббота",
};

export function ScheduleTable() {
  const searchParams = useSearchParams();
  const groupId = searchParams.get("groupId") ?? "";

  const [weekType, setWeekType] = useState<WeekType>("ODD");

  const { data: lessons = [], isLoading } = api.schedule.getAll.useQuery({
    groupId,
  });

  const toggleWeekType = () => {
    setWeekType((prev) => (prev === "ODD" ? "EVEN" : "ODD"));
  };

  const filteredLessons = lessons.filter((lesson) => lesson.weekType === weekType);

  const getLesson = (day: string, time: string) =>
    filteredLessons.find((lesson) => {
      const timeSlot = `${lesson.startTime} - ${lesson.endTime}`;
      return day === dayMap[lesson.dayOfWeek] && timeSlot === time;
    });

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-center mb-4">
        <button
          onClick={toggleWeekType}
          className="px-4 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-100 transition"
        >
          {weekType === "ODD" ? "Нечётная неделя" : "Чётная неделя"}
        </button>
      </div>

      <table className="table-auto w-full border border-gray-300 rounded">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Время</th>
            {daysOfWeek.map((day) => (
              <th key={day} className="p-2 text-center">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timeSlots.map((slot) => (
            <tr key={slot}>
              <td className="bg-blue-50 font-bold text-center">{slot}</td>
              {daysOfWeek.map((day) => {
                const lesson = getLesson(day, slot);
                return (
                  <td key={day} className="border px-2 py-1 text-sm align-top">
                    {lesson ? (
                      <div>
                        <div className="font-semibold">{lesson.subject.name}</div>
                        <div className="italic text-xs text-gray-600">{lessonTypeMap[lesson.type] ?? lesson.type}</div>
                        <div className="text-sm">
                          {lesson.teacher.user.surname}{" "}
                          {lesson.teacher.user.firstname?.[0]}.{" "}
                          {lesson.teacher.user.lastname?.[0]}.{" "}
                          {lesson.subgroup && (<div className="text-xs text-purple-600">Подгруппа: {lesson.subgroup.name}</div>)}
                        </div>
                        <div className="text-xs text-blue-700">
                          {lesson.classroom.name}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-gray-300">–</div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


