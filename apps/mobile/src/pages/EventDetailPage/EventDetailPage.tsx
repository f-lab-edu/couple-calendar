import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {GradientBackground, Card} from '../../shared/ui';
import {useDeleteEvent} from '../../shared/api';
import type {CalendarEvent} from '../../shared/types';
import {CATEGORY_COLORS} from '../../shared/types';

type EventDetailRouteParams = {
  EventDetail: {
    event: CalendarEvent;
  };
};

export const EventDetailPage: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<EventDetailRouteParams, 'EventDetail'>>();
  const {event} = route.params;

  const deleteEvent = useDeleteEvent();

  const handleClose = () => {
    navigation.goBack();
  };

  const handleDelete = () => {
    Alert.alert('일정 삭제', '이 일정을 삭제하시겠습니까?', [
      {text: '취소', style: 'cancel'},
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteEvent.mutateAsync(event.id);
            navigation.goBack();
          } catch {
            Alert.alert('오류', '일정 삭제에 실패했습니다');
          }
        },
      },
    ]);
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });
  };

  const getCategoryLabel = (category: CalendarEvent['category']) => {
    const labels = {
      DATE: '데이트',
      ANNIVERSARY: '기념일',
      INDIVIDUAL: '개인',
      OTHER: '기타',
    };
    return labels[category];
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>닫기</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>일정 상세</Text>
          <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
            {deleteEvent.isPending ? (
              <ActivityIndicator size="small" color="#FF6B6B" />
            ) : (
              <Text style={styles.deleteButtonText}>삭제</Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <Card style={styles.card}>
            <View style={styles.titleRow}>
              <View
                style={[
                  styles.categoryBadge,
                  {backgroundColor: CATEGORY_COLORS[event.category]},
                ]}
              />
              <Text style={styles.title}>{event.title}</Text>
            </View>

            <View style={styles.infoSection}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>카테고리</Text>
                <Text style={styles.infoValue}>
                  {getCategoryLabel(event.category)}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>날짜</Text>
                <Text style={styles.infoValue}>
                  {formatDate(event.startTime)}
                </Text>
              </View>

              {!event.isAllDay && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>시간</Text>
                  <Text style={styles.infoValue}>
                    {formatTime(event.startTime)} - {formatTime(event.endTime)}
                  </Text>
                </View>
              )}

              {event.isAllDay && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>하루 종일</Text>
                  <Text style={styles.infoValue}>예</Text>
                </View>
              )}
            </View>

            {event.memo && (
              <View style={styles.memoSection}>
                <Text style={styles.memoLabel}>메모</Text>
                <Text style={styles.memoText}>{event.memo}</Text>
              </View>
            )}
          </Card>
        </ScrollView>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  deleteButton: {
    padding: 8,
  },
  deleteButtonText: {
    fontSize: 16,
    color: '#FF6B6B',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  card: {
    padding: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  categoryBadge: {
    width: 4,
    height: 24,
    borderRadius: 2,
    marginRight: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333333',
    flex: 1,
  },
  infoSection: {
    gap: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoLabel: {
    fontSize: 15,
    color: '#666666',
  },
  infoValue: {
    fontSize: 15,
    color: '#333333',
    fontWeight: '500',
  },
  memoSection: {
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  memoLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  memoText: {
    fontSize: 15,
    color: '#333333',
    lineHeight: 22,
  },
});
