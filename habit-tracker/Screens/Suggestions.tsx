import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  Alert, ActivityIndicator, StyleSheet,
} from 'react-native';
import { useTheme } from '../Context/ThemeContext';
import { createGlobalStyles } from '../Styles/globalStyle';
import apiService, { SuggestionItem } from '../Functions/apiService';
import SuggestionCard from '../Components/SuggestionCard';

const Suggestions = ({ route, navigation }: any) => {
  const { userId } = route.params;
  const { colors } = useTheme();
  const globalStyles = createGlobalStyles(colors);

  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);
  const [addingIndex, setAddingIndex] = useState<number | null>(null);

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

  const localStyles = StyleSheet.create({
    headerRow: { marginTop: 8, marginBottom: 8 },
    backBtn: { fontSize: 16, color: colors.primaryDark, fontWeight: '600' },
    loadingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
    emptyState: { alignItems: 'center', marginTop: 48, paddingHorizontal: 16 },
    emptyEmoji: { fontSize: 48, marginBottom: 12 },
    emptyTitle: { fontSize: 20, fontWeight: '700', color: colors.titleText, marginBottom: 8 },
  });

  return (
    <ScrollView style={globalStyles.container} contentContainerStyle={{ paddingBottom: 60 }}>
      <View style={localStyles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={localStyles.backBtn}>← Back</Text>
        </TouchableOpacity>
      </View>
      <Text style={globalStyles.title}>AI Suggestions ✨</Text>
      <Text style={globalStyles.mutedText}>
        Personalised habit recommendations based on your current habits and streaks.
      </Text>
      <View style={globalStyles.divider} />

      <TouchableOpacity style={[globalStyles.button, loading && { opacity: 0.7 }]} onPress={fetchSuggestions} disabled={loading}>
        {loading ? (
          <View style={localStyles.loadingRow}>
            <ActivityIndicator color="#fff" style={{ marginRight: 8 }} />
            <Text style={globalStyles.buttonText}>Thinking...</Text>
          </View>
        ) : (
          <Text style={globalStyles.buttonText}>{suggestions.length > 0 ? '🔄 Regenerate Suggestions' : '✨ Get AI Suggestions'}</Text>
        )}
      </TouchableOpacity>

      {generatedAt && !loading && (
        <Text style={[globalStyles.mutedText, { textAlign: 'center', marginTop: 4, fontSize: 12 }]}>
          Generated {new Date(generatedAt).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}
        </Text>
      )}

      {suggestions.length === 0 && !loading && (
        <View style={localStyles.emptyState}>
          <Text style={localStyles.emptyEmoji}>🤖</Text>
          <Text style={localStyles.emptyTitle}>No suggestions yet</Text>
          <Text style={globalStyles.mutedText}>Tap the button above and Gemini will analyse your habits and suggest new ones.</Text>
        </View>
      )}

      {suggestions.map((s, i) => (
        <View key={i} style={addingIndex === i ? { opacity: 0.6 } : {}}>
          <SuggestionCard suggestion={s} onAdd={() => handleAddSuggestion(s, i)} />
          {addingIndex === i && <ActivityIndicator color={colors.primary} style={{ position: 'absolute', right: 16, top: 20 }} />}
        </View>
      ))}
    </ScrollView>
  );
};

export default Suggestions;