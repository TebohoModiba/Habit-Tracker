import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import globalStyles from '../Styles/globalStyle';

const HomeScreen = ({route}: any) =>{
    
    const { username } = route.params;

    return(
        <View style={globalStyles.container}>
            <Text style={globalStyles.title}>Welcome, {username}!</Text>
            <Text style={globalStyles.subtitle}>Here are your habits. Ready to make a change?</Text>
        </View>
    );
}