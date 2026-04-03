import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../Styles/globalStyle';
import { SuggestionItem } from '../Functions/apiService';

interface SuggestionCardProps {
    suggestion: SuggestionItem;
    onAdd: () => void;
}

const SuggestionCard = ({ suggestion, onAdd }: SuggestionCardProps) => {
    return (
        <View style={styles.card}>

            {/* Header row */}
            <View style={styles.row}>
                <Text style={styles.sparkle}>✨</Text>
                <Text style={styles.title} numberOfLines={1}>{suggestion.title}</Text>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{suggestion.frequency}</Text>
                </View>
            </View>

            {/* Description */}
            <Text style={styles.description}>{suggestion.description}</Text>

            {/* Target + Add button */}
            <View style={[styles.row, { marginTop: 12 }]}>
                <Text style={styles.target}>
                    🎯 {suggestion.targetCount}x {suggestion.frequency}
                </Text>
                <TouchableOpacity style={styles.addBtn} onPress={onAdd} activeOpacity={0.8}>
                    <Text style={styles.addBtnText}>+ Add Habit</Text>
                </TouchableOpacity>
            </View>

        </View>
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
        shadowOpacity: 0.07,
        shadowRadius: 6,
        elevation: 3,
        borderLeftWidth: 4,
        borderLeftColor: colors.accent,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    sparkle: {
        fontSize: 16,
        marginRight: 6,
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.titleText,
        flex: 1,
        marginRight: 8,
    },
    description: {
        fontSize: 13,
        color: colors.bodyText,
        marginTop: 8,
        lineHeight: 19,
    },
    badge: {
        backgroundColor: '#f0ecf5',
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 20,
    },
    badgeText: {
        fontSize: 11,
        fontWeight: '600',
        color: colors.primaryDark,
        textTransform: 'capitalize',
    },
    target: {
        fontSize: 13,
        color: colors.mutedText,
        fontWeight: '500',
    },
    addBtn: {
        backgroundColor: colors.primaryDark,
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 20,
    },
    addBtnText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '700',
    },
});

export default SuggestionCard;