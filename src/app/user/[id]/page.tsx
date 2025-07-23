"use client";

import { UserEditForm } from "~/app/_components/user/UserEditForm";

type PageProps = {
  params: {
    id: string;
  };
};

export default function UserPage({ params }: PageProps) {
  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-xl font-semibold mb-4">Редактирование пользователя</h1>
      <UserEditForm />
    </div>
  );
}
