import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, TouchableOpacity, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import globalStyles from './Styles/globalStyle';

import SignIn from './Screens/SignIn';
import SignUp from './Screens/SignUp';

const Stack = createStackNavigator();

const WelcomeScreen = ({ navigation }: any) => {
  return (
    <View style={globalStyles.centeredContainer}>

      {/* Logo */}
      <Image
        source={require('./assets/Logo.png')}
        style={{ width: 180, height: 180, marginBottom: 20 }}
        resizeMode="contain"
      />

      <Text style={globalStyles.title}>Habit Tracker</Text>
      <Text style={globalStyles.text}>
        Your friendly companion for building better habits!
      </Text>
      <Text style={[globalStyles.mutedText, { marginBottom: 40, textAlign: 'center' }]}>
        To get started, please sign up or sign in
      </Text>

      <TouchableOpacity
        style={globalStyles.button}
        onPress={() => navigation.navigate('SignUp')}
      >
        <Text style={globalStyles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={globalStyles.outlineButton}
        onPress={() => navigation.navigate('SignIn')}
      >
        <Text style={globalStyles.outlineButtonText}>Sign In</Text>
      </TouchableOpacity>

      <StatusBar style="auto" />
    </View>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="SignUp" component={SignUp} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}