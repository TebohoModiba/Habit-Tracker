import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const colors = {
  background:   '#f8f9fa',
  surface:      '#ffffff',
  primary:      '#9a8c98',
  primaryDark:  '#4a4e69',
  accent:       '#c9ada7',
  titleText:    '#22223b',
  bodyText:     '#4a4e69',
  mutedText:    '#9a8c98',
  border:       '#c9ada7',
  error:        '#e63946',
  success:      '#2a9d8f',
};

const globalStyles = StyleSheet.create({

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
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },

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

  button: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
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
    marginVertical: 8,
    width: '100%',
  },
  outlineButtonText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 16,
  },

  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    padding: 12,
    marginVertical: 8,
    fontSize: 16,
    backgroundColor: colors.surface,
    width: '100%',
  },
  inputFocused: {
    borderColor: colors.primaryDark,
    borderWidth: 2,
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
    width: '100%',
  },

  fullWidth: {
    width: width,
  },
});

export default globalStyles;