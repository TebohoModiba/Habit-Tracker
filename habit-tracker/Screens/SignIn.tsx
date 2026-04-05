import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, Image, Alert, ActivityIndicator,
} from 'react-native';
import { useTheme } from '../Context/ThemeContext';
import { createGlobalStyles } from '../Styles/globalStyle';
import habitService from '../Functions/habitService';
import apiService from '../Functions/apiService';

const SignIn = ({ navigation }: any) => {
  const { colors } = useTheme();
  const globalStyles = createGlobalStyles(colors);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    const fieldsCheck = habitService.fieldValidation({ email, password });
    if (!fieldsCheck.valid) {
      Alert.alert('Missing Field', fieldsCheck.message);
      return;
    }
    if (!habitService.emailValidation(email).valid) {
      Alert.alert('Invalid Email', habitService.emailValidation(email).message);
      return;
    }
    if (!habitService.passwordValidation(password).valid) {
      Alert.alert('Invalid Password', habitService.passwordValidation(password).message);
      return;
    }
    setLoading(true);
    try {
      const result = await apiService.login({ email, password });
      navigation.replace('MainTabs', {
        userId: result.userId,
        username: result.username,
        firstName: result.firstName
      });
    } catch (error: any) {
      Alert.alert('Sign In Failed', error.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={globalStyles.centeredContainer}>
      <Image source={require('../assets/Logo.png')} style={{ width: 100, height: 100, marginBottom: 10 }} resizeMode="contain" />
      <Text style={globalStyles.title}>Welcome Back 👋</Text>
      <Text style={globalStyles.mutedText}>Sign in to continue</Text>
      <View style={globalStyles.divider} />
      <TextInput
        style={globalStyles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!loading}
      />
      <TextInput
        style={globalStyles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!loading}
      />
      <TouchableOpacity
        style={[globalStyles.button, loading && { opacity: 0.7 }]}
        onPress={handleSignIn}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={globalStyles.buttonText}>Sign In</Text>}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')} disabled={loading}>
        <Text style={globalStyles.mutedText}>
          Don't have an account? <Text style={{ color: colors.primary, fontWeight: 'bold' }}>Sign Up</Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default SignIn;