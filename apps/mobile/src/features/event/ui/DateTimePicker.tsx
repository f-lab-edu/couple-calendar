import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Platform} from 'react-native';
import RNDateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';

interface DateTimePickerProps {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
  mode?: 'date' | 'time' | 'datetime';
  minimumDate?: Date;
}

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  label,
  value,
  onChange,
  mode = 'datetime',
  minimumDate,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleDateChange = (
    _event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const newDate = new Date(value);
      newDate.setFullYear(selectedDate.getFullYear());
      newDate.setMonth(selectedDate.getMonth());
      newDate.setDate(selectedDate.getDate());
      onChange(newDate);
    }
  };

  const handleTimeChange = (
    _event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    setShowTimePicker(false);
    if (selectedDate) {
      const newDate = new Date(value);
      newDate.setHours(selectedDate.getHours());
      newDate.setMinutes(selectedDate.getMinutes());
      onChange(newDate);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        {(mode === 'date' || mode === 'datetime') && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => setShowDatePicker(true)}>
            <Text style={styles.buttonText}>{formatDate(value)}</Text>
          </TouchableOpacity>
        )}
        {(mode === 'time' || mode === 'datetime') && (
          <TouchableOpacity
            style={[styles.button, styles.timeButton]}
            onPress={() => setShowTimePicker(true)}>
            <Text style={styles.buttonText}>{formatTime(value)}</Text>
          </TouchableOpacity>
        )}
      </View>

      {showDatePicker && (
        <RNDateTimePicker
          value={value}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          minimumDate={minimumDate}
          locale="ko-KR"
        />
      )}

      {showTimePicker && (
        <RNDateTimePicker
          value={value}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleTimeChange}
          locale="ko-KR"
        />
      )}
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
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  timeButton: {
    flex: 0.6,
  },
  buttonText: {
    fontSize: 15,
    color: '#333333',
    textAlign: 'center',
  },
});
