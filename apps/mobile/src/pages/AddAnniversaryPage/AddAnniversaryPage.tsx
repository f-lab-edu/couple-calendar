import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {GradientBackground} from '../../shared/ui';
import {AnniversaryForm} from '../../features/anniversary';
import {useCreateAnniversary} from '../../shared/api';
import type {
  CreateAnniversaryRequest,
  UpdateAnniversaryRequest,
} from '../../shared/types';

export const AddAnniversaryPage: React.FC = () => {
  const navigation = useNavigation();
  const createAnniversary = useCreateAnniversary();

  const handleSubmit = (
    body: CreateAnniversaryRequest | UpdateAnniversaryRequest,
  ) => {
    // 에러는 QueryClient 전역 핸들러에서 토스트로 처리됨.
    // 성공 토스트는 hook의 onSuccess에서 노출.
    createAnniversary.mutate(body as CreateAnniversaryRequest, {
      onSuccess: () => navigation.goBack(),
    });
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.closeButton}>
            <Text style={styles.closeButtonText}>취소</Text>
          </TouchableOpacity>
          <Text style={styles.title}>새 기념일</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.content}>
          <AnniversaryForm
            mode="create"
            submitting={createAnniversary.isPending}
            submitLabel="등록"
            onSubmit={handleSubmit}
          />
        </View>
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
  closeButton: {padding: 8},
  closeButtonText: {fontSize: 16, color: '#666666'},
  title: {fontSize: 18, fontWeight: '600', color: '#333333'},
  placeholder: {width: 50},
  content: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
});
