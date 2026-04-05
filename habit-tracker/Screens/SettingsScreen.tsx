import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../Context/ThemeContext';
import { createGlobalStyles } from '../Styles/globalStyle';

export default function SettingsScreen() {
    const { mode, setMode, colors } = useTheme();
    const globalStyles = createGlobalStyles(colors);

    const options = [
        { label: 'Light', value: 'light' as const },
        { label: 'Dark', value: 'dark' as const },
        { label: 'System default', value: 'system' as const },
    ];

    return (
        <View style={globalStyles.container}>
            <View style={globalStyles.card}>
                <Text style={globalStyles.subtitle}>Appearance</Text>
                {options.map((opt) => (
                    <TouchableOpacity
                        key={opt.value}
                        style={[
                            styles.option,
                            { borderColor: colors.border },
                            mode === opt.value && { backgroundColor: colors.primary + '20', borderColor: colors.primary }
                        ]}
                        onPress={() => setMode(opt.value)}
                    >
                        <Text style={[globalStyles.text, mode === opt.value && { color: colors.primary, fontWeight: 'bold' }]}>
                            {opt.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    option: { paddingVertical: 12, paddingHorizontal: 16, borderWidth: 1, borderRadius: 8, marginVertical: 6 },
});