import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {MainPage, ProfilePage, AddEventPage, EventDetailPage} from '../../pages';
import type {CalendarEvent} from '../../shared/types';

export type MainStackParamList = {
  MainTabs: undefined;
  AddEvent: undefined;
  EventDetail: {event: CalendarEvent};
};

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<MainStackParamList>();

const AddEventButton: React.FC<{onPress: () => void}> = ({onPress}) => {
  return (
    <TouchableOpacity style={styles.addButton} onPress={onPress}>
      <View style={styles.addButtonInner}>
        <Text style={styles.addButtonText}>+</Text>
      </View>
      <Text style={styles.addButtonLabel}>추가</Text>
    </TouchableOpacity>
  );
};

const TabBarIcon: React.FC<{name: string; focused: boolean}> = ({
  name,
  focused,
}) => {
  const getIcon = () => {
    switch (name) {
      case 'Home':
        return '🏠';
      case 'Profile':
        return '👤';
      default:
        return '📅';
    }
  };

  const getLabel = () => {
    switch (name) {
      case 'Home':
        return '홈';
      case 'Profile':
        return '프로필';
      default:
        return name;
    }
  };

  return (
    <View style={styles.iconContainer}>
      <Text style={[styles.icon, focused && styles.iconFocused]}>
        {getIcon()}
      </Text>
      <Text style={[styles.label, focused && styles.labelFocused]}>
        {getLabel()}
      </Text>
    </View>
  );
};

// Empty component for AddEvent tab (handled by button)
const EmptyScreen: React.FC = () => null;

const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}>
      <Tab.Screen
        name="Home"
        component={MainPage}
        options={{
          tabBarIcon: ({focused}) => <TabBarIcon name="Home" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="AddEventTab"
        component={EmptyScreen}
        options={({navigation}) => ({
          tabBarButton: () => (
            <AddEventButton
              onPress={() => navigation.navigate('AddEvent')}
            />
          ),
        })}
        listeners={({navigation}) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate('AddEvent');
          },
        })}
      />
      <Tab.Screen
        name="Profile"
        component={ProfilePage}
        options={{
          tabBarIcon: ({focused}) => (
            <TabBarIcon name="Profile" focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export const BottomTabNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen
        name="AddEvent"
        component={AddEventPage}
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
      <Stack.Screen
        name="EventDetail"
        component={EventDetailPage}
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 0,
    height: 80,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
  },
  icon: {
    fontSize: 20,
    opacity: 0.5,
  },
  iconFocused: {
    opacity: 1,
  },
  label: {
    fontSize: 10,
    color: '#888',
    marginTop: 4,
  },
  labelFocused: {
    color: '#FF8B94',
  },
  addButton: {
    alignItems: 'center',
    justifyContent: 'center',
    top: -10,
  },
  addButtonInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FF8B94',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF8B94',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonText: {
    fontSize: 28,
    color: '#FFF',
    fontWeight: '300',
    lineHeight: 30,
  },
  addButtonLabel: {
    fontSize: 10,
    color: '#FF8B94',
    marginTop: 4,
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
