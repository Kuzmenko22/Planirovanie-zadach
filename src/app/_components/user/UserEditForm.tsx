"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import type { Role } from "@prisma/client";

type Props = {
  userId: string;
};

export function UserEditForm({ userId }: Props) {
  const router = useRouter();
  const utils = api.useUtils();

  const { data: user, isLoading } = api.user.getById.useQuery({ id: userId });
  const { data: allSubjects = [] } = api.subject.getAll.useQuery(); 

  const updateUser = api.user.update.useMutation({
    onSuccess: async () => {
      utils.user.getById.invalidate({ id: userId });
      await utils.user.getPaginated.invalidate();
      router.push("/user");
      setTimeout(() => router.refresh(), 100);
    },
  });

  const [formState, setFormState] = useState({
    firstname: "",
    surname: "",
    lastname: "",
    email: "",
    role: "STUDENT" as Role,
    subjectIds: [] as string[], 
  });

  useEffect(() => {
    if (user) {
      setFormState({
        firstname: user.firstname ?? "",
        surname: user.surname ?? "",
        lastname: user.lastname ?? "",
        email: user.email ?? "",
        role: user.role,
        subjectIds: user.teacherProfile?.subjects?.map((s) => s.id) ?? [], 
      });
    }
  }, [user]);

  if (isLoading || !user) return <div>Загрузка...</div>;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions).map((opt) => opt.value);
    setFormState((prev) => ({
      ...prev,
      subjectIds: selected,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isChangingFromTeacher =
      user.role === "TEACHER" &&
      (formState.role === "STUDENT" || formState.role === "ADMIN");

    if (isChangingFromTeacher) {
      const confirmed = window.confirm(
        `Внимание! Все занятия преподавателя "${user.firstname ?? ""} ${user.surname ?? ""}" будут безвозвратно удалены. Вы уверены, что хотите продолжить?`
      );
      if (!confirmed) return;
    }

    await updateUser.mutateAsync({ id: userId, ...formState });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Имя</label>
        <input
          name="firstname"
          value={formState.firstname}
          onChange={handleChange}
          className="mt-1 block w-full border rounded px-2 py-1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Фамилия</label>
        <input
          name="surname"
          value={formState.surname}
          onChange={handleChange}
          className="mt-1 block w-full border rounded px-2 py-1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Отчество</label>
        <input
          name="lastname"
          value={formState.lastname}
          onChange={handleChange}
          className="mt-1 block w-full border rounded px-2 py-1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          name="email"
          value={formState.email}
          onChange={handleChange}
          className="mt-1 block w-full border rounded px-2 py-1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Роль</label>
        <select
          name="role"
          value={formState.role}
          onChange={handleChange}
          className="mt-1 block w-full border rounded px-2 py-1"
        >
          <option value="STUDENT">STUDENT</option>
          <option value="ADMIN">ADMIN</option>
          <option value="TEACHER">TEACHER</option>
        </select>
      </div>

      {formState.role === "TEACHER" && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Предметы</label>
          <select
            multiple
            value={formState.subjectIds}
            onChange={handleSubjectChange}
            className="mt-1 block w-full border rounded px-2 py-1"
          >
            {allSubjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Сохранить
      </button>
    </form>
  );
}
