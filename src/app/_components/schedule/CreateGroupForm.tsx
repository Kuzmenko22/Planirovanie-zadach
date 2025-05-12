"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

export function CreateGroupForm() {
  const [showForm, setShowForm] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [subgroups, setSubgroups] = useState<string[]>([""]);

  const utils = api.useUtils();
  const createGroup = api.group.create.useMutation({
    onSuccess: async () => {
      await utils.group.getAll.invalidate();
      setGroupName("");
      setSubgroups([""]);
      setShowForm(false);
    },
    onError: (err) => {
      alert(err.message);
    },
  });

  const handleSubmit = () => {
    if (!groupName.trim() || subgroups.some((name) => !name.trim())) {
      alert("Заполните название группы и все подгруппы");
      return;
    }

    createGroup.mutate({
      name: groupName,
      subgroups: subgroups.filter((name) => name.trim() !== ""),
    });
  };

  const addSubgroup = () => {
    if (subgroups.length < 2) {
      setSubgroups([...subgroups, ""]);
    }
  };

  const updateSubgroup = (index: number, value: string) => {
    const updated = [...subgroups];
    updated[index] = value;
    setSubgroups(updated);
  };

  const removeSubgroup = (index: number) => {
    if (subgroups.length > 1) {
      setSubgroups(subgroups.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="mt-8">
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Добавить группу
        </button>
      ) : (
        <div className="bg-white p-4 rounded shadow space-y-4">
          <div>
            <label className="block font-semibold">Название группы</label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>

          <div className="space-y-2">
            <label className="block font-semibold">Подгруппы</label>
            {subgroups.map((sg, index) => (
              <div key={index} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={sg}
                  onChange={(e) => updateSubgroup(index, e.target.value)}
                  className="flex-1 border p-2 rounded"
                />
                {subgroups.length > 1 && (
                  <button
                    onClick={() => removeSubgroup(index)}
                    className="text-red-500 text-sm underline"
                  >
                    Удалить
                  </button>
                )}
              </div>
            ))}
            {subgroups.length < 2 && (
              <button
                onClick={addSubgroup}
                className="text-blue-600 text-sm underline"
              >
                + Добавить подгруппу
              </button>
            )}
          </div>

          <div className="flex gap-4 items-center">
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
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
