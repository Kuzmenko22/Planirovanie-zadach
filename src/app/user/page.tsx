"use client"
import { api } from "~/trpc/react";
import { useSearchParams } from "next/navigation";
import UserTable from "../_components/user/userTable";
import Pagination from "../ui/pagination";
import { UserAddForm } from "../_components/user/UserAddForm";
import { useState } from "react";

export default function UsersPage() {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const limit = 10;

  const { data: currentUser, isLoading: isUserLoading } = api.user.getCurrent.useQuery();
  const { data, isLoading } = api.user.getPaginated.useQuery({ page: currentPage, limit });

  const [isAddUserFormVisible, setAddUserFormVisible] = useState(false);
  if (isLoading || !data) return <div className="p-4">Загрузка...</div>;

  if (isUserLoading) {
    return <div className="p-4">Загрузка...</div>;
  }

  if (!currentUser || currentUser.role !== "ADMIN") {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Нет доступа</h1>
        <p>У вас недостаточно прав для просмотра этой страницы.</p>
      </div>
    );
  }

  const handleAddUserClick = () => {
    setAddUserFormVisible((prevState) => !prevState);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Пользователи</h1>
      <button
        onClick={handleAddUserClick}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {isAddUserFormVisible ? "Закрыть форму" : "Добавить пользователя"}
      </button>
      {isAddUserFormVisible && <UserAddForm />}
      <UserTable users={data.users} />
      <div className="mt-4">
        <Pagination totalPages={Math.ceil(data.total / limit)} />
      </div>
    </div>
  );
}