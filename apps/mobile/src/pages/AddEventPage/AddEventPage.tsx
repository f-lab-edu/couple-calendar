import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {GradientBackground} from '../../shared/ui';
import {EventForm} from '../../features/event';
import {useCreateEvent} from '../../shared/api';
import {useCalendarStore} from '../../shared/store';
import type {CalendarEvent} from '../../shared/types';

export const AddEventPage: React.FC = () => {
  const navigation = useNavigation();
  const {selectedDate} = useCalendarStore();
  const createEvent = useCreateEvent();

  const handleSubmit = async (data: Omit<CalendarEvent, 'id'>) => {
    try {
      await createEvent.mutateAsync(data);
      Alert.alert('완료', '일정이 추가되었습니다', [
        {
          text: '확인',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch {
      Alert.alert('오류', '일정 추가에 실패했습니다');
    }
  };

  const handleClose = () => {
    navigation.goBack();
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>취소</Text>
          </TouchableOpacity>
          <Text style={styles.title}>새 일정</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.content}>
          <EventForm
            selectedDate={selectedDate}
            onSubmit={handleSubmit}
            submitButton={
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  createEvent.isPending && styles.submitButtonDisabled,
                ]}
                disabled={createEvent.isPending}>
                {createEvent.isPending ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.submitButtonText}>저장</Text>
                )}
              </TouchableOpacity>
            }
          />
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#666666',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  placeholder: {
    width: 50,
  },
  content: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  submitButton: {
    backgroundColor: '#FF8B94',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
});
