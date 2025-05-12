'use client';

import React from "react";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import type { Role } from "@prisma/client";

type User = {
  id: string;
  firstname: string | null;
  surname: string | null;
  lastname: string | null;
  email: string | null;
  role: Role;
  emailVerified: Date | null;
};

export default function UserTable({ users }: { users: User[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 border">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Имя</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Фамилия</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Отчество</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Email</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Роль</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Подтверждён</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700"></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{user.firstname ?? '-'}</td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{user.surname ?? '-'}</td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{user.lastname ?? '-'}</td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{user.email ?? '-'}</td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{user.role}</td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                {user.emailVerified ? new Date(user.emailVerified).toLocaleDateString() : "—"}
              </td>
              <td className="px-4 py-2">
                <Link href={`/user/${user.id}`} className="text-blue-500 hover:text-blue-700">
                  <PencilSquareIcon className="w-5 h-5" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
