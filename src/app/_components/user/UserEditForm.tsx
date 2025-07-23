"use client";

import { useState, useEffect } from "react";
import type { Role } from "@prisma/client";

type UserFormState = {
  firstname: string;
  surname: string;
  lastname: string;
  email: string;
  role: Role;
};

type UserEditFormProps = {
  initialData?: UserFormState;
};

export function UserEditForm({ initialData }: UserEditFormProps) {
  const [formState, setFormState] = useState<UserFormState>({
    firstname: "",
    surname: "",
    lastname: "",
    email: "",
    role: "USER",
  });

  useEffect(() => {
    if (initialData) {
      setFormState(initialData);
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Обновить пользователя:", formState);
    alert("Пользователь обновлен");
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
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Фамилия</label>
        <input
          name="surname"
          value={formState.surname}
          onChange={handleChange}
          className="mt-1 block w-full border rounded px-2 py-1"
          required
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
          type="email"
          value={formState.email}
          onChange={handleChange}
          className="mt-1 block w-full border rounded px-2 py-1"
          required
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
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
        </select>
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Сохранить
      </button>
    </form>
  );
}
