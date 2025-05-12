import { UserEditForm } from "~/app/_components/user/UserEditForm";

export default function UserPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Редактирование пользователя</h1>
      <UserEditForm userId={params.id} />
    </div>
  );
}
