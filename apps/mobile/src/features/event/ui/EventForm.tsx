import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Switch,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {CategoryPicker} from './CategoryPicker';
import {DateTimePicker} from './DateTimePicker';
import {useEventForm} from '../model/useEventForm';
import type {CalendarEvent} from '../../../shared/types';

interface EventFormProps {
  initialData?: Partial<CalendarEvent>;
  selectedDate?: Date;
  onSubmit: (data: Omit<CalendarEvent, 'id'>) => void;
  submitButton: React.ReactNode;
}

export const EventForm: React.FC<EventFormProps> = ({
  initialData,
  selectedDate,
  onSubmit,
  submitButton,
}) => {
  const {formData, errors, updateField, validate, getEventData} = useEventForm({
    initialData,
    selectedDate,
  });

  const handleSubmit = () => {
    if (validate()) {
      onSubmit(getEventData());
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.field}>
          <Text style={styles.label}>제목</Text>
          <TextInput
            style={[styles.input, errors.title && styles.inputError]}
            value={formData.title}
            onChangeText={(text) => updateField('title', text)}
            placeholder="일정 제목"
            placeholderTextColor="#AAAAAA"
            maxLength={50}
          />
          {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
        </View>

        <CategoryPicker
          value={formData.category}
          onChange={(category) => updateField('category', category)}
        />

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>하루 종일</Text>
          <Switch
            value={formData.isAllDay}
            onValueChange={(value) => updateField('isAllDay', value)}
            trackColor={{false: '#E0E0E0', true: '#FFB8BC'}}
            thumbColor={formData.isAllDay ? '#FF8B94' : '#FFFFFF'}
          />
        </View>

        <DateTimePicker
          label="시작"
          value={formData.startTime}
          onChange={(date) => updateField('startTime', date)}
          mode={formData.isAllDay ? 'date' : 'datetime'}
        />

        {!formData.isAllDay && (
          <DateTimePicker
            label="종료"
            value={formData.endTime}
            onChange={(date) => updateField('endTime', date)}
            mode="datetime"
            minimumDate={formData.startTime}
          />
        )}
        {errors.endTime && (
          <Text style={styles.errorText}>{errors.endTime}</Text>
        )}

        <View style={styles.field}>
          <Text style={styles.label}>메모</Text>
          <TextInput
            style={[styles.input, styles.memoInput]}
            value={formData.memo}
            onChangeText={(text) => updateField('memo', text)}
            placeholder="메모 (선택)"
            placeholderTextColor="#AAAAAA"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            maxLength={200}
          />
        </View>
      </ScrollView>

      <View style={styles.footer} onTouchEnd={handleSubmit}>
        {submitButton}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  inputError: {
    borderColor: '#FF6B6B',
  },
  memoInput: {
    minHeight: 100,
    paddingTop: 14,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 12,
    marginTop: 4,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
});
