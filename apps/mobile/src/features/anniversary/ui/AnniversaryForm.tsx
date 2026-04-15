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
  TouchableOpacity,
} from 'react-native';
import {DateTimePicker} from '../../event/ui/DateTimePicker';
import {useAnniversaryForm} from '../model/useAnniversaryForm';
import type {
  Anniversary,
  CreateAnniversaryRequest,
  UpdateAnniversaryRequest,
} from '../../../shared/types';

interface AnniversaryFormProps {
  initial?: Anniversary;
  mode: 'create' | 'edit';
  submitting?: boolean;
  submitLabel?: string;
  onSubmit: (
    body: CreateAnniversaryRequest | UpdateAnniversaryRequest,
  ) => void;
}

export const AnniversaryForm: React.FC<AnniversaryFormProps> = ({
  initial,
  mode,
  submitting = false,
  submitLabel,
  onSubmit,
}) => {
  const {formData, errors, updateField, validate, getCreateRequest, getUpdateRequest} =
    useAnniversaryForm({
      initialData: initial
        ? {
            title: initial.title,
            date: new Date(`${initial.date}T00:00:00`),
            isRecurring: initial.isRecurring,
            description: initial.description ?? '',
          }
        : undefined,
    });

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit(mode === 'create' ? getCreateRequest() : getUpdateRequest());
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.field}>
          <Text style={styles.label}>제목</Text>
          <TextInput
            style={[styles.input, errors.title && styles.inputError]}
            value={formData.title}
            onChangeText={(text) => updateField('title', text)}
            placeholder="예: 프로포즈 기념일"
            placeholderTextColor="#AAAAAA"
            maxLength={50}
          />
          {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
        </View>

        <DateTimePicker
          label="날짜"
          value={formData.date}
          mode="date"
          onChange={(d) => updateField('date', d)}
        />

        <View style={styles.switchRow}>
          <View style={{flex: 1}}>
            <Text style={styles.switchLabel}>매년 반복</Text>
            <Text style={styles.switchHint}>
              매년 같은 날짜마다 기념일로 표시됩니다
            </Text>
          </View>
          <Switch
            value={formData.isRecurring}
            onValueChange={(v) => updateField('isRecurring', v)}
            trackColor={{false: '#E0E0E0', true: '#FFB8BC'}}
            thumbColor={formData.isRecurring ? '#FF8B94' : '#FFFFFF'}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>메모 (선택)</Text>
          <TextInput
            style={[
              styles.input,
              styles.memoInput,
              errors.description && styles.inputError,
            ]}
            value={formData.description}
            onChangeText={(text) => updateField('description', text)}
            placeholder="메모"
            placeholderTextColor="#AAAAAA"
            multiline
            textAlignVertical="top"
            maxLength={200}
          />
          {errors.description && (
            <Text style={styles.errorText}>{errors.description}</Text>
          )}
          <Text style={styles.counter}>{formData.description.length}/200</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
          disabled={submitting}
          onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>
            {submitting ? '저장 중...' : submitLabel ?? '저장'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  scroll: {flex: 1},
  scrollContent: {padding: 20},
  field: {marginBottom: 20},
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
  inputError: {borderColor: '#FF6B6B'},
  memoInput: {minHeight: 100, paddingTop: 14},
  errorText: {color: '#FF6B6B', fontSize: 12, marginTop: 4},
  counter: {
    fontSize: 11,
    color: '#AAAAAA',
    textAlign: 'right',
    marginTop: 4,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  switchLabel: {fontSize: 14, fontWeight: '600', color: '#333333'},
  switchHint: {fontSize: 12, color: '#999999', marginTop: 2},
  footer: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  submitButton: {
    backgroundColor: '#FF8B94',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonDisabled: {backgroundColor: '#CCCCCC'},
  submitButtonText: {color: '#FFFFFF', fontSize: 17, fontWeight: '600'},
});
