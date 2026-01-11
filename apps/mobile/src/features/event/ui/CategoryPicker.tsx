import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import type {CalendarEvent} from '../../../shared/types';
import {CATEGORY_COLORS} from '../../../shared/types';

type Category = CalendarEvent['category'];

interface CategoryPickerProps {
  value: Category;
  onChange: (category: Category) => void;
}

const CATEGORIES: {value: Category; label: string; emoji: string}[] = [
  {value: 'DATE', label: '데이트', emoji: '💕'},
  {value: 'ANNIVERSARY', label: '기념일', emoji: '🎉'},
  {value: 'INDIVIDUAL', label: '개인', emoji: '👤'},
  {value: 'OTHER', label: '기타', emoji: '📌'},
];

export const CategoryPicker: React.FC<CategoryPickerProps> = ({
  value,
  onChange,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>카테고리</Text>
      <View style={styles.grid}>
        {CATEGORIES.map((category) => {
          const isSelected = value === category.value;
          const color = CATEGORY_COLORS[category.value];

          return (
            <TouchableOpacity
              key={category.value}
              style={[
                styles.item,
                isSelected && {borderColor: color, backgroundColor: `${color}15`},
              ]}
              onPress={() => onChange(category.value)}
              activeOpacity={0.7}>
              <Text style={styles.emoji}>{category.emoji}</Text>
              <Text
                style={[
                  styles.itemLabel,
                  isSelected && {color, fontWeight: '600'},
                ]}>
                {category.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
    gap: 6,
  },
  emoji: {
    fontSize: 18,
  },
  itemLabel: {
    fontSize: 14,
    color: '#666666',
  },
});
