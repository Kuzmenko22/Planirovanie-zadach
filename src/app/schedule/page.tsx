"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import { ScheduleTable } from "../_components/schedule/ScheduleTable";
import { CreateGroupForm } from "../_components/schedule/CreateGroupForm";

export default function SchedulePage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const selectedGroupId = searchParams.get("groupId") ?? "";
  const [groupId, setGroupId] = useState<string>(selectedGroupId);

  const { data: groups = [], isLoading: loadingGroups } = api.group.getAll.useQuery();
  const { data: currentUser, isLoading: isUserLoading } = api.user.getCurrent.useQuery();

  useEffect(() => {
    if (selectedGroupId !== groupId) {
      setGroupId(selectedGroupId);
    }
  }, [selectedGroupId]);

  const handleGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newGroupId = e.target.value;
    const url = new URL(window.location.href);
    if (newGroupId) {
      url.searchParams.set("groupId", newGroupId);
    } else {
      url.searchParams.delete("groupId");
    }
    router.push(url.toString());
  };

  if (loadingGroups || isUserLoading) {
    return <div className="p-4">Загрузка...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Расписание учебных групп</h1>

      <div className="mb-6">
        <label className="mr-2 font-medium">Группа:</label>
        <select
          value={groupId}
          onChange={handleGroupChange}
          className="border px-4 py-2 rounded"
        >
          <option value="">Выберите группу</option>
          {groups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>
      </div>

      <ScheduleTable />

      {currentUser?.role === "ADMIN" && (
      <div className="mt-8">
      <CreateGroupForm />
      </div>
      )}
    </div>
  );
}




