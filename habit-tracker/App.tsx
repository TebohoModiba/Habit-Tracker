import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, TouchableOpacity, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ThemeProvider, useTheme } from './Context/ThemeContext';
import { createGlobalStyles } from './Styles/globalStyle';

import SignIn from './Screens/SignIn';
import SignUp from './Screens/SignUp';
import MainTabs from './Navigation/MainTabs';
import HabitDetails from './Screens/HabitDetail';
import ProfileScreen from './Screens/ProfileScreen';
import SettingsScreen from './Screens/SettingsScreen';

const Stack = createStackNavigator();

const WelcomeScreen = ({ navigation }: any) => {
  const { colors } = useTheme();
  const styles = createGlobalStyles(colors);
  return (
    <View style={styles.centeredContainer}>
      <Image
        source={require('./assets/Logo.png')}
        style={{ width: 180, height: 180, marginBottom: 20 }}
        resizeMode="contain"
      />
      <Text style={styles.title}>Habit Tracker</Text>
      <Text style={styles.text}>Your friendly companion for building better habits!</Text>
      <Text style={[styles.mutedText, { marginBottom: 40, textAlign: 'center' }]}>
        To get started, please sign up or sign in
      </Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.outlineButton} onPress={() => navigation.navigate('SignIn')}>
        <Text style={styles.outlineButtonText}>Sign In</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
};

function AppNavigator() {
  const { colors, mode } = useTheme();
  const navTheme = {
    dark: mode === 'dark',
    colors: {
      primary: colors.primary,
      background: colors.background,
      card: colors.surface,
      text: colors.bodyText,
      border: colors.border,
      notification: colors.accent,
    },
    fonts: {},
  };
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="HabitDetails" component={HabitDetails} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: true, title: 'Profile' }} />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: true, title: 'Settings' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppNavigator />
    </ThemeProvider>
  );
}