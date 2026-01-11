import {create} from 'zustand';

interface CalendarState {
  selectedDate: Date;
  currentMonth: Date;
  setSelectedDate: (date: Date) => void;
  setCurrentMonth: (date: Date) => void;
  goToPrevMonth: () => void;
  goToNextMonth: () => void;
  goToToday: () => void;
}

export const useCalendarStore = create<CalendarState>((set, get) => ({
  selectedDate: new Date(),
  currentMonth: new Date(),
  setSelectedDate: (selectedDate) => set({selectedDate}),
  setCurrentMonth: (currentMonth) => set({currentMonth}),
  goToPrevMonth: () => {
    const current = get().currentMonth;
    const prevMonth = new Date(current.getFullYear(), current.getMonth() - 1, 1);
    set({currentMonth: prevMonth});
  },
  goToNextMonth: () => {
    const current = get().currentMonth;
    const nextMonth = new Date(current.getFullYear(), current.getMonth() + 1, 1);
    set({currentMonth: nextMonth});
  },
  goToToday: () => {
    const today = new Date();
    set({selectedDate: today, currentMonth: today});
  },
}));
