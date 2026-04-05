import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../Screens/HomeScreen';
import Suggestions from '../Screens/Suggestions';
import ProfileScreen from '../Screens/ProfileScreen';
import SettingsScreen from '../Screens/SettingsScreen';
import { useTheme } from '../Context/ThemeContext';

const Tab = createBottomTabNavigator();

export default function MainTabs({ route }: any) {
    const { userId, username, firstName } = route.params;
    const { colors } = useTheme();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: keyof typeof Ionicons.glyphMap = 'home';
                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Suggestions') {
                        iconName = focused ? 'bulb' : 'bulb-outline';
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'person' : 'person-outline';
                    } else if (route.name === 'Settings') {
                        iconName = focused ? 'settings' : 'settings-outline';
                    }
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.mutedText,
                tabBarStyle: {
                    backgroundColor: colors.surface,
                    borderTopColor: colors.border,
                },
                headerStyle: {
                    backgroundColor: colors.surface,
                },
                headerTintColor: colors.titleText,
            })}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                initialParams={{ userId, username, firstName }}
                options={{ title: 'Habits' }}
            />
            <Tab.Screen
                name="Suggestions"
                component={Suggestions}
                initialParams={{ userId }}
                options={{ title: 'AI Tips' }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{ title: 'Profile' }}
            />
            <Tab.Screen
                name="Settings"
                component={SettingsScreen}
                options={{ title: 'Settings' }}
            />
        </Tab.Navigator>
    );
}