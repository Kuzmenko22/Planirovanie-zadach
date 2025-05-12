"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

interface EditLessonModalProps {
  teacherId: string;
  lesson: {
    id: string;
    type: "LECTURE" | "LAB" | "KSR";
    subject: { id: string };
    classroom: { id: string };
    dayOfWeek: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY";
    weekType: "ODD" | "EVEN";
    startTime: string;
    endTime: string;
    groups: { id: string }[];
    subgroup?: { id: string };
  };
  onClose: () => void;
  onSave: () => void;   
  onDelete: () => void; 
}

export function EditLessonModal({
  teacherId,
  lesson,
  onClose,
  onSave,
  onDelete,
}: EditLessonModalProps) {
  const utils = api.useUtils();

  
  const [lessonType, setLessonType] = useState<"LECTURE" | "LAB" | "KSR">(lesson.type);
  const [subjectId, setSubjectId] = useState(lesson.subject.id);
  const [classroomId, setClassroomId] = useState(lesson.classroom.id);
  const [dayOfWeek, setDayOfWeek] = useState(lesson.dayOfWeek);
  const [weekType, setWeekType] = useState(lesson.weekType);
  const [timeSlot, setTimeSlot] = useState(`${lesson.startTime} - ${lesson.endTime}`);

  const [groupIds, setGroupIds] = useState<string[]>(
    lesson.groups.map((g) => g.id)
  );
  const [subgroupId, setSubgroupId] = useState<string>(lesson.subgroup?.id ?? "");

  
  const { data: groups = [] } = api.group.getAll.useQuery();
  const { data: classrooms = [] } = api.classroom.getAll.useQuery();
  const { data: allLessons = [] } = api.teacher.getAllLessons.useQuery({ teacherId });
  const { data: subgroups = [] } = api.subgroup.getAll.useQuery(
    { groupId: groupIds[0] ?? "" },
    { enabled: lessonType === "LAB" && groupIds.length === 1 }
  );

  
  const uniqueSubjects = Array.from(
    new Map(allLessons.map((l) => [l.subject.id, l.subject])).values()
  );

  
  const timeSlotMap: Record<string, { startTime: string; endTime: string }> = {
    "08:00 - 09:35": { startTime: "08:00", endTime: "09:35" },
    "09:45 - 11:20": { startTime: "09:45", endTime: "11:20" },
    "11:30 - 13:05": { startTime: "11:30", endTime: "13:05" },
    "13:55 - 15:30": { startTime: "13:55", endTime: "15:30" },
    "15:40 - 17:15": { startTime: "15:40", endTime: "17:15" },
  };

  const timeSlots = Object.keys(timeSlotMap);

  const daysOfWeek = [
    { label: "Понедельник", value: "MONDAY" },
    { label: "Вторник",   value: "TUESDAY" },
    { label: "Среда",     value: "WEDNESDAY" },
    { label: "Четверг",   value: "THURSDAY" },
    { label: "Пятница",   value: "FRIDAY" },
    { label: "Суббота",   value: "SATURDAY" },
  ];

  
  const updateLesson = api.lesson.update.useMutation({
    async onSuccess() {
      await utils.teacher.getAllLessons.invalidate({ teacherId });
      onSave();
    },
  });
  const deleteLesson = api.lesson.delete.useMutation({
    async onSuccess() {
      await utils.teacher.getAllLessons.invalidate({ teacherId });
      onDelete();
    },
  });

  const handleSave = async () => {
    if (
      groupIds.length === 0 ||
      !subjectId ||
      !classroomId ||
      !dayOfWeek ||
      !timeSlot ||
      !weekType ||
      (lessonType === "LAB" && !subgroupId)
    ) {
      alert("Пожалуйста, заполните все обязательные поля.");
      return;
    }
    const slot = timeSlotMap[timeSlot];
    if (!slot) {
      alert("Неверный временной слот.");
      return;
    }

    const res = await updateLesson.mutateAsync({
      id: lesson.id,
      teacherId,
      subjectId,
      classroomId,
      groupIds,
      subgroupId: lessonType === "LAB" ? subgroupId : null,
      type: lessonType,
      dayOfWeek,
      startTime: slot.startTime,
      endTime: slot.endTime,
      weekType,
    });
    if (!res.success) {
      alert(res.message);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Удалить это занятие?")) return;
    await deleteLesson.mutateAsync({ id: lesson.id });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-3xl">
        <h2 className="text-xl font-semibold mb-4">Редактировать занятие</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label>Тип занятия</label>
            <select
              value={lessonType}
              onChange={(e) => {
                setLessonType(e.target.value as any);
                setGroupIds([]);
                setSubgroupId("");
              }}
              className="w-full border p-2 rounded"
            >
              <option value="LECTURE">Лекция</option>
              <option value="LAB">Лабораторная</option>
              <option value="KSR">КСР</option>
            </select>
          </div>

          <div>
            <label>Группы</label>
            {lessonType === "LECTURE" ? (
              <select
                multiple
                value={groupIds}
                onChange={(e) =>
                  setGroupIds(Array.from(e.target.selectedOptions, o => o.value))
                }
                className="w-full border p-2 rounded"
              >
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            ) : (
              <select
                value={groupIds[0] ?? ""}
                onChange={(e) => setGroupIds([e.target.value])}
                className="w-full border p-2 rounded"
              >
                <option value="">Выберите группу</option>
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {lessonType === "LAB" && (
            <div>
              <label>Подгруппа</label>
              <select
                value={subgroupId}
                onChange={(e) => setSubgroupId(e.target.value)}
                className="w-full border p-2 rounded"
              >
                <option value="">Выберите подгруппу</option>
                {subgroups.map((sg) => (
                  <option key={sg.id} value={sg.id}>
                    {sg.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label>Предмет</label>
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="">Выберите предмет</option>
              {uniqueSubjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Аудитория</label>
            <select
              value={classroomId}
              onChange={(e) => setClassroomId(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="">Выберите аудиторию</option>
              {classrooms.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>День недели</label>
            <select
              value={dayOfWeek}
              onChange={(e) => setDayOfWeek(e.target.value as any)}
              className="w-full border p-2 rounded"
            >
              {daysOfWeek.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Время</label>
            <select
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              className="w-full border p-2 rounded"
            >
              {timeSlots.map((ts) => (
                <option key={ts} value={ts}>
                  {ts}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Тип недели</label>
            <select
              value={weekType}
              onChange={(e) => setWeekType(e.target.value as any)}
              className="w-full border p-2 rounded"
            >
              <option value="ODD">Нечётная</option>
              <option value="EVEN">Чётная</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-6">
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Сохранить
          </button>
          <button
            onClick={handleDelete}
            className="text-red-500 underline"
          >
            Удалить
          </button>
          <button
            onClick={onClose}
            className="text-gray-500 underline"
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
}


