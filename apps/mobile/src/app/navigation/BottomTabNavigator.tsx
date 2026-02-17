import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {MainPage, ProfilePage, AddEventPage, EventDetailPage} from '../../pages';
import {useAppTheme} from '../../shared';
import type {CalendarEvent} from '../../shared/types';

export type MainStackParamList = {
  MainTabs: undefined;
  AddEvent: undefined;
  EventDetail: {event: CalendarEvent};
};

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<MainStackParamList>();

const AddEventButton: React.FC<{onPress: () => void}> = ({onPress}) => {
  const {isDark} = useAppTheme();

  return (
    <TouchableOpacity style={styles.addButton} onPress={onPress}>
      <View
        style={[
          styles.addButtonInner,
          isDark && styles.addButtonInnerDark,
        ]}>
        <Text style={styles.addButtonText}>+</Text>
      </View>
    </TouchableOpacity>
  );
};

const TabBarIcon: React.FC<{name: string; focused: boolean}> = ({
  name,
  focused,
}) => {
  const {colors} = useAppTheme();

  const getLabel = () => {
    switch (name) {
      case 'Home':
        return 'Home';
      case 'Profile':
        return 'Profile';
      default:
        return name;
    }
  };

  const getIcon = () => {
    switch (name) {
      case 'Home':
        return focused ? '⌂' : '⌂';
      case 'Profile':
        return focused ? '●' : '○';
      default:
        return '◆';
    }
  };

  return (
    <View style={styles.iconContainer}>
      <Text
        style={[
          styles.icon,
          {color: focused ? colors.accent : colors.textSecondary},
        ]}>
        {getIcon()}
      </Text>
      <Text
        style={[
          styles.label,
          {color: focused ? colors.accent : colors.textSecondary},
        ]}>
        {getLabel()}
      </Text>
    </View>
  );
};

// Empty component for AddEvent tab (handled by button)
const EmptyScreen: React.FC = () => null;

const TabNavigator: React.FC = () => {
  const {colors} = useAppTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: [styles.tabBar, {backgroundColor: colors.tabBarBg}],
        tabBarShowLabel: false,
      }}>
      <Tab.Screen
        name="Home"
        component={MainPage}
        options={{
          tabBarIcon: ({focused}) => (
            <TabBarIcon name="Home" focused={focused} />
          ),
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
          tabPress: e => {
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
  },
  label: {
    fontSize: 10,
    marginTop: 4,
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
  addButtonInnerDark: {
    shadowOpacity: 0.5,
  },
  addButtonText: {
    fontSize: 28,
    color: '#FFF',
    fontWeight: '300',
    lineHeight: 30,
  },
});
