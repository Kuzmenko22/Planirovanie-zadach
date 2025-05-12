
"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

interface AddLessonFormProps {
  teacherId: string;
}

export function AddLessonForm({ teacherId }: AddLessonFormProps) {
  const [showForm, setShowForm] = useState(false);
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]);
  const [subgroupId, setSubgroupId] = useState("");
  const [lessonType, setLessonType] = useState<"LECTURE" | "LAB" | "KSR">("LECTURE");
  const [subjectId, setSubjectId] = useState("");
  const [classroomId, setClassroomId] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState<
    "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY"
  >("MONDAY");
  const [timeSlot, setTimeSlot] = useState("08:00 - 09:35");
  const [weekType, setWeekType] = useState<"ODD" | "EVEN">("ODD");

  
  const { data: groups = [] } = api.group.getAll.useQuery();
  const { data: classrooms = [] } = api.classroom.getAll.useQuery();
  
  
  const { data: subjects = [] } = api.teacher.getSubjectsByTeacher.useQuery({ teacherId });

  const { data: subgroups = [] } = api.subgroup.getAll.useQuery(
    { groupId: selectedGroupIds[0] ?? "" },
    { enabled: selectedGroupIds.length === 1 }
  );

  const createLesson = api.lesson.create.useMutation();

  
  const timeSlotMap: Record<string, { startTime: string; endTime: string }> = {
    "08:00 - 09:35": { startTime: "08:00", endTime: "09:35" },
    "09:45 - 11:20": { startTime: "09:45", endTime: "11:20" },
    "11:30 - 13:05": { startTime: "11:30", endTime: "13:05" },
    "13:55 - 15:30": { startTime: "13:55", endTime: "15:30" },
    "15:40 - 17:15": { startTime: "15:40", endTime: "17:15" },
  };

  const handleGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const values = Array.from(e.target.selectedOptions, opt => opt.value);
    if (lessonType !== "LECTURE" && values.length > 1) {
      alert("Выбор нескольких групп доступен только для лекций.");
      return;
    }
    setSelectedGroupIds(values);
    setSubgroupId("");
  };

  const utils = api.useUtils();

  const handleSave = async () => {
    
    if (
      selectedGroupIds.length === 0 ||
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

    const res = await createLesson.mutateAsync({
      teacherId,
      subjectId,
      classroomId,
      groupIds: selectedGroupIds,
      subgroupId: lessonType === "LAB" ? subgroupId : null,
      type: lessonType,
      dayOfWeek,
      startTime: slot.startTime,
      endTime: slot.endTime,
      weekType,
    });

    if (!res.success) {
      alert(res.message);
    } else {
      alert("Занятие успешно добавлено");
      setShowForm(false);
      await utils.teacher.getAllLessons.invalidate({ teacherId });
    }
  };

  return (
    <div className="mb-6">
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Добавить занятие
        </button>
      ) : (
        <div className="border p-4 space-y-4 bg-white shadow rounded">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label>Группы</label>
              <select
                multiple={lessonType === "LECTURE"}
                //value={selectedGroupIds}
                value={lessonType === "LECTURE" ? selectedGroupIds : selectedGroupIds[0] ?? ""}
                onChange={handleGroupChange}
                className="w-full border p-2 rounded"
              >
                {groups.map(g => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label>Тип занятия</label>
              <select
                value={lessonType}
                onChange={e => setLessonType(e.target.value as any)}
                className="w-full border p-2 rounded"
              >
                <option value="LECTURE">Лекция</option>
                <option value="LAB">Лабораторная</option>
                <option value="KSR">КСР</option>
              </select>
            </div>

            {lessonType === "LAB" && (
              <div>
                <label>Подгруппа</label>
                <select
                  value={subgroupId}
                  onChange={e => setSubgroupId(e.target.value)}
                  className="w-full border p-2 rounded"
                >
                  <option value="">Выберите подгруппу</option>
                  {subgroups.map(sg => (
                    <option key={sg.id} value={sg.id}>{sg.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label>Предмет</label>
              <select
                value={subjectId}
                onChange={e => setSubjectId(e.target.value)}
                className="w-full border p-2 rounded"
              >
                <option value="">Выберите предмет</option>
                {subjects.map(sub => (
                  <option key={sub.id} value={sub.id}>{sub.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label>Аудитория</label>
              <select
                value={classroomId}
                onChange={e => setClassroomId(e.target.value)}
                className="w-full border p-2 rounded"
              >
                <option value="">Выберите аудиторию</option>
                {classrooms.map(rm => (
                  <option key={rm.id} value={rm.id}>{rm.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label>День недели</label>
              <select
                value={dayOfWeek}
                onChange={e => setDayOfWeek(e.target.value as any)}
                className="w-full border p-2 rounded"
              >
                {[{ label: "Понедельник", value: "MONDAY" },
                  { label: "Вторник",   value: "TUESDAY" },
                  { label: "Среда",     value: "WEDNESDAY" },
                  { label: "Четверг",   value: "THURSDAY" },
                  { label: "Пятница",   value: "FRIDAY" },
                  { label: "Суббота",   value: "SATURDAY" }]
                  .map(d => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label>Время</label>
              <select
                value={timeSlot}
                onChange={e => setTimeSlot(e.target.value)}
                className="w-full border p-2 rounded"
              >
                {Object.keys(timeSlotMap).map(ts => (
                  <option key={ts} value={ts}>{ts}</option>
                ))}
              </select>
            </div>

            <div>
              <label>Тип недели</label>
              <select
                value={weekType}
                onChange={e => setWeekType(e.target.value as any)}
                className="w-full border p-2 rounded"
              >
                <option value="ODD">Нечётная</option>
                <option value="EVEN">Чётная</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Сохранить
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="text-red-500 underline"
            >
              Отмена
            </button>
          </div>
        </div>
      )}
    </div>
  );
}