'use client';

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Role } from "@prisma/client";

import UserTable from "~/app/_components/user/userTable";
import Pagination from "../ui/pagination";

// Тип пользователя
type MockUser = {
  id: string;
  firstname: string | null;
  surname: string | null;
  lastname: string | null;
  email: string | null;
  role: Role;
  emailVerified: Date | null;
};

// Мок-данные для отображения
const mockUsers: MockUser[] = Array.from({ length: 53 }).map((_, i) => ({
  id: String(i + 1),
  firstname: `Имя${i + 1}`,
  surname: `Фамилия${i + 1}`,
  lastname: `Отчество${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: i % 2 === 0 ? Role.ADMIN : Role.USER,
  emailVerified: i % 3 === 0 ? new Date() : null,
}));

const USERS_PER_PAGE = 10;

export default function UsersPage() {
  const [isAddUserFormVisible, setAddUserFormVisible] = useState(false);
  const searchParams = useSearchParams();

  const currentPage = Number(searchParams.get("page")) || 1;
  const totalPages = Math.ceil(mockUsers.length / USERS_PER_PAGE);

  const paginatedUsers = mockUsers.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE
  );

  return (
    <div className="p-6 space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Пользователи</h1>
        <button
          onClick={() => setAddUserFormVisible((prev) => !prev)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {isAddUserFormVisible ? "Закрыть форму" : "Добавить пользователя"}
        </button>
      </header>

      {isAddUserFormVisible && (
        <div className="text-sm text-gray-600 border p-4 rounded bg-gray-50">
          Заглушка формы добавления пользователя.
        </div>
      )}

      <UserTable users={paginatedUsers} />

      <div className="flex justify-center pt-4">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
