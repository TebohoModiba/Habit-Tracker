import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Alert,
  ActivityIndicator, Modal, TextInput, StyleSheet, RefreshControl,
} from 'react-native';
import { useTheme } from '../Context/ThemeContext';
import { createGlobalStyles } from '../Styles/globalStyle';
import apiService, { Habit } from '../Functions/apiService';
import HabitCard from '../Components/HabitCard';

const HomeScreen = ({ route, navigation }: any) => {
  const { userId, username, firstName } = route.params;
  const { colors } = useTheme();
  const globalStyles = createGlobalStyles(colors);

  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newFrequency, setNewFrequency] = useState<'daily' | 'weekly'>('daily');
  const [newTargetCount, setNewTargetCount] = useState('1');
  const [saving, setSaving] = useState(false);

  // Add header buttons for Profile and Settings
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', gap: 16, marginRight: 16 }}>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Text style={{ fontSize: 20, color: colors.primary }}>👤</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <Text style={{ fontSize: 20, color: colors.primary }}>⚙️</Text>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, colors]);

  const fetchHabits = useCallback(async () => {
    try {
      const data = await apiService.getHabitsByUser(userId);
      setHabits(data);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Could not load habits.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchHabits();
  };

  const handleComplete = async (habitId: string) => {
    try {
      const updated = await apiService.markHabitComplete(habitId);
      setHabits(prev => prev.map(h => h.habitId === habitId ? updated : h));
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Could not update habit.');
    }
  };

  const handleAddHabit = async () => {
    if (!newTitle.trim()) {
      Alert.alert('Missing Field', 'Please enter a title for your habit.');
      return;
    }
    const target = parseInt(newTargetCount, 10);
    if (isNaN(target) || target < 1) {
      Alert.alert('Invalid Target', 'Target count must be at least 1.');
      return;
    }
    setSaving(true);
    try {
      const created = await apiService.createHabit({
        userId,
        title: newTitle.trim(),
        description: newDescription.trim(),
        frequency: newFrequency,
        targetCount: target,
        startDate: new Date().toISOString(),
      });
      setHabits(prev => [created, ...prev]);
      setModalVisible(false);
      setNewTitle('');
      setNewDescription('');
      setNewFrequency('daily');
      setNewTargetCount('1');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Could not create habit.');
    } finally {
      setSaving(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };
  const completedToday = habits.filter(h => h.isCompleted).length;

  const localStyles = StyleSheet.create({
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    greetingContainer: { flex: 1 },
    greeting: { fontSize: 22, fontWeight: '700', color: colors.titleText },
    suggestionsBtn: {
      backgroundColor: colors.primaryDark,
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 20,
      marginBottom: 12,
      alignSelf: 'flex-start',
    },
    suggestionsBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
    emptyState: { alignItems: 'center', marginTop: 60 },
    emptyEmoji: { fontSize: 48, marginBottom: 12 },
    emptyTitle: { fontSize: 20, fontWeight: '700', color: colors.titleText, marginBottom: 6 },
    fab: {
      position: 'absolute',
      bottom: 28,
      right: 24,
      width: 58,
      height: 58,
      borderRadius: 29,
      backgroundColor: colors.primaryDark,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
      elevation: 6,
    },
    fabText: { color: '#fff', fontSize: 28, fontWeight: '300', lineHeight: 32 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
    modalCard: {
      backgroundColor: colors.background,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 24,
      paddingBottom: 40,
    },
    modalTitle: { fontSize: 22, fontWeight: '700', color: colors.titleText, marginBottom: 16 },
    toggleRow: { flexDirection: 'row', marginBottom: 12, gap: 8 },
    toggleBtn: {
      flex: 1,
      paddingVertical: 10,
      borderRadius: 8,
      borderWidth: 1.5,
      borderColor: colors.border,
      alignItems: 'center',
    },
    toggleBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
    toggleText: { color: colors.mutedText, fontWeight: '600' },
    toggleTextActive: { color: '#fff' },
    modalActions: { flexDirection: 'row', marginTop: 8, gap: 8 },
  });

  return (
    <View style={globalStyles.container}>
      <View style={localStyles.header}>
        <View style={localStyles.greetingContainer}>
          <Text style={localStyles.greeting}>{getGreeting()}, {firstName} 👋</Text>
          <Text style={globalStyles.mutedText}>
            {completedToday}/{habits.length} habits done today
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={localStyles.suggestionsBtn}
        onPress={() => navigation.navigate('Suggestions', { userId })}
      >
        <Text style={localStyles.suggestionsBtnText}>✨ AI Suggestions</Text>
      </TouchableOpacity>

      <View style={globalStyles.divider} />

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        >
          {habits.length === 0 ? (
            <View style={localStyles.emptyState}>
              <Text style={localStyles.emptyEmoji}>🌱</Text>
              <Text style={localStyles.emptyTitle}>No habits yet</Text>
              <Text style={globalStyles.mutedText}>Tap the + button to add your first habit</Text>
            </View>
          ) : (
            habits.map(habit => (
              <HabitCard
                key={habit.habitId}
                habit={habit}
                onPress={() => navigation.navigate('HabitDetails', { habitId: habit.habitId, userId })}
                onComplete={() => handleComplete(habit.habitId)}
              />
            ))
          )}
          <View style={{ height: 80 }} />
        </ScrollView>
      )}

      <TouchableOpacity style={localStyles.fab} onPress={() => setModalVisible(true)}>
        <Text style={localStyles.fabText}>+</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={localStyles.modalOverlay}>
          <View style={localStyles.modalCard}>
            <Text style={localStyles.modalTitle}>New Habit 🌱</Text>
            <TextInput
              style={globalStyles.input}
              placeholder="Title *"
              value={newTitle}
              onChangeText={setNewTitle}
              editable={!saving}
            />
            <TextInput
              style={[globalStyles.input, { height: 80, textAlignVertical: 'top' }]}
              placeholder="Description (optional)"
              value={newDescription}
              onChangeText={setNewDescription}
              multiline
              editable={!saving}
            />
            <Text style={[globalStyles.mutedText, { alignSelf: 'flex-start', marginBottom: 4 }]}>Frequency</Text>
            <View style={localStyles.toggleRow}>
              {(['daily', 'weekly'] as const).map(f => (
                <TouchableOpacity
                  key={f}
                  style={[localStyles.toggleBtn, newFrequency === f && localStyles.toggleBtnActive]}
                  onPress={() => setNewFrequency(f)}
                >
                  <Text style={[localStyles.toggleText, newFrequency === f && localStyles.toggleTextActive]}>
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={globalStyles.input}
              placeholder="Target count (e.g. 1)"
              value={newTargetCount}
              onChangeText={setNewTargetCount}
              keyboardType="numeric"
              editable={!saving}
            />
            <View style={localStyles.modalActions}>
              <TouchableOpacity
                style={[globalStyles.outlineButton, { flex: 1 }]}
                onPress={() => setModalVisible(false)}
                disabled={saving}
              >
                <Text style={globalStyles.outlineButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[globalStyles.button, { flex: 1 }]}
                onPress={handleAddHabit}
                disabled={saving}
              >
                {saving ? <ActivityIndicator color="#fff" /> : <Text style={globalStyles.buttonText}>Add Habit</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default HomeScreen;