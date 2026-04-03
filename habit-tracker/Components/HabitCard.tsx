import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../Styles/globalStyle';
import { Habit } from '../Functions/apiService';

interface HabitCardProps {
    habit: Habit;
    onPress: () => void;
    onComplete: () => void;
}

const HabitCard = ({ habit, onPress, onComplete }: HabitCardProps) => {
    const streakLabel = habit.frequency === 'daily'
        ? `${habit.streakCount} day streak`
        : `${habit.streakCount} week streak`;

    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>

            {/* Top row: title + frequency badge */}
            <View style={styles.row}>
                <Text style={styles.title} numberOfLines={1}>{habit.title}</Text>
                <View style={[styles.badge, habit.frequency === 'daily' ? styles.badgeDaily : styles.badgeWeekly]}>
                    <Text style={styles.badgeText}>{habit.frequency}</Text>
                </View>
            </View>

            {/* Description */}
            {habit.description ? (
                <Text style={styles.description} numberOfLines={2}>{habit.description}</Text>
            ) : null}

            {/* Bottom row: streak + complete button */}
            <View style={[styles.row, { marginTop: 12 }]}>
                <View style={styles.streakContainer}>
                    <Text style={styles.streakEmoji}>🔥</Text>
                    <Text style={styles.streakText}>{streakLabel}</Text>
                </View>

                <TouchableOpacity
                    style={[styles.completeBtn, habit.isCompleted && styles.completedBtn]}
                    onPress={onComplete}
                    activeOpacity={0.8}
                >
                    <Text style={styles.completeBtnText}>
                        {habit.isCompleted ? '✓ Done' : 'Mark Done'}
                    </Text>
                </TouchableOpacity>
            </View>

        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.surface,
        borderRadius: 14,
        padding: 16,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3,
        borderLeftWidth: 4,
        borderLeftColor: colors.primary,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 17,
        fontWeight: '700',
        color: colors.titleText,
        flex: 1,
        marginRight: 8,
    },
    description: {
        fontSize: 13,
        color: colors.mutedText,
        marginTop: 4,
    },
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 20,
    },
    badgeDaily: {
        backgroundColor: '#e8f4f8',
    },
    badgeWeekly: {
        backgroundColor: '#f3efe8',
    },
    badgeText: {
        fontSize: 11,
        fontWeight: '600',
        color: colors.primaryDark,
        textTransform: 'capitalize',
    },
    streakContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    streakEmoji: {
        fontSize: 14,
        marginRight: 4,
    },
    streakText: {
        fontSize: 13,
        color: colors.bodyText,
        fontWeight: '500',
    },
    completeBtn: {
        backgroundColor: colors.primary,
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 20,
    },
    completedBtn: {
        backgroundColor: colors.success,
    },
    completeBtnText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '700',
    },
});

export default HabitCard;