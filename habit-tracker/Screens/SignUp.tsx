import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import globalStyles from '../Styles/globalStyle';
import habitService from '../Functions/habitService';

const SignUp = ({ navigation }: any) => {

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState(''); 
  const [lastName, setLastName] = useState('');

  const handleSignUp = () => {

    // Check all fields are filled in
    const fieldsCheck = habitService.fieldValidation({
      username,
      email,
      password,
      confirmPassword,
    });
    if (!fieldsCheck.valid) {
      Alert.alert('Missing Field', fieldsCheck.message);
      return;
    }

    // Check email format
    const emailCheck = habitService.emailValidation(email);
    if (!emailCheck.valid) {
      Alert.alert('Invalid Email', emailCheck.message);
      return;
    }

    // Check password strength
    const passwordCheck = habitService.passwordValidation(password);
    if (!passwordCheck.valid) {
      Alert.alert('Invalid Password', passwordCheck.message);
      return;
    }

    // Check passwords match
    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match. Please try again.');
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

      <Text style={globalStyles.title}>Create Account 🌱</Text>
      <Text style={globalStyles.mutedText}>Start building better habits today</Text>

      <View style={globalStyles.divider} />

      {/*Firstname input */}
      <TextInput
        style={globalStyles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />

      {/* Lastname input */}
      <TextInput
        style={globalStyles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />

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