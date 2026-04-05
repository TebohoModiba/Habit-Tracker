import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../Context/ThemeContext';
import { createGlobalStyles } from '../Styles/globalStyle';

export default function ProfileScreen() {
    const [email, setEmail] = useState('');
    const [bio, setBio] = useState('');
    const [avatar, setAvatar] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
    const { colors } = useTheme();
    const globalStyles = createGlobalStyles(colors);

    useEffect(() => {
        loadUserData();
        requestMediaPermissions();
    }, []);

    const loadUserData = async () => {
        const userJson = await AsyncStorage.getItem('user');
        if (userJson) {
            const user = JSON.parse(userJson);
            setEmail(user.email || user.username || 'User');
            setBio(user.bio || '');
            setAvatar(user.avatar || null);
        }
    };

    const requestMediaPermissions = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission needed', 'Please allow access to your photos to set a profile picture.');
        }
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
            base64: true,
        });

        if (!result.canceled && result.assets[0].base64) {
            const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
            setAvatar(base64Image);
            saveUserData({ avatar: base64Image });
        }
    };

    const saveUserData = async (updates: any) => {
        const userJson = await AsyncStorage.getItem('user');
        const user = userJson ? JSON.parse(userJson) : {};
        const updatedUser = { ...user, ...updates };
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
    };

    const handleSaveBio = async () => {
        setLoading(true);
        await saveUserData({ bio });
        setLoading(false);
        Alert.alert('Success', 'Bio updated!');
    };

    const handleLogout = async () => {
        Alert.alert('Logout', 'Are you sure?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Logout',
                style: 'destructive',
                onPress: async () => {
                    await AsyncStorage.multiRemove(['token', 'user']);
                    navigation.replace('SignIn');
                },
            },
        ]);
    };

    return (
        <View style={globalStyles.container}>
            <View style={globalStyles.card}>
                <Text style={globalStyles.subtitle}>Profile</Text>

                {/* Avatar */}
                <TouchableOpacity onPress={pickImage} style={{ alignItems: 'center', marginVertical: 12 }}>
                    {avatar ? (
                        <Image source={{ uri: avatar }} style={{ width: 100, height: 100, borderRadius: 50 }} />
                    ) : (
                        <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontSize: 40, color: '#fff' }}>📷</Text>
                        </View>
                    )}
                    <Text style={[globalStyles.mutedText, { marginTop: 8 }]}>Tap to change photo</Text>
                </TouchableOpacity>

                <Text style={globalStyles.text}>Email: {email}</Text>

                <Text style={[globalStyles.text, { marginTop: 16 }]}>Bio</Text>
                <TextInput
                    style={[globalStyles.input, { height: 80, textAlignVertical: 'top' }]}
                    placeholder="Tell us about yourself..."
                    value={bio}
                    onChangeText={setBio}
                    multiline
                />
                <TouchableOpacity style={globalStyles.button} onPress={handleSaveBio} disabled={loading}>
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={globalStyles.buttonText}>Save Bio</Text>}
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={globalStyles.deleteButton} onPress={handleLogout}>
                <Text style={globalStyles.deleteButtonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
}