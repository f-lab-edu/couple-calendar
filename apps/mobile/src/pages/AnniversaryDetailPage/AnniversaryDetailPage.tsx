import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  useNavigation,
  useRoute,
  RouteProp,
} from '@react-navigation/native';
import {GradientBackground, Card} from '../../shared/ui';
import {DdayBadge} from '../../entities/anniversary';
import {AnniversaryForm} from '../../features/anniversary';
import {
  useDeleteAnniversary,
  useUpdateAnniversary,
} from '../../shared/api';
import type {
  Anniversary,
  CreateAnniversaryRequest,
  UpdateAnniversaryRequest,
} from '../../shared/types';

type AnniversaryDetailRouteParams = {
  AnniversaryDetail: {anniversary: Anniversary};
};

export const AnniversaryDetailPage: React.FC = () => {
  const navigation = useNavigation();
  const route =
    useRoute<
      RouteProp<AnniversaryDetailRouteParams, 'AnniversaryDetail'>
    >();
  const {anniversary} = route.params;

  const [isEditing, setIsEditing] = useState(false);
  const updateAnniversary = useUpdateAnniversary();
  const deleteAnniversary = useDeleteAnniversary();

  const isAuto = anniversary.type === 'AUTO';

  const handleDelete = () => {
    if (isAuto) {
      Alert.alert('자동 기념일', '자동 기념일은 삭제할 수 없습니다.');
      return;
    }
    Alert.alert('기념일 삭제', '이 기념일을 삭제하시겠습니까?', [
      {text: '취소', style: 'cancel'},
      {
        text: '삭제',
        style: 'destructive',
        onPress: () => {
          deleteAnniversary.mutate(anniversary.id, {
            onSuccess: () => navigation.goBack(),
          });
        },
      },
    ]);
  };

  const handleUpdate = (
    body: CreateAnniversaryRequest | UpdateAnniversaryRequest,
  ) => {
    updateAnniversary.mutate(
      {id: anniversary.id, body: body as UpdateAnniversaryRequest},
      {onSuccess: () => navigation.goBack()},
    );
  };

  if (isEditing && !isAuto) {
    return (
      <GradientBackground>
        <SafeAreaView style={styles.container} edges={['top']}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => setIsEditing(false)}
              style={styles.sideButton}>
              <Text style={styles.sideButtonText}>취소</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>기념일 수정</Text>
            <View style={styles.sidePlaceholder} />
          </View>

          <View style={styles.content}>
            <AnniversaryForm
              mode="edit"
              initial={anniversary}
              submitting={updateAnniversary.isPending}
              submitLabel="저장"
              onSubmit={handleUpdate}
            />
          </View>
        </SafeAreaView>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.sideButton}>
            <Text style={styles.sideButtonText}>닫기</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>기념일 상세</Text>
          {isAuto ? (
            <View style={styles.sidePlaceholder} />
          ) : (
            <TouchableOpacity
              onPress={handleDelete}
              style={styles.sideButton}>
              {deleteAnniversary.isPending ? (
                <ActivityIndicator size="small" color="#FF6B6B" />
              ) : (
                <Text style={styles.deleteText}>삭제</Text>
              )}
            </TouchableOpacity>
          )}
        </View>

        <ScrollView style={styles.scroll}>
          <Card style={styles.card}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>{anniversary.title}</Text>
              {isAuto && (
                <View style={styles.autoBadge}>
                  <Text style={styles.autoBadgeText}>자동</Text>
                </View>
              )}
            </View>

            <View style={styles.ddayBox}>
              <DdayBadge
                days={anniversary.daysUntil}
                size="large"
                type={anniversary.type}
              />
            </View>

            <View style={styles.infoSection}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>날짜</Text>
                <Text style={styles.infoValue}>
                  {new Date(
                    `${anniversary.date}T00:00:00`,
                  ).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    weekday: 'long',
                  })}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>매년 반복</Text>
                <Text style={styles.infoValue}>
                  {anniversary.isRecurring ? '예' : '아니요'}
                </Text>
              </View>
            </View>

            {anniversary.description && (
              <View style={styles.memoSection}>
                <Text style={styles.memoLabel}>메모</Text>
                <Text style={styles.memoText}>{anniversary.description}</Text>
              </View>
            )}
          </Card>

          {!isAuto && (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditing(true)}>
              <Text style={styles.editButtonText}>수정</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sideButton: {padding: 8, minWidth: 50},
  sidePlaceholder: {width: 50},
  sideButtonText: {fontSize: 16, color: '#666666'},
  deleteText: {fontSize: 16, color: '#FF6B6B'},
  headerTitle: {fontSize: 18, fontWeight: '600', color: '#333333'},
  scroll: {flex: 1, paddingHorizontal: 16},
  content: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  card: {padding: 20, marginTop: 4},
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333333',
    flex: 1,
  },
  autoBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#E8F4FA',
    marginLeft: 8,
  },
  autoBadgeText: {
    fontSize: 11,
    color: '#4A90B8',
    fontWeight: '600',
  },
  ddayBox: {
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 8,
  },
  infoSection: {
    gap: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    marginTop: 8,
  },
  infoRow: {flexDirection: 'row', justifyContent: 'space-between'},
  infoLabel: {fontSize: 15, color: '#666666'},
  infoValue: {fontSize: 15, color: '#333333', fontWeight: '500'},
  memoSection: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  memoLabel: {fontSize: 14, color: '#666666', marginBottom: 8},
  memoText: {fontSize: 15, color: '#333333', lineHeight: 22},
  editButton: {
    marginTop: 16,
    marginBottom: 32,
    backgroundColor: '#FF8B94',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  editButtonText: {color: '#FFFFFF', fontSize: 16, fontWeight: '600'},
});
