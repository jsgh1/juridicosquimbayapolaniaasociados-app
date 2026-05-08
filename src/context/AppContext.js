import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getTheme } from '../theme';
import { translations } from '../translations';

const AppContext = createContext(null);

const STORAGE_KEYS = {
  theme: 'jqpa-theme',
  language: 'jqpa-language',
  auth: 'jqpa-auth'
};

const defaultUser = {
  name: 'Administrador',
  email: 'admin@jqpa.com',
  role: 'Administrador'
};

export function AppProvider({ children }) {
  const [ready, setReady] = useState(false);
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('es');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authView, setAuthView] = useState('login');
  const [activeSection, setActiveSection] = useState('dashboard');
  const [user, setUser] = useState(defaultUser);
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const entries = await AsyncStorage.multiGet([STORAGE_KEYS.theme, STORAGE_KEYS.language, STORAGE_KEYS.auth]);
        const saved = Object.fromEntries(entries);
        if (saved[STORAGE_KEYS.theme] === 'dark' || saved[STORAGE_KEYS.theme] === 'light') {
          setTheme(saved[STORAGE_KEYS.theme]);
        }
        if (saved[STORAGE_KEYS.language] === 'en' || saved[STORAGE_KEYS.language] === 'es') {
          setLanguage(saved[STORAGE_KEYS.language]);
        }
        if (saved[STORAGE_KEYS.auth] === '1') {
          setIsAuthenticated(true);
        }
      } finally {
        setReady(true);
      }
    };
    bootstrap();
  }, []);

  useEffect(() => {
    if (!ready) return;
    AsyncStorage.setItem(STORAGE_KEYS.theme, theme).catch(() => {});
  }, [ready, theme]);

  useEffect(() => {
    if (!ready) return;
    AsyncStorage.setItem(STORAGE_KEYS.language, language).catch(() => {});
  }, [ready, language]);

  const dismissToast = () => setToast(null);

  const showToast = (payload) => {
    const next = typeof payload === 'string' ? { title: payload, message: '' } : payload;
    setToast(next);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setToast(null);
    }, 2400);
  };

  const t = (key) => translations[language]?.[key] || translations.es[key] || key;

  const toggleTheme = () => setTheme((current) => (current === 'light' ? 'dark' : 'light'));
  const toggleLanguage = () => setLanguage((current) => (current === 'es' ? 'en' : 'es'));

  const login = ({ email }) => {
    setUser({ ...defaultUser, email: email.trim() || defaultUser.email });
    setIsAuthenticated(true);
    setAuthView('login');
    setActiveSection('dashboard');
    AsyncStorage.setItem(STORAGE_KEYS.auth, '1').catch(() => {});
    showToast({ title: t('toasts.welcomeTitle'), message: t('toasts.loginSuccess') });
  };

  const logout = async () => {
    setIsAuthenticated(false);
    setActiveSection('dashboard');
    setAuthView('login');
    await AsyncStorage.removeItem(STORAGE_KEYS.auth).catch(() => {});
    showToast({ title: t('toasts.logoutTitle'), message: t('toasts.logoutSuccess') });
  };

  const value = useMemo(
    () => ({
      ready,
      theme,
      colors: getTheme(theme),
      language,
      isAuthenticated,
      authView,
      activeSection,
      user,
      t,
      showToast,
      toggleTheme,
      toggleLanguage,
      setTheme,
      setLanguage,
      setAuthView,
      setActiveSection,
      login,
      logout,
      dismissToast,
      toast
    }),
    [
      ready,
      theme,
      language,
      isAuthenticated,
      authView,
      activeSection,
      user,
      toast
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used inside AppProvider');
  }
  return context;
};
