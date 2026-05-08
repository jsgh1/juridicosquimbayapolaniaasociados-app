import React, { useMemo, useRef, useState } from 'react';
import { Animated, Modal, Pressable, SafeAreaView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { LogoMark, LanguageToggle, ThemeToggle, PrimaryButton } from '../components/ui';
import { MainScreen } from '../screens';

const menuItems = [
  { key: 'dashboard', labelKey: 'nav.dashboard', icon: 'home' },
  { key: 'clients', labelKey: 'nav.clients', icon: 'users' },
  { key: 'cases', labelKey: 'nav.cases', icon: 'briefcase' },
  { key: 'documents', labelKey: 'nav.documents', icon: 'file-text' },
  { key: 'activities', labelKey: 'nav.activities', icon: 'activity' },
  { key: 'calculator', labelKey: 'nav.calculator', icon: 'calculator' },
  { key: 'reports', labelKey: 'nav.reports', icon: 'bar-chart-2' },
  { key: 'admin', labelKey: 'nav.admin', icon: 'settings' }
];

export function MainShell() {
  const { colors, t, activeSection, setActiveSection, user, logout } = useApp();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const slide = useRef(new Animated.Value(-1)).current;
  const { width } = useWindowDimensions();

  const headerTitle = useMemo(() => t(`nav.${activeSection === 'dashboard' ? 'dashboard' : activeSection}`), [activeSection, t]);

  const openDrawer = () => {
    setDrawerOpen(true);
    Animated.timing(slide, { toValue: 1, duration: 220, useNativeDriver: true }).start();
  };

  const closeDrawer = () => {
    Animated.timing(slide, { toValue: -1, duration: 220, useNativeDriver: true }).start(() => setDrawerOpen(false));
  };

  const selectSection = (key) => {
    setActiveSection(key);
    closeDrawer();
  };

  const translateX = slide.interpolate({ inputRange: [-1, 1], outputRange: [-(Math.min(width * 0.82, 320)), 0] });

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={[styles.shell, { backgroundColor: colors.background }]}>
        <View style={[styles.topbar, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
          <View style={styles.topbarLeft}>
            <Pressable onPress={openDrawer} style={({ pressed }) => [styles.menuButton, { backgroundColor: colors.mutedSurface, borderColor: colors.border, opacity: pressed ? 0.86 : 1 }]}>
              <Feather name="menu" size={18} color={colors.text} />
            </Pressable>
            <View style={styles.leftStack}>
              <View style={styles.brandRow}>
                <LogoMark size={42} />
                <View>
                  <Text style={[styles.brandTitle, { color: colors.text }]}>JQPA</Text>
                  <Text style={[styles.brandSubtitle, { color: colors.mutedText }]}>{t('auth.brand.slogan')}</Text>
                </View>
              </View>
              <View style={styles.sectionBlock}>
                <Text style={[styles.topSectionTitle, { color: colors.text }]}>{headerTitle}</Text>
                <Text style={[styles.topSectionSubtitle, { color: colors.mutedText }]}>{t('topbar.subtitle')}</Text>
              </View>
            </View>
          </View>

          <View style={styles.topbarRight}>
            <ThemeToggle />
            <LanguageToggle />
            <View style={[styles.roleBadge, { backgroundColor: colors.primarySoft }]}>
              <Text style={[styles.roleText, { color: colors.primary }]}>{user.role}</Text>
            </View>
            <PrimaryButton title={t('actions.logout')} variant="ghost" onPress={logout} />
          </View>
        </View>

        <View style={styles.contentWrap}>
          <MainScreen />
        </View>
      </View>

      <Modal visible={drawerOpen} transparent animationType="none" onRequestClose={closeDrawer}>
        <Pressable style={[styles.overlay, { backgroundColor: colors.overlay }]} onPress={closeDrawer}>
          <Animated.View style={[styles.drawer, { backgroundColor: colors.surface, borderColor: colors.border, transform: [{ translateX }] }]} onStartShouldSetResponder={() => true}>
            <View style={styles.drawerHeader}>
              <LogoMark size={44} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.drawerTitle, { color: colors.text }]}>JQPA</Text>
                <Text style={[styles.drawerSubtitle, { color: colors.mutedText }]}>{t('topbar.subtitle')}</Text>
              </View>
            </View>

            <View style={styles.menuList}>
              {menuItems.map((item) => {
                const active = activeSection === item.key;
                return (
                  <Pressable key={item.key} onPress={() => selectSection(item.key)} style={({ pressed }) => [styles.menuItem, { backgroundColor: active ? colors.primarySoft : 'transparent', borderColor: active ? colors.primary : colors.border, opacity: pressed ? 0.92 : 1 }]}>
                    <Feather name={item.icon} size={18} color={active ? colors.primary : colors.mutedText} />
                    <Text style={[styles.menuText, { color: active ? colors.primary : colors.text }]}>{t(item.labelKey)}</Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.drawerFooter}>
              <View style={[styles.userCard, { backgroundColor: colors.mutedSurface }]}>
                <FontAwesome5 name="user-tie" size={16} color={colors.primary} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.userName, { color: colors.text }]}>{user.name}</Text>
                  <Text style={[styles.userEmail, { color: colors.mutedText }]}>{user.email}</Text>
                </View>
              </View>
              <View style={styles.drawerToggles}>
                <ThemeToggle />
                <LanguageToggle />
              </View>
            </View>
          </Animated.View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  shell: { flex: 1 },
  topbar: {
    borderBottomWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    flexWrap: 'wrap'
  },
  topbarLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flexShrink: 1 },
  topbarRight: { flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap', justifyContent: 'flex-end' },
  leftStack: { flexDirection: 'column', gap: 8, flexShrink: 1 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brandTitle: { fontSize: 18, fontWeight: '800' },
  brandSubtitle: { fontSize: 12, fontWeight: '600', marginTop: 2 },
  sectionBlock: { marginTop: 2 },
  topSectionTitle: { fontSize: 16, fontWeight: '800' },
  topSectionSubtitle: { fontSize: 12, fontWeight: '600', marginTop: 2 },
  menuButton: { width: 42, height: 42, borderWidth: 1, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  roleBadge: { paddingHorizontal: 12, paddingVertical: 9, borderRadius: 14 },
  roleText: { fontSize: 13, fontWeight: '800' },
  contentWrap: { flex: 1, paddingHorizontal: 14, paddingTop: 14 },
  overlay: { flex: 1, justifyContent: 'flex-start' },
  drawer: {
    width: '82%',
    maxWidth: 320,
    height: '100%',
    borderRightWidth: 1,
    padding: 16
  },
  drawerHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 18 },
  drawerTitle: { fontSize: 20, fontWeight: '800' },
  drawerSubtitle: { fontSize: 12, fontWeight: '600', marginTop: 2 },
  menuList: { flex: 1 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 8
  },
  menuText: { fontSize: 15, fontWeight: '700' },
  drawerFooter: { gap: 12, paddingTop: 10 },
  userCard: { borderRadius: 16, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 10 },
  userName: { fontSize: 14, fontWeight: '800' },
  userEmail: { fontSize: 12, fontWeight: '600', marginTop: 2 },
  drawerToggles: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' }
});
