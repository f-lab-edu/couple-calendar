import React from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import {Card} from '../../../shared/ui';
import {DdayBadge} from '../../../entities/anniversary';
import {useUpcomingAnniversaries, getDaysUntil} from '../../../shared/api';
import type {Anniversary} from '../../../shared/types';

interface AnniversaryListProps {
  maxItems?: number;
}

export const AnniversaryList: React.FC<AnniversaryListProps> = ({
  maxItems = 3,
}) => {
  const {data: anniversaries, isLoading} = useUpcomingAnniversaries(maxItems);

  if (isLoading) {
    return (
      <Card style={styles.container}>
        <Text style={styles.loadingText}>불러오는 중...</Text>
      </Card>
    );
  }

  if (!anniversaries || anniversaries.length === 0) {
    return (
      <Card style={styles.container}>
        <Text style={styles.emptyText}>등록된 기념일이 없습니다</Text>
      </Card>
    );
  }

  const renderItem = ({item}: {item: Anniversary}) => {
    const daysUntil = getDaysUntil(new Date(item.date));

    return (
      <View style={styles.item}>
        <View style={styles.itemInfo}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <Text style={styles.itemDate}>
            {new Date(item.date).toLocaleDateString('ko-KR', {
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>
        <DdayBadge days={daysUntil} size="small" />
      </View>
    );
  };

  return (
    <Card style={styles.container}>
      <Text style={styles.title}>다가오는 기념일</Text>
      <FlatList
        data={anniversaries}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 2,
  },
  itemDate: {
    fontSize: 13,
    color: '#999999',
  },
  separator: {
    height: 1,
    backgroundColor: '#F0F0F0',
  },
  loadingText: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
    paddingVertical: 20,
  },
});
