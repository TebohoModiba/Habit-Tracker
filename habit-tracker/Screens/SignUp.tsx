import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import globalStyles from '../Styles/globalStyle';

const SignUp = ({ navigation }: any) => {

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = () => {
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

      <Text style={globalStyles.title}>Create Account 🌱</Text>
      <Text style={globalStyles.mutedText}>Start building better habits today</Text>

      <View style={globalStyles.divider} />

      {/* Username Input */}
      <TextInput
        style={globalStyles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

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

      {/* Confirm Password Input */}
      <TextInput
        style={globalStyles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      {/* Sign Up Button */}
      <TouchableOpacity style={globalStyles.button} onPress={handleSignUp}>
        <Text style={globalStyles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      {/* Navigate to Sign In */}
      <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
        <Text style={globalStyles.mutedText}>
          Already have an account?{' '}
          <Text style={{ color: '#9a8c98', fontWeight: 'bold' }}>Sign In</Text>
        </Text>
      </TouchableOpacity>

    </ScrollView>
  );
};

export default SignUp;