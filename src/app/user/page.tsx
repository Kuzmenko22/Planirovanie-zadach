'use client';

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Role } from "@prisma/client";

import UserTable from "~/app/_components/user/userTable";
import Pagination from "../ui/pagination";
import { UserAddForm } from "~/app/_components/user/UserAddForm";

type User = {
  id: string;
  firstname: string | null;
  surname: string | null;
  lastname: string | null;
  email: string | null;
  role: Role;
  emailVerified: Date | null;
};

const USERS_PER_PAGE = 10;

type Props = {
  users: User[];   
  totalUsersCount: number;
};

export default function UsersPage() {
  const [isAddUserFormVisible, setAddUserFormVisible] = useState(false);
  const searchParams = useSearchParams();

  const users: User[] = [
    {
      id: "1",
      firstname: "Иван",
      surname: "Иванов",
      lastname: "Иванович",
      email: "ivanovich@gmail.com",
      role: "ADMIN",
      emailVerified: new Date("2025-07-17"),
    },
  ];

  const currentPage = Number(searchParams.get("page")) || 1;

  const totalUsersCount = users.length;

  const totalPages = Math.ceil(totalUsersCount / USERS_PER_PAGE);

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
          <UserAddForm />
        </div>
      )}

      <UserTable users={users} />

      <div className="flex justify-center pt-4">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
