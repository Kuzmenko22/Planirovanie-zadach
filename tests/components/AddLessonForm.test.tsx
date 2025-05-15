import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { AddLessonForm } from '~/app/_components/teacherSchedule/AddLessonForm';

const mutateAsync = vi.fn();

vi.mock('~/trpc/react', () => ({
  api: {
    group: { getAll: { useQuery: vi.fn(() => ({ data: [{ id: '1', name: '54ж' }] })) } },
    classroom: { getAll: { useQuery: vi.fn(() => ({ data: [{ id: '1', name: '4-406' }] })) } },
    teacher: { getSubjectsByTeacher: { useQuery: vi.fn(() => ({ data: [{ id: '1', name: 'Экономика' }] })) } },
    subgroup: { getAll: { useQuery: vi.fn(() => ({ data: [{ id: '1', name: '1' }] })) } },
    lesson: { create: { useMutation: vi.fn(() => ({ mutateAsync })) } },
    useUtils: vi.fn(() => ({ teacher: { getAllLessons: { invalidate: vi.fn() } } })),
  },
}));

beforeEach(() => {
  cleanup();
  vi.clearAllMocks();
  vi.spyOn(window, 'alert').mockImplementation(() => {});
});

describe('AddLessonForm', () => {
  it('рендерит и открывает форму', () => {
    render(<AddLessonForm teacherId="t1" />);
    fireEvent.click(screen.getByText('Добавить занятие'));
    
    const selects = Array.from(document.querySelectorAll<HTMLSelectElement>('select'));
    expect(selects.length).toBeGreaterThanOrEqual(6);
  });

  it('валидирует обязательные поля', async () => {
    render(<AddLessonForm teacherId="t1" />);
    fireEvent.click(screen.getByText('Добавить занятие'));
    fireEvent.click(screen.getByText('Сохранить'));
    await waitFor(() =>
      expect(window.alert).toHaveBeenCalledWith('Пожалуйста, заполните все обязательные поля.')
    );
  });

  it('валидирует выбор нескольких групп для LAB', async () => {
    render(<AddLessonForm teacherId="t1" />);
    fireEvent.click(screen.getByText('Добавить занятие'));
    
    const selects = Array.from(document.querySelectorAll<HTMLSelectElement>('select'));
    if (selects[1]) {
      fireEvent.change(selects[1], { target: { value: 'LAB' } });
    }
    
    const groupSelect = selects[0];
    if (groupSelect) {
      Object.defineProperty(groupSelect, 'selectedOptions', {
        value: [
          { value: '1' } as HTMLOptionElement,
          { value: '2' } as HTMLOptionElement,
        ],
      });
      fireEvent.change(groupSelect);
    }
    
    await waitFor(() =>
      expect(window.alert).toHaveBeenCalledWith('Выбор нескольких групп доступен только для лекций.')
    );
  });

  it('успешно отправляет форму при корректных данных', async () => {
    mutateAsync.mockResolvedValue({ success: true, message: 'OK' });
    render(<AddLessonForm teacherId="t1" />);
    fireEvent.click(screen.getByText('Добавить занятие'));
    
    const selects = Array.from(document.querySelectorAll<HTMLSelectElement>('select'));
    
    if (selects[0]) fireEvent.change(selects[0], { target: { value: '1' } });
    if (selects[1]) fireEvent.change(selects[1], { target: { value: 'LECTURE' } });
    if (selects[2]) fireEvent.change(selects[2], { target: { value: '1' } });
    if (selects[3]) fireEvent.change(selects[3], { target: { value: '1' } });
    if (selects[4]) fireEvent.change(selects[4], { target: { value: 'MONDAY' } });
    if (selects[5]) fireEvent.change(selects[5], { target: { value: '08:00 - 09:35' } });
    if (selects[6]) fireEvent.change(selects[6], { target: { value: 'ODD' } });
    
    fireEvent.click(screen.getByText('Сохранить'));
    await waitFor(() =>
      expect(window.alert).toHaveBeenCalledWith('Занятие успешно добавлено')
    );
    expect(mutateAsync).toHaveBeenCalled();
  });
});
