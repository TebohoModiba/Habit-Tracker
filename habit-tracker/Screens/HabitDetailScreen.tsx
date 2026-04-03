import React, { useState, useEffect } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    ScrollView, Alert, ActivityIndicator, StyleSheet,
} from 'react-native';
import globalStyles, { colors } from '../Styles/globalStyle';
import apiService, { Habit } from '../Functions/apiService';

const HabitDetails = ({ route, navigation }: any) => {
    const { habitId, userId } = route.params;

    const [habit, setHabit] = useState<Habit | null>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    // Editable fields
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily');
    const [targetCount, setTargetCount] = useState('1');

    // ── Fetch ───────────────────────────────────────────────────────────────────

    useEffect(() => {
        const fetchHabit = async () => {
            try {
                const data = await apiService.getHabitById(habitId);
                setHabit(data);
                setTitle(data.title);
                setDescription(data.description);
                setFrequency(data.frequency);
                setTargetCount(String(data.targetCount));
            } catch (error: any) {
                Alert.alert('Error', error.message || 'Could not load habit.');
                navigation.goBack();
            } finally {
                setLoading(false);
            }
        };
        fetchHabit();
    }, [habitId]);

    // ── Save edits ──────────────────────────────────────────────────────────────

    const handleSave = async () => {
        if (!title.trim()) {
            Alert.alert('Missing Field', 'Title cannot be empty.');
            return;
        }
        const target = parseInt(targetCount, 10);
        if (isNaN(target) || target < 1) {
            Alert.alert('Invalid Target', 'Target count must be at least 1.');
            return;
        }

        setSaving(true);
        try {
            const updated = await apiService.updateHabit(habitId, {
                userId,
                title: title.trim(),
                description: description.trim(),
                frequency,
                targetCount: target,
                startDate: habit!.startDate,
            });
            setHabit(updated);
            setEditing(false);
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Could not update habit.');
        } finally {
            setSaving(false);
        }
    };

    // ── Delete ──────────────────────────────────────────────────────────────────

    const handleDelete = () => {
        Alert.alert(
            'Delete Habit',
            `Are you sure you want to delete "${habit?.title}"? This cannot be undone.`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        setDeleting(true);
                        try {
                            await apiService.deleteHabit(habitId);
                            navigation.goBack();
                        } catch (error: any) {
                            Alert.alert('Error', error.message || 'Could not delete habit.');
                            setDeleting(false);
                        }
                    },
                },
            ]
        );
    };

    // ── Render ──────────────────────────────────────────────────────────────────

    if (loading) {
        return (
            <View style={[globalStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    if (!habit) return null;

    return (
        <ScrollView style={globalStyles.container} contentContainerStyle={{ paddingBottom: 40 }}>

            {/* Header */}
            <View style={styles.headerRow}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backBtn}>← Back</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setEditing(!editing)}>
                    <Text style={styles.editBtn}>{editing ? 'Cancel' : 'Edit'}</Text>
                </TouchableOpacity>
            </View>

            {/* Stats card */}
            <View style={styles.statsCard}>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>🔥 {habit.streakCount}</Text>
                    <Text style={styles.statLabel}>
                        {habit.frequency === 'daily' ? 'Day Streak' : 'Week Streak'}
                    </Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>🎯 {habit.targetCount}</Text>
                    <Text style={styles.statLabel}>Target</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>{habit.isCompleted ? '✅' : '⏳'}</Text>
                    <Text style={styles.statLabel}>{habit.isCompleted ? 'Done' : 'Pending'}</Text>
                </View>
            </View>

            <View style={globalStyles.divider} />

            {/* Fields */}
            <Text style={styles.fieldLabel}>Title</Text>
            {editing ? (
                <TextInput
                    style={globalStyles.input}
                    value={title}
                    onChangeText={setTitle}
                    editable={!saving}
                />
            ) : (
                <Text style={styles.fieldValue}>{habit.title}</Text>
            )}

            <Text style={styles.fieldLabel}>Description</Text>
            {editing ? (
                <TextInput
                    style={[globalStyles.input, { height: 80, textAlignVertical: 'top' }]}
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    editable={!saving}
                />
            ) : (
                <Text style={styles.fieldValue}>{habit.description || '—'}</Text>
            )}

            <Text style={styles.fieldLabel}>Frequency</Text>
            {editing ? (
                <View style={styles.toggleRow}>
                    {(['daily', 'weekly'] as const).map(f => (
                        <TouchableOpacity
                            key={f}
                            style={[styles.toggleBtn, frequency === f && styles.toggleBtnActive]}
                            onPress={() => setFrequency(f)}
                        >
                            <Text style={[styles.toggleText, frequency === f && styles.toggleTextActive]}>
                                {f.charAt(0).toUpperCase() + f.slice(1)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            ) : (
                <Text style={styles.fieldValue}>{habit.frequency}</Text>
            )}

            <Text style={styles.fieldLabel}>Target Count</Text>
            {editing ? (
                <TextInput
                    style={globalStyles.input}
                    value={targetCount}
                    onChangeText={setTargetCount}
                    keyboardType="numeric"
                    editable={!saving}
                />
            ) : (
                <Text style={styles.fieldValue}>{habit.targetCount}</Text>
            )}

            <Text style={styles.fieldLabel}>Started</Text>
            <Text style={styles.fieldValue}>
                {new Date(habit.startDate).toLocaleDateString('en-ZA', {
                    year: 'numeric', month: 'long', day: 'numeric',
                })}
            </Text>

            {habit.lastCompletedAt && (
                <>
                    <Text style={styles.fieldLabel}>Last Completed</Text>
                    <Text style={styles.fieldValue}>
                        {new Date(habit.lastCompletedAt).toLocaleString('en-ZA')}
                    </Text>
                </>
            )}

            <View style={globalStyles.divider} />

            {/* Actions */}
            {editing && (
                <TouchableOpacity
                    style={[globalStyles.button, saving && { opacity: 0.7 }]}
                    onPress={handleSave}
                    disabled={saving}
                >
                    {saving
                        ? <ActivityIndicator color="#fff" />
                        : <Text style={globalStyles.buttonText}>Save Changes</Text>
                    }
                </TouchableOpacity>
            )}

            <TouchableOpacity
                style={[globalStyles.outlineButton, styles.deleteBtn, deleting && { opacity: 0.7 }]}
                onPress={handleDelete}
                disabled={deleting}
            >
                {deleting
                    ? <ActivityIndicator color={colors.error} />
                    : <Text style={[globalStyles.outlineButtonText, { color: colors.error }]}>Delete Habit</Text>
                }
            </TouchableOpacity>

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 8,
    },
    backBtn: {
        fontSize: 16,
        color: colors.primaryDark,
        fontWeight: '600',
    },
    editBtn: {
        fontSize: 16,
        color: colors.primary,
        fontWeight: '600',
    },
    statsCard: {
        backgroundColor: colors.surface,
        borderRadius: 14,
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 22,
        fontWeight: '700',
        color: colors.titleText,
    },
    statLabel: {
        fontSize: 12,
        color: colors.mutedText,
        marginTop: 4,
    },
    statDivider: {
        width: 1,
        height: 40,
        backgroundColor: colors.border,
    },
    fieldLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: colors.mutedText,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        marginTop: 16,
        marginBottom: 4,
    },
    fieldValue: {
        fontSize: 16,
        color: colors.bodyText,
        paddingVertical: 4,
    },
    toggleRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 4,
    },
    toggleBtn: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1.5,
        borderColor: colors.border,
        alignItems: 'center',
    },
    toggleBtnActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    toggleText: {
        color: colors.mutedText,
        fontWeight: '600',
    },
    toggleTextActive: {
        color: '#fff',
    },
    deleteBtn: {
        borderColor: colors.error,
        marginTop: 8,
    },
});

export default HabitDetails;