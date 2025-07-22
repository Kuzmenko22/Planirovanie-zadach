'use client';

import { PencilSquareIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import type { User } from "@prisma/client";

type Props = {
  users: User[];
};

export default function UserTable({ users }: Props) {
  return (
    <div className="overflow-x-auto rounded border shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <TableHeader title="Фамилия" />
            <TableHeader title="Имя" />
            <TableHeader title="Отчество" />
            <TableHeader title="Email" />
            <TableHeader title="Роль" />
            <TableHeader title="Подтверждён" />
            <th className="px-4 py-2" />
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id}>
              <TableCell>{user.surname ?? '—'}</TableCell>
              <TableCell>{user.firstname ?? '—'}</TableCell>
              <TableCell>{user.lastname ?? '—'}</TableCell>
              <TableCell>{user.email ?? '—'}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                {user.emailVerified
                  ? new Date(user.emailVerified).toLocaleDateString()
                  : '—'}
              </TableCell>
              <td className="px-4 py-2">
                <Link
                  href={`/user/${user.id}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <PencilSquareIcon className="h-5 w-5" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TableHeader({ title }: { title: string }) {
  return (
    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
      {title}
    </th>
  );
}

function TableCell({ children }: { children: React.ReactNode }) {
  return <td className="px-4 py-2 text-sm">{children}</td>;
}
