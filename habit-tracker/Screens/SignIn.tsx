import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image,Alert } from 'react-native';
import globalStyles from '../Styles/globalStyle';
import habitService from '../Functions/habitService';

const SignIn = ({ navigation }: any) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = () => {

    const fieldsCheck = habitService.fieldValidation({
      email,
      password,
    });

    if (!fieldsCheck.valid) {
      Alert.alert('Missing Field', fieldsCheck.message);
      return;
    }

    if(!habitService.emailValidation(email).valid) {
      Alert.alert('Invalid Email', habitService.emailValidation(email).message);
      return;
    }

    if(!habitService.passwordValidation(password).valid) {
      Alert.alert('Invalid Password', habitService.passwordValidation(password).message);
      return;
    }

    // TODO: connect to C# API
  };

  return (
    <ScrollView contentContainerStyle={globalStyles.centeredContainer}>

      {/* Logo */}
      <Image
        source={require('../assets/Logo.png')}
        style={{ width: 100, height: 100, marginBottom: 10 }}
        resizeMode="contain"
      />

      <Text style={globalStyles.title}>Welcome Back 👋</Text>
      <Text style={globalStyles.mutedText}>Sign in to continue</Text>

      <View style={globalStyles.divider} />

      {/* Email Input */}
      <TextInput
        style={globalStyles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Password Input */}
      <TextInput
        style={globalStyles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Sign In Button */}
      <TouchableOpacity style={globalStyles.button} onPress={handleSignIn}>
        <Text style={globalStyles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      {/* Navigate to Sign Up */}
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={globalStyles.mutedText}>
          Don't have an account?{' '}
          <Text style={{ color: '#9a8c98', fontWeight: 'bold' }}>Sign Up</Text>
        </Text>
      </TouchableOpacity>

    </ScrollView>
  );
};

export default SignIn;