import { type Session } from "next-auth";
import Link from "next/link";

export async function Navbar({ session }: { session: Session }) {
  return (
    <div className="navbar bg-base-100">
      <Link href="/api/auth/signout" className="btn">
        {session.user?.name}
        Выход
      </Link>
      <Link href="/" className="btn">
        Расписание студента
      </Link>
      <Link href="/teacherSchedule" className="btn">
        Расписание преподавателя
      </Link>
      <Link href="/user" className="btn">
        Пользователи
      </Link>
    </div>
  );
}