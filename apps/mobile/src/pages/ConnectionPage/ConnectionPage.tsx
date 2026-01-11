import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Share,
} from 'react-native';
import {GradientBackground, Card} from '../../shared/ui';
import {useGenerateInviteCode, useConnectWithCode} from '../../shared/api';
import {useCoupleStore} from '../../shared/store';

type ConnectionMode = 'select' | 'generate' | 'enter';

interface ConnectionPageProps {
  onComplete: () => void;
}

export const ConnectionPage: React.FC<ConnectionPageProps> = ({onComplete}) => {
  const [mode, setMode] = useState<ConnectionMode>('select');
  const [inputCode, setInputCode] = useState('');

  const {connectionCode} = useCoupleStore();
  const generateCode = useGenerateInviteCode();
  const connectWithCode = useConnectWithCode();

  const handleGenerateCode = async () => {
    setMode('generate');
    await generateCode.mutateAsync();
  };

  const handleShareCode = async () => {
    if (connectionCode) {
      await Share.share({
        message: `커플 캘린더에서 함께해요! 초대 코드: ${connectionCode}`,
      });
    }
  };

  const handleConnectWithCode = async () => {
    if (inputCode.length !== 6) {
      Alert.alert('오류', '6자리 코드를 입력해주세요');
      return;
    }

    try {
      await connectWithCode.mutateAsync(inputCode.toUpperCase());
      onComplete();
    } catch {
      Alert.alert('오류', '유효하지 않은 코드입니다');
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  if (mode === 'generate') {
    return (
      <GradientBackground>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.emoji}>💌</Text>
            <Text style={styles.title}>초대 코드</Text>
            <Text style={styles.subtitle}>
              파트너에게 아래 코드를 공유하세요
            </Text>
          </View>

          <Card style={styles.codeCard}>
            {generateCode.isPending ? (
              <ActivityIndicator size="large" color="#FF8B94" />
            ) : (
              <>
                <Text style={styles.codeText}>{connectionCode}</Text>
                <Text style={styles.codeHint}>
                  파트너가 이 코드를 입력하면 연결됩니다
                </Text>
              </>
            )}
          </Card>

          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleShareCode}
              disabled={!connectionCode}>
              <Text style={styles.primaryButtonText}>코드 공유하기</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => setMode('select')}>
              <Text style={styles.secondaryButtonText}>뒤로가기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </GradientBackground>
    );
  }

  if (mode === 'enter') {
    return (
      <GradientBackground>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.emoji}>🔗</Text>
            <Text style={styles.title}>코드 입력</Text>
            <Text style={styles.subtitle}>
              파트너에게 받은 6자리 코드를 입력하세요
            </Text>
          </View>

          <TextInput
            style={styles.codeInput}
            value={inputCode}
            onChangeText={(text) => setInputCode(text.toUpperCase())}
            placeholder="XXXXXX"
            placeholderTextColor="#CCCCCC"
            maxLength={6}
            autoCapitalize="characters"
            autoCorrect={false}
          />

          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[
                styles.primaryButton,
                inputCode.length !== 6 && styles.buttonDisabled,
              ]}
              onPress={handleConnectWithCode}
              disabled={inputCode.length !== 6 || connectWithCode.isPending}>
              {connectWithCode.isPending ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryButtonText}>연결하기</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => setMode('select')}>
              <Text style={styles.secondaryButtonText}>뒤로가기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.emoji}>💕</Text>
          <Text style={styles.title}>커플 연결</Text>
          <Text style={styles.subtitle}>
            파트너와 연결하여 캘린더를 공유하세요
          </Text>
        </View>

        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={styles.optionCard}
            onPress={handleGenerateCode}
            activeOpacity={0.8}>
            <Text style={styles.optionEmoji}>📤</Text>
            <Text style={styles.optionTitle}>초대 코드 생성</Text>
            <Text style={styles.optionDescription}>
              코드를 생성하고 파트너에게 공유
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => setMode('enter')}
            activeOpacity={0.8}>
            <Text style={styles.optionEmoji}>📥</Text>
            <Text style={styles.optionTitle}>코드 입력</Text>
            <Text style={styles.optionDescription}>
              파트너에게 받은 코드 입력
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipButtonText}>나중에 하기</Text>
        </TouchableOpacity>
      </View>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  optionsContainer: {
    gap: 16,
  },
  optionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  optionEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: '#666666',
  },
  codeCard: {
    padding: 32,
    alignItems: 'center',
    marginBottom: 32,
  },
  codeText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FF8B94',
    letterSpacing: 8,
    marginBottom: 12,
  },
  codeHint: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  codeInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 8,
    color: '#333333',
    marginBottom: 32,
  },
  buttonGroup: {
    gap: 12,
    marginTop: 'auto',
  },
  primaryButton: {
    backgroundColor: '#FF8B94',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#666666',
    fontSize: 17,
    fontWeight: '500',
  },
  buttonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  skipButton: {
    marginTop: 'auto',
    paddingVertical: 16,
    alignItems: 'center',
  },
  skipButtonText: {
    color: '#999999',
    fontSize: 15,
  },
});
