import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Card} from '../../../shared/ui';
import {useCoupleStore} from '../../../shared/store';
import {getDaysSince} from '../../../shared/api';

interface DdayWidgetProps {
  onPress?: () => void;
}

export const DdayWidget: React.FC<DdayWidgetProps> = ({onPress}) => {
  const {couple, partner, isConnected} = useCoupleStore();

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

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Card style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.emoji}>💑</Text>
          <Text style={styles.partnerName}>{partner?.name || '파트너'}님과</Text>
        </View>
        <View style={styles.ddayContainer}>
          <Text style={styles.ddayLabel}>함께한 지</Text>
          <Text style={styles.ddayCount}>{daysSinceStart}</Text>
          <Text style={styles.ddayUnit}>일</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
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
});
