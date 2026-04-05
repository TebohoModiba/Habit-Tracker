import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../Context/ThemeContext';
import { Habit } from '../Functions/apiService';

interface HabitCardProps {
    habit: Habit;
    onPress: () => void;
    onComplete: () => void;
}

const HabitCard = ({ habit, onPress, onComplete }: HabitCardProps) => {
    const { colors } = useTheme();

    const styles = StyleSheet.create({
        card: {
            backgroundColor: colors.surface,
            borderRadius: 12,
            padding: 16,
            marginVertical: 6,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.08,
            shadowRadius: 4,
            elevation: 2,
        },
        row: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        title: {
            fontSize: 17,
            fontWeight: '600',
            color: colors.titleText,
            flex: 1,
        },
        completedBtn: {
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 20,
            backgroundColor: habit.isCompleted ? colors.success : colors.primary,
        },
        completedBtnText: {
            color: '#fff',
            fontSize: 12,
            fontWeight: '600',
        },
        frequency: {
            fontSize: 12,
            color: colors.mutedText,
            marginTop: 6,
        },
        streak: {
            fontSize: 12,
            color: colors.accent,
            marginTop: 4,
        },
    });

    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
            <View style={styles.card}>
                <View style={styles.row}>
                    <Text style={styles.title}>{habit.title}</Text>
                    <TouchableOpacity style={styles.completedBtn} onPress={onComplete}>
                        <Text style={styles.completedBtnText}>
                            {habit.isCompleted ? '✓ Done' : 'Mark Done'}
                        </Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.frequency}>📅 {habit.frequency} • 🎯 {habit.targetCount}x</Text>
                <Text style={styles.streak}>🔥 {habit.streakCount} day streak</Text>
            </View>
        </TouchableOpacity>
    );
};

export default HabitCard;