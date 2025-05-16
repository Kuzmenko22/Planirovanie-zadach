"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

export function AddClassroomForm() {
  const utils = api.useUtils();
  const createClassroom = api.classroom.create.useMutation({
    onSuccess: async () => {
      setMessage("Аудитория успешно добавлена");
      setForm({ name: "" });
      await utils.classroom.getAll.invalidate();
    },
    onError: (err) => {
      setMessage(`Ошибка: ${err.message}`);
    },
  });

  const [form, setForm] = useState({
    name: "",
  });

  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!form.name.trim()) {
      setMessage("Название не должно быть пустым");
      return;
    }

    await createClassroom.mutateAsync({ name: form.name.trim() });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4 my-6 p-4 border rounded bg-white shadow">
      <div>
        <label className="block text-sm font-medium text-gray-700">Название аудитории</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="mt-1 block w-full border rounded px-2 py-1"
          placeholder="Например: 1-101"
        />
      </div>

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Добавить
      </button>

      {message && (
        <p className="text-sm text-gray-700">{message}</p>
      )}
    </form>
  );
}
