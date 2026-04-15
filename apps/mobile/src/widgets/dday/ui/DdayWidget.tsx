import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Card} from '../../../shared/ui';
import {useCoupleStore} from '../../../shared/store';
import {getDaysSince, useAnniversaries} from '../../../shared/api';
import {DdayBadge} from '../../../entities/anniversary';
import type {Anniversary} from '../../../shared/types';

interface DdayWidgetProps {
  onPress?: () => void;
  onPressAnniversary?: (anniversary: Anniversary) => void;
  maxUpcoming?: number;
}

export const DdayWidget: React.FC<DdayWidgetProps> = ({
  onPress,
  onPressAnniversary,
  maxUpcoming = 3,
}) => {
  const {couple, partner, isConnected} = useCoupleStore();
  const {
    data: anniversaries,
    isLoading,
    isError,
  } = useAnniversaries(true);

  if (!isConnected || !couple) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        <Card style={styles.container}>
          <Text style={styles.emoji}>💕</Text>
          <Text style={styles.notConnectedText}>
            파트너와 연결하고{'\n'}D-Day를 시작하세요
          </Text>
        </Card>
      </TouchableOpacity>
    );
  }

  const daysSinceStart = getDaysSince(new Date(couple.startDate));

  // daysUntil >= 0 항목만 다가오는 기념일로, 서버 정렬(오름차순) 그대로 사용
  const upcoming = (anniversaries ?? [])
    .filter((a) => a.daysUntil >= 0)
    .slice(0, maxUpcoming);

  return (
    <View>
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        <Card style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.emoji}>💑</Text>
            <Text style={styles.partnerName}>
              {partner?.name || '파트너'}님과
            </Text>
          </View>
          <View style={styles.ddayContainer}>
            <Text style={styles.ddayLabel}>함께한 지</Text>
            <Text style={styles.ddayCount}>{daysSinceStart}</Text>
            <Text style={styles.ddayUnit}>일</Text>
          </View>
        </Card>
      </TouchableOpacity>

      <Card style={styles.upcomingCard}>
        <Text style={styles.upcomingTitle}>다가오는 기념일</Text>
        {isLoading ? (
          <Text style={styles.stateText}>불러오는 중...</Text>
        ) : isError ? (
          <Text style={styles.stateText}>불러올 수 없습니다</Text>
        ) : upcoming.length === 0 ? (
          <Text style={styles.stateText}>등록된 기념일이 없습니다</Text>
        ) : (
          upcoming.map((a, idx) => (
            <TouchableOpacity
              key={a.id}
              onPress={() => onPressAnniversary?.(a)}
              activeOpacity={0.7}
              style={[
                styles.upcomingRow,
                idx < upcoming.length - 1 && styles.upcomingRowBorder,
              ]}>
              <View style={styles.upcomingInfo}>
                <Text style={styles.upcomingItemTitle} numberOfLines={1}>
                  {a.title}
                </Text>
                <Text style={styles.upcomingItemDate}>
                  {formatDate(a.date)}
                  {a.type === 'AUTO' ? '  · 자동' : ''}
                </Text>
              </View>
              <DdayBadge days={a.daysUntil} size="small" type={a.type} />
            </TouchableOpacity>
          ))
        )}
      </Card>
    </View>
  );
};

const formatDate = (isoDate: string): string => {
  const d = new Date(`${isoDate}T00:00:00`);
  return d.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  emoji: {
    fontSize: 24,
    marginRight: 8,
  },
  partnerName: {
    fontSize: 16,
    color: '#666666',
  },
  ddayContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  ddayLabel: {
    fontSize: 16,
    color: '#666666',
    marginRight: 8,
  },
  ddayCount: {
    fontSize: 48,
    fontWeight: '700',
    color: '#FF8B94',
  },
  ddayUnit: {
    fontSize: 20,
    color: '#FF8B94',
    marginLeft: 4,
  },
  notConnectedText: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 8,
  },
  upcomingCard: {
    marginTop: 12,
    padding: 16,
  },
  upcomingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
  },
  upcomingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  upcomingRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  upcomingInfo: {
    flex: 1,
    marginRight: 12,
  },
  upcomingItemTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 2,
  },
  upcomingItemDate: {
    fontSize: 12,
    color: '#999999',
  },
  stateText: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
    paddingVertical: 16,
  },
});
