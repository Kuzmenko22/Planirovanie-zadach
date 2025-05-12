"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import type { Role } from "@prisma/client";

export function UserAddForm() {
  const router = useRouter();
  const utils = api.useUtils();

  const createUser = api.user.create.useMutation({
    onSuccess: () => {
      utils.user.getPaginated.invalidate();
      router.push("/user"); 
    },
  });

  const [formState, setFormState] = useState({
    firstname: "",
    surname: "",
    lastname: "",
    email: "",
    role: "STUDENT" as Role,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createUser.mutateAsync(formState);
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

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Создать
      </button>
    </form>
  );
}
