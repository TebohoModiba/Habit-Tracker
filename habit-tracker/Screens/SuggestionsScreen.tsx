import React, { useState } from 'react';
import {
    View, Text, ScrollView, TouchableOpacity,
    Alert, ActivityIndicator, StyleSheet,
} from 'react-native';
import globalStyles, { colors } from '../Styles/globalStyle';
import apiService, { SuggestionItem } from '../Functions/apiService';
import SuggestionCard from '../Components/SuggestionCard';

const Suggestions = ({ route, navigation }: any) => {
    const { userId } = route.params;

    const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [generatedAt, setGeneratedAt] = useState<string | null>(null);
    const [addingIndex, setAddingIndex] = useState<number | null>(null);

    // ── Fetch suggestions ───────────────────────────────────────────────────────

    const fetchSuggestions = async () => {
        setLoading(true);
        setSuggestions([]);
        setGeneratedAt(null);
        try {
            const result = await apiService.getSuggestions(userId);
            setSuggestions(result.suggestions);
            setGeneratedAt(result.generatedAt);
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Could not fetch suggestions. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // ── Add suggestion as a habit ───────────────────────────────────────────────

    const handleAddSuggestion = async (suggestion: SuggestionItem, index: number) => {
        setAddingIndex(index);
        try {
            await apiService.createHabit({
                userId,
                title: suggestion.title,
                description: suggestion.description,
                frequency: suggestion.frequency,
                targetCount: suggestion.targetCount,
                startDate: new Date().toISOString(),
            });
            Alert.alert('Habit Added! 🌱', `"${suggestion.title}" has been added to your habits.`);
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Could not add habit.');
        } finally {
            setAddingIndex(null);
        }
    };

    // ── Render ──────────────────────────────────────────────────────────────────

    return (
        <ScrollView style={globalStyles.container} contentContainerStyle={{ paddingBottom: 60 }}>

            {/* Header */}
            <View style={styles.headerRow}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backBtn}>← Back</Text>
                </TouchableOpacity>
            </View>

            <Text style={globalStyles.title}>AI Suggestions ✨</Text>
            <Text style={globalStyles.mutedText}>
                Personalised habit recommendations based on your current habits and streaks.
            </Text>

            <View style={globalStyles.divider} />

            {/* Generate button */}
            <TouchableOpacity
                style={[globalStyles.button, loading && { opacity: 0.7 }]}
                onPress={fetchSuggestions}
                disabled={loading}
            >
                {loading
                    ? (
                        <View style={styles.loadingRow}>
                            <ActivityIndicator color="#fff" style={{ marginRight: 8 }} />
                            <Text style={globalStyles.buttonText}>Thinking...</Text>
                        </View>
                    )
                    : <Text style={globalStyles.buttonText}>
                        {suggestions.length > 0 ? '🔄 Regenerate Suggestions' : '✨ Get AI Suggestions'}
                    </Text>
                }
            </TouchableOpacity>

            {/* Generated timestamp */}
            {generatedAt && !loading && (
                <Text style={[globalStyles.mutedText, { textAlign: 'center', marginTop: 4, fontSize: 12 }]}>
                    Generated {new Date(generatedAt).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}
                </Text>
            )}

            {/* Empty state before first fetch */}
            {suggestions.length === 0 && !loading && (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyEmoji}>🤖</Text>
                    <Text style={styles.emptyTitle}>No suggestions yet</Text>
                    <Text style={globalStyles.mutedText}>
                        Tap the button above and Grok will analyse your habits and suggest new ones.
                    </Text>
                </View>
            )}

            {/* Suggestion cards */}
            {suggestions.map((s, i) => (
                <View key={i} style={addingIndex === i ? { opacity: 0.6 } : {}}>
                    <SuggestionCard
                        suggestion={s}
                        onAdd={() => handleAddSuggestion(s, i)}
                    />
                    {addingIndex === i && (
                        <ActivityIndicator
                            color={colors.primary}
                            style={{ position: 'absolute', right: 16, top: 20 }}
                        />
                    )}
                </View>
            ))}

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    headerRow: {
        marginTop: 8,
        marginBottom: 8,
    },
    backBtn: {
        fontSize: 16,
        color: colors.primaryDark,
        fontWeight: '600',
    },
    loadingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyState: {
        alignItems: 'center',
        marginTop: 48,
        paddingHorizontal: 16,
    },
    emptyEmoji: {
        fontSize: 48,
        marginBottom: 12,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.titleText,
        marginBottom: 8,
    },
});

export default Suggestions;