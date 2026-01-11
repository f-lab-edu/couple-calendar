import {useState, useCallback} from 'react';
import type {CalendarEvent} from '../../../shared/types';

type Category = CalendarEvent['category'];

interface EventFormData {
  title: string;
  startTime: Date;
  endTime: Date;
  isAllDay: boolean;
  category: Category;
  memo: string;
}

interface UseEventFormOptions {
  initialData?: Partial<EventFormData>;
  selectedDate?: Date;
}

export const useEventForm = (options: UseEventFormOptions = {}) => {
  const {initialData, selectedDate} = options;

  const getDefaultStartTime = () => {
    const date = selectedDate ? new Date(selectedDate) : new Date();
    date.setHours(date.getHours() + 1, 0, 0, 0);
    return date;
  };

  const getDefaultEndTime = () => {
    const date = getDefaultStartTime();
    date.setHours(date.getHours() + 1);
    return date;
  };

  const [formData, setFormData] = useState<EventFormData>({
    title: initialData?.title || '',
    startTime: initialData?.startTime || getDefaultStartTime(),
    endTime: initialData?.endTime || getDefaultEndTime(),
    isAllDay: initialData?.isAllDay || false,
    category: initialData?.category || 'DATE',
    memo: initialData?.memo || '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof EventFormData, string>>>({});

  const updateField = useCallback(
    <K extends keyof EventFormData>(field: K, value: EventFormData[K]) => {
      setFormData((prev) => {
        const updated = {...prev, [field]: value};

        // If start time is updated and end time is before start time, adjust end time
        if (field === 'startTime' && value instanceof Date) {
          if (prev.endTime <= value) {
            const newEndTime = new Date(value);
            newEndTime.setHours(newEndTime.getHours() + 1);
            updated.endTime = newEndTime;
          }
        }

        return updated;
      });

      // Clear error for the field
      if (errors[field]) {
        setErrors((prev) => ({...prev, [field]: undefined}));
      }
    },
    [errors],
  );

  const validate = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof EventFormData, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = '제목을 입력해주세요';
    }

    if (formData.endTime <= formData.startTime && !formData.isAllDay) {
      newErrors.endTime = '종료 시간은 시작 시간 이후여야 합니다';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const getEventData = useCallback((): Omit<CalendarEvent, 'id'> => {
    return {
      title: formData.title.trim(),
      startTime: formData.startTime,
      endTime: formData.isAllDay
        ? new Date(formData.startTime.setHours(23, 59, 59))
        : formData.endTime,
      isAllDay: formData.isAllDay,
      category: formData.category,
      memo: formData.memo.trim() || undefined,
    };
  }, [formData]);

  const reset = useCallback(() => {
    const resetDate = selectedDate ? new Date(selectedDate) : new Date();
    resetDate.setHours(resetDate.getHours() + 1, 0, 0, 0);
    const resetEndDate = new Date(resetDate);
    resetEndDate.setHours(resetEndDate.getHours() + 1);

    setFormData({
      title: '',
      startTime: resetDate,
      endTime: resetEndDate,
      isAllDay: false,
      category: 'DATE',
      memo: '',
    });
    setErrors({});
  }, [selectedDate]);

  return {
    formData,
    errors,
    updateField,
    validate,
    getEventData,
    reset,
    isValid: !formData.title.trim() ? false : true,
  };
};
