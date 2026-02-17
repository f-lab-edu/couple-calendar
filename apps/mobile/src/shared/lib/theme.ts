import {useColorScheme} from 'react-native';

const lightColors = {
  background: '#FFF0F3',
  backgroundGradientStart: '#FFF0F3',
  backgroundGradientEnd: '#FFDDE4',
  surface: 'rgba(255, 255, 255, 0.9)',
  text: '#333333',
  textSecondary: '#888888',
  textDisabled: '#CCCCCC',
  border: '#F0F0F0',
  accent: '#FF8B94',
  calendarCellBg: 'transparent',
  tabBarBg: 'rgba(255, 255, 255, 0.95)',
  eventCardBg: 'rgba(255, 255, 255, 0.9)',
};

const darkColors = {
  background: '#1A1A1A',
  backgroundGradientStart: '#1A1A1A',
  backgroundGradientEnd: '#1A1A1A',
  surface: '#2A2A2A',
  text: '#E0E0E0',
  textSecondary: '#999999',
  textDisabled: '#555555',
  border: '#333333',
  accent: '#FF8B94',
  calendarCellBg: '#333333',
  tabBarBg: '#1A1A1A',
  eventCardBg: '#2A2A2A',
};

export type AppTheme = {
  isDark: boolean;
  colors: typeof lightColors;
};

export const useAppTheme = (): AppTheme => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return {
    isDark,
    colors: isDark ? darkColors : lightColors,
  };
};
