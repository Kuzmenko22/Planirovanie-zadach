"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

export function FindFreeClassrooms() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [weekType, setWeekType] = useState<"ODD" | "EVEN">("ODD");
  const [dayOfWeek, setDayOfWeek] = useState<
    "MONDAY" | "TUESDAY" | "WEDNESDAY" |
    "THURSDAY" | "FRIDAY" | "SATURDAY"
  >("MONDAY");
  const [timeSlot, setTimeSlot] = useState("08:00 - 09:35");

  const timeSlotMap: Record<string, { startTime: string; endTime: string }> = {
    "08:00 - 09:35": { startTime: "08:00", endTime: "09:35" },
    "09:45 - 11:20": { startTime: "09:45", endTime: "11:20" },
    "11:30 - 13:05": { startTime: "11:30", endTime: "13:05" },
    "13:55 - 15:30": { startTime: "13:55", endTime: "15:30" },
    "15:40 - 17:15": { startTime: "15:40", endTime: "17:15" },
  };

  const slot = timeSlotMap[timeSlot]!;

  const availableQuery = api.classroom.getAvailable.useQuery(
    {
      weekType,
      dayOfWeek,
      startTime: slot.startTime,
      endTime: slot.endTime,
    },
    { enabled: false }
  );

  const toggleForm = () => setIsFormOpen((v) => !v);
  const handleSearch = async () => { await availableQuery.refetch(); };

  return (
    <div className="my-4">
      <button
        onClick={toggleForm}
        className="px-4 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-50"
      >
        {isFormOpen ? "Скрыть поиск аудиторий" : "Найти свободные аудитории"}
      </button>

      {isFormOpen && (
        <div className="mt-4 space-y-3 p-4 border rounded bg-white shadow">
          <div>
            <label className="mr-2">Тип недели:</label>
            <select
              value={weekType}
              onChange={(e) => setWeekType(e.target.value as any)}
              className="border p-1 rounded"
            >
              <option value="ODD">Нечётная</option>
              <option value="EVEN">Чётная</option>
            </select>
          </div>

          <div>
            <label className="mr-2">День недели:</label>
            <select
              value={dayOfWeek}
              onChange={(e) => setDayOfWeek(e.target.value as any)}
              className="border p-1 rounded"
            >
              <option value="MONDAY">Понедельник</option>
              <option value="TUESDAY">Вторник</option>
              <option value="WEDNESDAY">Среда</option>
              <option value="THURSDAY">Четверг</option>
              <option value="FRIDAY">Пятница</option>
              <option value="SATURDAY">Суббота</option>
            </select>
          </div>

          <div>
            <label className="mr-2">Время:</label>
            <select
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              className="border p-1 rounded"
            >
              {Object.keys(timeSlotMap).map((ts) => (
                <option key={ts} value={ts}>
                  {ts}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSearch}
            className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Искать
          </button>

          {availableQuery.isFetching && <p>Загрузка...</p>}
          {availableQuery.data && (
            <ul className="mt-3 space-y-1">
              {availableQuery.data.map((room) => (
                <li key={room.id} className="px-2 py-1 border rounded">
                  {room.name}
                </li>
              ))}
              {availableQuery.data.length === 0 && (
                <li>Нет свободных аудиторий</li>
              )}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
