import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

// ─── Color Palette ────────────────────────────────────────────────────────────

export const colors = {
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

  // Badge backgrounds
  badgeDaily: '#e8f4f8',
  badgeWeekly: '#f3efe8',
  badgePurple: '#f0ecf5',
};

// ─── Global Styles ────────────────────────────────────────────────────────────

const globalStyles = StyleSheet.create({

  // ── Layout ────────────────────────────────────────────────────────────────

  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  centeredContainer: {
    flexGrow: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingVertical: 40,
  },
  fullWidth: {
    width: width,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowSpaced: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  // ── Cards ─────────────────────────────────────────────────────────────────

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
  },
  cardAccentLeft: {
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

  // Stats card row (used in HabitDetails)
  statsCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
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

  // ── Typography ────────────────────────────────────────────────────────────

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.titleText,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primaryDark,
    marginBottom: 8,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.mutedText,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 16,
    marginBottom: 4,
  },
  text: {
    fontSize: 16,
    color: colors.bodyText,
  },
  mutedText: {
    fontSize: 14,
    color: colors.mutedText,
  },
  errorText: {
    fontSize: 13,
    color: colors.error,
    marginTop: 4,
  },
  fieldValue: {
    fontSize: 16,
    color: colors.bodyText,
    paddingVertical: 4,
  },

  // ── Buttons ───────────────────────────────────────────────────────────────

  button: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    width: '100%',
  },
  buttonText: {
    color: colors.surface,
    fontWeight: '600',
    fontSize: 16,
  },
  outlineButton: {
    borderWidth: 2,
    borderColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    width: '100%',
  },
  outlineButtonText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 16,
  },
  deleteButton: {
    borderWidth: 2,
    borderColor: colors.error,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    width: '100%',
  },
  deleteButtonText: {
    color: colors.error,
    fontWeight: '600',
    fontSize: 16,
  },

  // Floating action button
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
  fabText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '300',
    lineHeight: 32,
  },

  // Pill / tag button (used in HomeScreen header)
  pillButton: {
    backgroundColor: colors.primaryDark,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  pillButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },

  // Inline action pill (e.g. Mark Done)
  actionPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: colors.primary,
  },
  actionPillText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },

  // ── Frequency toggle (reused in HomeScreen modal + HabitDetails edit) ─────

  toggleRow: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 8,
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
    fontSize: 14,
  },
  toggleTextActive: {
    color: '#fff',
  },

  // ── Badges ────────────────────────────────────────────────────────────────

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    backgroundColor: colors.badgePurple,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primaryDark,
    textTransform: 'capitalize',
  },

  // ── Inputs ────────────────────────────────────────────────────────────────

  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    padding: 12,
    marginVertical: 8,
    fontSize: 16,
    backgroundColor: colors.surface,
    width: '100%',
    color: colors.bodyText,
  },
  inputFocused: {
    borderColor: colors.primaryDark,
    borderWidth: 2,
  },
  inputMultiline: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    padding: 12,
    marginVertical: 8,
    fontSize: 16,
    backgroundColor: colors.surface,
    width: '100%',
    height: 80,
    textAlignVertical: 'top',
    color: colors.bodyText,
  },

  // ── Divider ───────────────────────────────────────────────────────────────

  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
    width: '100%',
  },

  // ── Modal ─────────────────────────────────────────────────────────────────

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.titleText,
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    marginTop: 8,
  },

  // ── Empty state ───────────────────────────────────────────────────────────

  emptyState: {
    alignItems: 'center',
    marginTop: 60,
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
    marginBottom: 6,
  },

  // ── Loading row (spinner + label side by side) ────────────────────────────

  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Navigation helpers ────────────────────────────────────────────────────

  backBtn: {
    fontSize: 16,
    color: colors.primaryDark,
    fontWeight: '600',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 8,
  },
});

export default globalStyles;