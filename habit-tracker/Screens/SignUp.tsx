import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, Image, Alert, ActivityIndicator,
} from 'react-native';
import { useTheme } from '../Context/ThemeContext';
import { createGlobalStyles } from '../Styles/globalStyle';
import habitService from '../Functions/habitService';
import apiService from '../Functions/apiService';

const SignUp = ({ navigation }: any) => {
  const { colors } = useTheme();
  const globalStyles = createGlobalStyles(colors);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    const fieldsCheck = habitService.fieldValidation({ firstName, lastName, username, email, password, confirmPassword });
    if (!fieldsCheck.valid) {
      Alert.alert('Missing Field', fieldsCheck.message);
      return;
    }
    const emailCheck = habitService.emailValidation(email);
    if (!emailCheck.valid) {
      Alert.alert('Invalid Email', emailCheck.message);
      return;
    }
    const passwordCheck = habitService.passwordValidation(password);
    if (!passwordCheck.valid) {
      Alert.alert('Invalid Password', passwordCheck.message);
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match. Please try again.');
      return;
    }
    setLoading(true);
    try {
      await apiService.register({ firstName, lastName, username, email, password });
      Alert.alert('Account Created!', 'You can now sign in.', [{ text: 'Sign In', onPress: () => navigation.navigate('SignIn') }]);
    } catch (error: any) {
      Alert.alert('Sign Up Failed', error.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={globalStyles.centeredContainer}>
      <Image source={require('../assets/Logo.png')} style={{ width: 100, height: 100, marginBottom: 10 }} resizeMode="contain" />
      <Text style={globalStyles.title}>Create Account 🌱</Text>
      <Text style={globalStyles.mutedText}>Start building better habits today</Text>
      <View style={globalStyles.divider} />
      <TextInput style={globalStyles.input} placeholder="First Name" value={firstName} onChangeText={setFirstName} editable={!loading} />
      <TextInput style={globalStyles.input} placeholder="Last Name" value={lastName} onChangeText={setLastName} editable={!loading} />
      <TextInput style={globalStyles.input} placeholder="Username" value={username} onChangeText={setUsername} autoCapitalize="none" editable={!loading} />
      <TextInput style={globalStyles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" editable={!loading} />
      <TextInput style={globalStyles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry editable={!loading} />
      <TextInput style={globalStyles.input} placeholder="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry editable={!loading} />
      <TouchableOpacity style={[globalStyles.button, loading && { opacity: 0.7 }]} onPress={handleSignUp} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={globalStyles.buttonText}>Sign Up</Text>}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('SignIn')} disabled={loading}>
        <Text style={globalStyles.mutedText}>
          Already have an account? <Text style={{ color: colors.primary, fontWeight: 'bold' }}>Sign In</Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default SignUp;