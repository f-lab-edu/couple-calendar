import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {GradientBackground, Card} from '../../shared/ui';
import {useAuthStore, useCoupleStore} from '../../shared/store';
import {useLogout, useDisconnectCouple, getDaysSince} from '../../shared/api';

interface SettingItemProps {
  icon: string;
  title: string;
  subtitle?: string;
  onPress: () => void;
  destructive?: boolean;
}

const SettingItem: React.FC<SettingItemProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  destructive = false,
}) => (
  <TouchableOpacity style={styles.settingItem} onPress={onPress}>
    <Text style={styles.settingIcon}>{icon}</Text>
    <View style={styles.settingContent}>
      <Text style={[styles.settingTitle, destructive && styles.destructive]}>
        {title}
      </Text>
      {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
    </View>
    <Text style={styles.chevron}>›</Text>
  </TouchableOpacity>
);

export const ProfilePage: React.FC = () => {
  const {user, setUser} = useAuthStore();
  const {couple, partner, isConnected} = useCoupleStore();
  const logout = useLogout();
  const disconnectCouple = useDisconnectCouple();

  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || '');

  const handleEditName = () => {
    setEditedName(user?.name || '');
    setIsEditingName(true);
  };

  const handleSaveName = () => {
    if (editedName.trim() && user) {
      setUser({...user, name: editedName.trim()});
      setIsEditingName(false);
    }
  };

  const handleDisconnect = () => {
    Alert.alert(
      '커플 연결 해제',
      '정말로 연결을 해제하시겠습니까?\n공유된 일정과 기념일은 유지됩니다.',
      [
        {text: '취소', style: 'cancel'},
        {
          text: '해제',
          style: 'destructive',
          onPress: async () => {
            await disconnectCouple.mutateAsync();
            Alert.alert('완료', '연결이 해제되었습니다');
          },
        },
      ],
    );
  };

  const handleLogout = () => {
    Alert.alert('로그아웃', '정말로 로그아웃 하시겠습니까?', [
      {text: '취소', style: 'cancel'},
      {
        text: '로그아웃',
        style: 'destructive',
        onPress: async () => {
          await logout.mutateAsync();
        },
      },
    ]);
  };

  const daysTogether = couple ? getDaysSince(new Date(couple.startDate)) : 0;

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.title}>설정</Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {/* Profile Section */}
          <Card style={styles.profileCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.name?.charAt(0) || '?'}
              </Text>
            </View>
            <Text style={styles.userName}>{user?.name || '이름 없음'}</Text>
            <Text style={styles.userEmail}>{user?.email || ''}</Text>
          </Card>

          {/* Couple Section */}
          {isConnected && couple && (
            <Card style={styles.section}>
              <Text style={styles.sectionTitle}>커플 정보</Text>
              <View style={styles.coupleInfo}>
                <View style={styles.coupleAvatars}>
                  <View style={styles.smallAvatar}>
                    <Text style={styles.smallAvatarText}>
                      {user?.name?.charAt(0) || '?'}
                    </Text>
                  </View>
                  <Text style={styles.heart}>💕</Text>
                  <View style={styles.smallAvatar}>
                    <Text style={styles.smallAvatarText}>
                      {partner?.name?.charAt(0) || '?'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.coupleNames}>
                  {user?.name} & {partner?.name}
                </Text>
                <Text style={styles.coupleDays}>함께한 지 {daysTogether}일</Text>
              </View>
            </Card>
          )}

          {/* Settings Section */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>계정</Text>
            <SettingItem
              icon="✏️"
              title="이름 변경"
              subtitle={user?.name}
              onPress={handleEditName}
            />
            {isConnected ? (
              <SettingItem
                icon="💔"
                title="커플 연결 해제"
                onPress={handleDisconnect}
                destructive
              />
            ) : (
              <SettingItem
                icon="💕"
                title="커플 연결하기"
                subtitle="파트너와 캘린더를 공유하세요"
                onPress={() => Alert.alert('안내', '온보딩에서 연결할 수 있습니다')}
              />
            )}
          </Card>

          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>앱 정보</Text>
            <SettingItem
              icon="📱"
              title="버전"
              subtitle="1.0.0"
              onPress={() => {}}
            />
            <SettingItem
              icon="📄"
              title="이용약관"
              onPress={() => Alert.alert('안내', '준비 중입니다')}
            />
            <SettingItem
              icon="🔒"
              title="개인정보처리방침"
              onPress={() => Alert.alert('안내', '준비 중입니다')}
            />
          </Card>

          <Card style={styles.section}>
            <SettingItem
              icon="🚪"
              title="로그아웃"
              onPress={handleLogout}
              destructive
            />
          </Card>

          <View style={styles.footer}>
            <Text style={styles.footerText}>커플 캘린더</Text>
          </View>
        </ScrollView>

        {/* Edit Name Modal */}
        <Modal
          visible={isEditingName}
          transparent
          animationType="fade"
          onRequestClose={() => setIsEditingName(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>이름 변경</Text>
              <TextInput
                style={styles.modalInput}
                value={editedName}
                onChangeText={setEditedName}
                placeholder="이름을 입력하세요"
                maxLength={20}
                autoFocus
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => setIsEditingName(false)}>
                  <Text style={styles.modalButtonText}>취소</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalPrimaryButton]}
                  onPress={handleSaveName}>
                  <Text style={styles.modalPrimaryButtonText}>저장</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  profileCard: {
    alignItems: 'center',
    padding: 24,
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF8B94',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#999999',
  },
  section: {
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 12,
  },
  coupleInfo: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  coupleAvatars: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  smallAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FF8B94',
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallAvatarText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  heart: {
    fontSize: 20,
    marginHorizontal: 12,
  },
  coupleNames: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 4,
  },
  coupleDays: {
    fontSize: 14,
    color: '#FF8B94',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: '#333333',
  },
  settingSubtitle: {
    fontSize: 13,
    color: '#999999',
    marginTop: 2,
  },
  destructive: {
    color: '#FF6B6B',
  },
  chevron: {
    fontSize: 20,
    color: '#CCCCCC',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 12,
    color: '#CCCCCC',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
  },
  modalButtonText: {
    fontSize: 16,
    color: '#666666',
  },
  modalPrimaryButton: {
    backgroundColor: '#FF8B94',
  },
  modalPrimaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default ProfilePage;
