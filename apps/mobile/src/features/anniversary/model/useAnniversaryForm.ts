import {useCallback, useState} from 'react';
import type {
  CreateAnniversaryRequest,
  UpdateAnniversaryRequest,
} from '../../../shared/types';

interface AnniversaryFormData {
  title: string;
  date: Date;
  isRecurring: boolean;
  description: string;
}

type Errors = Partial<Record<keyof AnniversaryFormData, string>>;

interface UseAnniversaryFormOptions {
  initialData?: Partial<AnniversaryFormData>;
}

const toIsoDate = (d: Date): string => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

export const useAnniversaryForm = (
  options: UseAnniversaryFormOptions = {},
) => {
  const {initialData} = options;

  const [formData, setFormData] = useState<AnniversaryFormData>({
    title: initialData?.title ?? '',
    date: initialData?.date ?? new Date(),
    isRecurring: initialData?.isRecurring ?? false,
    description: initialData?.description ?? '',
  });
  const [errors, setErrors] = useState<Errors>({});

  const updateField = useCallback(
    <K extends keyof AnniversaryFormData>(
      field: K,
      value: AnniversaryFormData[K],
    ) => {
      setFormData((prev) => ({...prev, [field]: value}));
      setErrors((prev) => (prev[field] ? {...prev, [field]: undefined} : prev));
    },
    [],
  );

  const validate = useCallback((): boolean => {
    const next: Errors = {};
    const trimmedTitle = formData.title.trim();
    if (!trimmedTitle) {
      next.title = '제목을 입력해주세요';
    } else if (trimmedTitle.length > 50) {
      next.title = '제목은 50자 이내로 입력해주세요';
    }

    if (formData.description.length > 200) {
      next.description = '메모는 200자 이내로 입력해주세요';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }, [formData]);

  const getCreateRequest = useCallback((): CreateAnniversaryRequest => {
    const trimmedDesc = formData.description.trim();
    return {
      title: formData.title.trim(),
      date: toIsoDate(formData.date),
      isRecurring: formData.isRecurring,
      description: trimmedDesc ? trimmedDesc : undefined,
    };
  }, [formData]);

  const getUpdateRequest = useCallback((): UpdateAnniversaryRequest => {
    const trimmedDesc = formData.description.trim();
    return {
      title: formData.title.trim(),
      date: toIsoDate(formData.date),
      isRecurring: formData.isRecurring,
      description: trimmedDesc ? trimmedDesc : undefined,
    };
  }, [formData]);

  return {
    formData,
    errors,
    updateField,
    validate,
    getCreateRequest,
    getUpdateRequest,
    isValid: formData.title.trim().length > 0,
  };
};
