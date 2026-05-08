import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

export function Card({ children, style, compact = false }) {
  const { colors } = useApp();
  return <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, shadowColor: colors.shadow }, compact && styles.cardCompact, style]}>{children}</View>;
}

export function LogoMark({ size = 46 }) {
  const { colors } = useApp();
  return (
    <View style={[styles.logoMark, { width: size, height: size, backgroundColor: colors.primary }]}> 
      <Text style={styles.logoText}>JQ</Text>
    </View>
  );
}

export function PrimaryButton({ title, onPress, variant = 'primary', fullWidth = false, style, disabled = false }) {
  const { colors } = useApp();
  const isSecondary = variant === 'secondary';
  const isGhost = variant === 'ghost';
  const backgroundColor = isGhost ? 'transparent' : isSecondary ? colors.mutedSurface : colors.primary;
  const color = isGhost ? colors.text : isSecondary ? colors.text : '#ffffff';
  const borderColor = isGhost ? colors.border : backgroundColor;

  return (
    <Pressable onPress={onPress} disabled={disabled} style={({ pressed }) => [
      styles.button,
      { backgroundColor, borderColor, opacity: disabled ? 0.6 : pressed ? 0.88 : 1 },
      fullWidth && styles.fullWidth,
      style
    ]}>
      <Text style={[styles.buttonText, { color }]}>{title}</Text>
    </Pressable>
  );
}

export function IconButton({ icon: Icon = Feather, iconName, onPress, variant = 'secondary', size = 18, title }) {
  const { colors } = useApp();
  const isSecondary = variant === 'secondary';
  const backgroundColor = isSecondary ? colors.mutedSurface : colors.primary;
  const color = isSecondary ? colors.text : '#fff';
  return (
    <Pressable onPress={onPress} accessibilityLabel={title} style={({ pressed }) => [styles.iconButton, { backgroundColor, borderColor: colors.border, opacity: pressed ? 0.85 : 1 }]}>
      {Icon ? <Icon name={iconName} size={size} color={color} /> : null}
    </Pressable>
  );
}

export function TextField({ label, value, onChangeText, placeholder, secureTextEntry = false, keyboardType = 'default', error, multiline = false, numberOfLines = 4, editable = true }) {
  const { colors } = useApp();
  return (
    <View style={styles.fieldWrap}>
      {label ? <Text style={[styles.label, { color: colors.text }]}>{label}</Text> : null}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={numberOfLines}
        editable={editable}
        style={[
          styles.input,
          { backgroundColor: colors.surface, color: colors.text, borderColor: error ? colors.danger : colors.border, minHeight: multiline ? 100 : 50, textAlignVertical: multiline ? 'top' : 'center' }
        ]}
      />
      {error ? <Text style={[styles.error, { color: colors.danger }]}>{error}</Text> : null}
    </View>
  );
}

export function ScreenHeader({ eyebrow, title, description, actions }) {
  const { colors, theme } = useApp();
  const { width } = useWindowDimensions();
  return (
    <View style={[styles.headerWrap, { gap: width > 720 ? 14 : 10 }]}>
      <View style={{ flex: 1 }}>
        {eyebrow ? <Text style={[styles.eyebrow, { color: colors.primary }]}>{eyebrow.toUpperCase()}</Text> : null}
        <Text style={[styles.pageTitle, { color: colors.text }]}>{title}</Text>
        {description ? <Text style={[styles.pageDescription, { color: colors.mutedText }]}>{description}</Text> : null}
      </View>
      {actions ? <View style={styles.headerActions}>{actions}</View> : null}
    </View>
  );
}

export function StatCard({ label, value, note, icon: iconName, accent = 'primary' }) {
  const { colors } = useApp();
  const palette = {
    primary: colors.primarySoft,
    success: 'rgba(16, 138, 74, 0.15)',
    warning: 'rgba(198, 123, 0, 0.16)',
    danger: 'rgba(204, 59, 59, 0.15)',
    neutral: colors.mutedSurface
  };
  const iconColor = accent === 'success' ? colors.success : accent === 'warning' ? colors.warning : accent === 'danger' ? colors.danger : colors.primary;
  return (
    <Card style={styles.statCard}>
      <View style={styles.statHeader}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.statLabel, { color: colors.mutedText }]}>{label}</Text>
          <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
          {note ? <Text style={[styles.statNote, { color: colors.success }]}>{note}</Text> : null}
        </View>
        <View style={[styles.statIcon, { backgroundColor: palette[accent] || palette.primary }]}>
          <Feather name={iconName} size={22} color={iconColor} />
        </View>
      </View>
    </Card>
  );
}

export function Pill({ children, variant = 'neutral', style }) {
  const { colors } = useApp();
  const background = variant === 'success'
    ? 'rgba(16, 138, 74, 0.15)'
    : variant === 'warning'
      ? 'rgba(198, 123, 0, 0.15)'
      : variant === 'danger'
        ? 'rgba(204, 59, 59, 0.15)'
        : colors.mutedSurface;
  const color = variant === 'success' ? colors.success : variant === 'warning' ? colors.warning : variant === 'danger' ? colors.danger : colors.text;
  return <View style={[styles.pill, { backgroundColor: background } , style]}><Text style={[styles.pillText, { color }]}>{children}</Text></View>;
}

export function Chip({ label, active = false, onPress, iconName }) {
  const { colors } = useApp();
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [
      styles.chip,
      { backgroundColor: active ? colors.primarySoft : colors.mutedSurface, borderColor: active ? colors.primary : colors.border, opacity: pressed ? 0.88 : 1 }
    ]}>
      {iconName ? <Feather name={iconName} size={13} color={active ? colors.primary : colors.mutedText} /> : null}
      <Text style={[styles.chipText, { color: active ? colors.primary : colors.text }]}>{label}</Text>
    </Pressable>
  );
}

export function ProgressBar({ value }) {
  const { colors } = useApp();
  const safe = Math.max(0, Math.min(100, Number(value || 0)));
  return (
    <View style={[styles.progressTrack, { backgroundColor: colors.mutedSurface }]}>
      <View style={[styles.progressFill, { width: `${safe}%`, backgroundColor: colors.primary }]} />
    </View>
  );
}

export function ThemeToggle() {
  const { theme, toggleTheme, t, colors } = useApp();
  const dark = theme === 'dark';
  return (
    <Pressable onPress={toggleTheme} style={({ pressed }) => [styles.smallToggle, { backgroundColor: colors.mutedSurface, borderColor: colors.border, opacity: pressed ? 0.88 : 1 }]}>
      <Feather name={dark ? 'moon' : 'sun'} size={16} color={colors.text} />
      <Text style={[styles.smallToggleText, { color: colors.text }]}>{dark ? t('theme.dark') : t('theme.light')}</Text>
    </Pressable>
  );
}

export function LanguageToggle() {
  const { language, toggleLanguage, colors } = useApp();
  return (
    <Pressable onPress={toggleLanguage} style={({ pressed }) => [styles.smallToggle, { backgroundColor: colors.mutedSurface, borderColor: colors.border, opacity: pressed ? 0.88 : 1 }]}>
      <Feather name="globe" size={15} color={colors.text} />
      <Text style={[styles.smallToggleText, { color: colors.text }]}>{language === 'es' ? 'ES' : 'EN'}</Text>
    </Pressable>
  );
}

export function LoadingScreen() {
  const { colors } = useApp();
  return (
    <View style={[styles.loadingWrap, { backgroundColor: colors.background }]}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={[styles.loadingText, { color: colors.mutedText }]}>Cargando JQPA…</Text>
    </View>
  );
}

export function ToastBanner() {
  const { colors, toast, dismissToast } = useApp();
  if (!toast) return null;
  return (
    <Pressable onPress={dismissToast} style={[styles.toastWrap, { backgroundColor: colors.surface, borderColor: colors.border, shadowColor: colors.shadow }]}>
      <View style={[styles.toastBar, { backgroundColor: colors.primary }]} />
      <View style={{ flex: 1 }}>
        <Text style={[styles.toastTitle, { color: colors.text }]}>{toast.title}</Text>
        {toast.message ? <Text style={[styles.toastMessage, { color: colors.mutedText }]}>{toast.message}</Text> : null}
      </View>
    </Pressable>
  );
}

export function SectionCard({ title, subtitle, children, action }) {
  const { colors } = useApp();
  return (
    <Card style={{ marginBottom: 14 }}>
      <View style={styles.sectionHeader}>
        <View style={{ flex: 1 }}>
          {subtitle ? <Text style={[styles.sectionSubtitle, { color: colors.primary }]}>{subtitle.toUpperCase()}</Text> : null}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
        </View>
        {action ? <View>{action}</View> : null}
      </View>
      <View>{children}</View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 16,
    marginBottom: 14,
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 1
  },
  cardCompact: {
    padding: 12,
    borderRadius: 20
  },
  logoMark: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15
  },
  logoText: {
    color: '#fff',
    fontSize: 18,
    lineHeight: 18,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  button: {
    minHeight: 46,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8
  },
  fullWidth: { width: '100%' },
  buttonText: {
    fontSize: 15,
    fontWeight: '700'
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  fieldWrap: {
    marginBottom: 14
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8
  },
  input: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    fontWeight: '500'
  },
  error: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '600'
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.4,
    marginBottom: 4
  },
  pageTitle: {
    fontSize: 32,
    lineHeight: 36,
    fontWeight: '800'
  },
  pageDescription: {
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
    fontWeight: '500'
  },
  headerWrap: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 18,
    gap: 12,
    flexWrap: 'wrap'
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap'
  },
  statCard: {
    minHeight: 126,
    flexBasis: '48%',
    flexGrow: 1,
    minWidth: 150
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between'
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8
  },
  statValue: {
    fontSize: 30,
    lineHeight: 34,
    fontWeight: '800'
  },
  statNote: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: '700'
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  pill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999
  },
  pillText: {
    fontSize: 12,
    fontWeight: '800'
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    marginRight: 10,
    marginBottom: 10
  },
  chipText: {
    fontSize: 13,
    fontWeight: '700'
  },
  progressTrack: {
    width: '100%',
    height: 10,
    borderRadius: 999,
    overflow: 'hidden',
    marginTop: 10
  },
  progressFill: {
    height: '100%',
    borderRadius: 999
  },
  smallToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  smallToggleText: {
    fontSize: 13,
    fontWeight: '800'
  },
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12
  },
  loadingText: {
    fontSize: 15,
    fontWeight: '600'
  },
  toastWrap: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 18,
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowOpacity: 0.14,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4
  },
  toastBar: {
    width: 6,
    height: 42,
    borderRadius: 999
  },
  toastTitle: {
    fontSize: 14,
    fontWeight: '800'
  },
  toastMessage: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
    lineHeight: 18
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 12
  },
  sectionSubtitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 4
  },
  sectionTitle: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '800'
  }
});
