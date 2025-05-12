import { PrismaClient, LessonType, WeekType, DayOfWeek } from "@prisma/client";
const prisma = new PrismaClient();

type LessonSeed = {
  subject: string;
  day: DayOfWeek;
  time: [string, string];
  type: LessonType;
};

async function createSubjectIfNotExists(name: string, teacherId: string) {
  const existing = await prisma.subject.findFirst({
    where: { name },
  });

  if (existing) return existing;

  return await prisma.subject.create({
    data: {
      name,
      teacherId,
    },
  });
}

async function main() {
  const group = await prisma.group.upsert({
    where: { name: "22з" },
    update: {},
    create: {
      name: "22з",
      subgroups: {
        create: [{ name: "1" }],
      },
    },
  });

  const subgroup = await prisma.subgroup.findFirst({
    where: {
      name: "1",
      groupId: group.id,
    },
  });

  const user = await prisma.user.upsert({
    where: { email: "teacher@example.com" },
    update: {},
    create: {
      email: "teacher@example.com",
      firstname: "Иван",
      surname: "Иванов",
      lastname: "Сергеевич",
      role: "TEACHER",
      teacherProfile: {
        create: {},
      },
    },
  });

  const teacher = await prisma.teacher.findUniqueOrThrow({
    where: { userId: user.id },
  });

  const classroom = await prisma.classroom.upsert({
    where: { name: "1-101" },
    update: {},
    create: { name: "1-101" },
  });

  const subjectNames = ["Математика", "Информатика", "Физика", "История", "Физкультура"];
  const subjects: Record<string, { id: string }> = {};

  for (const name of subjectNames) {
    const subject = await createSubjectIfNotExists(name, teacher.id);
    subjects[name] = subject;
  }

  const lessons: LessonSeed[] = [
    { subject: "Математика", day: DayOfWeek.MONDAY, time: ["08:00", "09:35"], type: LessonType.LECTURE },
    { subject: "Информатика", day: DayOfWeek.MONDAY, time: ["09:45", "11:20"], type: LessonType.LAB },
    { subject: "Физика", day: DayOfWeek.TUESDAY, time: ["08:00", "09:35"], type: LessonType.LECTURE },
    { subject: "История", day: DayOfWeek.TUESDAY, time: ["09:45", "11:20"], type: LessonType.KSR },
    { subject: "Информатика", day: DayOfWeek.WEDNESDAY, time: ["08:00", "09:35"], type: LessonType.LAB },
    { subject: "Физкультура", day: DayOfWeek.WEDNESDAY, time: ["09:45", "11:20"], type: LessonType.LECTURE },
    { subject: "Математика", day: DayOfWeek.THURSDAY, time: ["08:00", "09:35"], type: LessonType.LECTURE },
    { subject: "Физика", day: DayOfWeek.FRIDAY, time: ["08:00", "09:35"], type: LessonType.LECTURE },
  ];
  

  for (const lesson of lessons) {
    const subject = subjects[lesson.subject];
    if (!subject) continue;

    const baseData = {
      subjectId: subject.id,
      teacherId: teacher.id,
      classroomId: classroom.id,
      startTime: lesson.time[0],
      endTime: lesson.time[1],
      type: lesson.type,
      weekType: WeekType.ODD,
      dayOfWeek: lesson.day,
    };

    if (lesson.type === LessonType.LAB && subgroup) {
      await prisma.lesson.create({
        data: {
          ...baseData,
          subgroupId: subgroup.id,
        },
      });
    } else {
      await prisma.lesson.create({
        data: {
          ...baseData,
          groups: {
            connect: [{ id: group.id }],
          },
        },
      });
    }
  }

  console.log("✅ База данных успешно заполнена!");
}

main()
  .catch((e) => {
    console.error("❌ Ошибка сидирования:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
