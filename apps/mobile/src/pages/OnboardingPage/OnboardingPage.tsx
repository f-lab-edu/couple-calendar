import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {GradientBackground} from '../../shared/ui';
import {useAuthStore} from '../../shared/store';

interface OnboardingPageProps {
  onComplete: () => void;
}

export const OnboardingPage: React.FC<OnboardingPageProps> = ({onComplete}) => {
  const {user, setUser} = useAuthStore();
  const [name, setName] = useState(user?.name || '');

  const handleContinue = () => {
    if (name.trim() && user) {
      setUser({...user, name: name.trim()});
      onComplete();
    }
  };

  const isValid = name.trim().length > 0;

  return (
    <GradientBackground>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.emoji}>👋</Text>
            <Text style={styles.title}>환영합니다!</Text>
            <Text style={styles.subtitle}>
              앱에서 사용할 이름을 입력해주세요
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>이름</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="이름을 입력하세요"
              placeholderTextColor="#AAAAAA"
              autoFocus
              maxLength={20}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, !isValid && styles.buttonDisabled]}
            onPress={handleContinue}
            disabled={!isValid}
            activeOpacity={0.8}>
            <Text style={styles.buttonText}>계속하기</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
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
  inputContainer: {
    marginBottom: 32,
  },
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
    paddingVertical: 16,
    fontSize: 16,
    color: '#333333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  button: {
    backgroundColor: '#FF8B94',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 'auto',
  },
  buttonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
});
