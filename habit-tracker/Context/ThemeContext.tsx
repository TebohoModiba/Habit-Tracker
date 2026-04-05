import React, { createContext, useState, useEffect, useContext } from 'react';
import { Appearance, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeMode = 'light' | 'dark' | 'system';

const lightColors = {
    background: '#f8f9fa',
    surface: '#ffffff',
    primary: '#9a8c98',
    primaryDark: '#4a4e69',
    accent: '#c9ada7',
    titleText: '#22223b',
    bodyText: '#4a4e69',
    mutedText: '#9a8c98',
    border: '#c9ada7',
    error: '#e63946',
    success: '#2a9d8f',
    badgeDaily: '#e8f4f8',
    badgeWeekly: '#f3efe8',
    badgePurple: '#f0ecf5',
};

const darkColors = {
    background: '#121212',
    surface: '#1e1e1e',
    primary: '#b09b8c',
    primaryDark: '#6c6f8d',
    accent: '#d9c2b8',
    titleText: '#f0f0f0',
    bodyText: '#d0d0d0',
    mutedText: '#a0a0a0',
    border: '#3a3a3a',
    error: '#ff6b6b',
    success: '#4cae9c',
    badgeDaily: '#2a3a3a',
    badgeWeekly: '#3a352a',
    badgePurple: '#3a2a4a',
};

export type ThemeColors = typeof lightColors;

interface ThemeContextType {
    mode: ThemeMode;
    colors: ThemeColors;
    setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Helper to normalise 'light'/'dark' from any nullable ColorSchemeName
const normalizeColorScheme = (scheme: 'light' | 'dark' | null | undefined): 'light' | 'dark' => {
    return scheme === 'dark' ? 'dark' : 'light';
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const systemScheme = useColorScheme(); // can be 'light', 'dark', or null
    const [mode, setMode] = useState<ThemeMode>('system');
    const [currentSystemScheme, setCurrentSystemScheme] = useState<'light' | 'dark'>(
        normalizeColorScheme(Appearance.getColorScheme())
    );

    // Load saved preference from storage
    useEffect(() => {
        const load = async () => {
            const saved = await AsyncStorage.getItem('themeMode');
            if (saved === 'light' || saved === 'dark' || saved === 'system') {
                setMode(saved);
            }
        };
        load();
    }, []);

    // Persist user preference when it changes
    useEffect(() => {
        AsyncStorage.setItem('themeMode', mode);
    }, [mode]);

    // Listen for live system theme changes
    useEffect(() => {
        const subscription = Appearance.addChangeListener(({ colorScheme }) => {
            setCurrentSystemScheme(normalizeColorScheme(colorScheme));
        });
        return () => subscription.remove();
    }, []);

    // Keep currentSystemScheme in sync with useColorScheme (for initial load / hot reload)
    useEffect(() => {
        setCurrentSystemScheme(normalizeColorScheme(systemScheme));
    }, [systemScheme]);

    // Determine effective theme
    let effectiveTheme: 'light' | 'dark';
    if (mode === 'system') {
        effectiveTheme = currentSystemScheme;
    } else {
        effectiveTheme = mode;
    }

    const colors = effectiveTheme === 'light' ? lightColors : darkColors;

    return (
        <ThemeContext.Provider value={{ mode, colors, setMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
    return ctx;
};