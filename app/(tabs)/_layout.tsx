import { Tabs } from 'expo-router';
import { Text, View, Platform } from 'react-native';
import { colors } from '../../src/theme';

const iconWrap = Platform.OS === 'web' ? { filter: 'grayscale(1)' as const } : {};

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.cardBorder,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '',
          tabBarIcon: () => null,
        }}
      />
      <Tabs.Screen
        name="checkin"
        options={{
          title: 'Check In',
          tabBarIcon: ({ color }) => <View style={iconWrap}><Text style={{ fontSize: 20 }}>🪞</Text></View>,
        }}
      />
      <Tabs.Screen
        name="teams"
        options={{
          title: 'Teams',
          tabBarIcon: ({ color }) => <View style={iconWrap}><Text style={{ fontSize: 20 }}>👥</Text></View>,
        }}
      />
      <Tabs.Screen
        name="contacts"
        options={{
          title: 'Contacts',
          tabBarIcon: ({ color }) => <View style={iconWrap}><Text style={{ fontSize: 20 }}>👨‍👩‍👧‍👦</Text></View>,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <View style={iconWrap}><Text style={{ fontSize: 20 }}>👤</Text></View>,
        }}
      />
    </Tabs>
  );
}
