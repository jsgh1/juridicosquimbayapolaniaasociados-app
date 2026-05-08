import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';

const STORAGE = {
  theme: 'jqpa_theme',
  language: 'jqpa_language',
  auth: 'jqpa_auth',
};

const COLORS = {
  light: {
    background: '#f5f8ff',
    surface: '#ffffff',
    card: '#ffffff',
    mutedSurface: '#eef3ff',
    text: '#10203a',
    mutedText: '#60708f',
    border: '#d9e2f3',
    primary: '#1f5eff',
    primarySoft: 'rgba(31, 94, 255, 0.12)',
    success: '#11814b',
    warning: '#b66a00',
    danger: '#c0392b',
    shadow: 'rgba(15, 24, 42, 0.12)',
    overlay: 'rgba(15, 24, 42, 0.45)',
  },
  dark: {
    background: '#0c111b',
    surface: '#131a28',
    card: '#171f30',
    mutedSurface: '#1c2639',
    text: '#eef3ff',
    mutedText: '#9aaccc',
    border: '#2a3550',
    primary: '#6f8eff',
    primarySoft: 'rgba(111, 142, 255, 0.17)',
    success: '#39c67f',
    warning: '#efb84a',
    danger: '#f06a62',
    shadow: 'rgba(0, 0, 0, 0.35)',
    overlay: 'rgba(0, 0, 0, 0.6)',
  },
};

const STRINGS = {
  es: {
    appName: 'JQPA',
    slogan: 'Sistema Jurídicos Quimbaya Polonia Asociados',
    intro:
      'El proyecto Jurídicos Quimbaya y Polanias Asociados surge como una iniciativa de transformación digital enfocada en optimizar los procesos internos del bufete mediante el desarrollo de una plataforma web integral. El sistema busca centralizar las actividades jurídicas, automatizar los cálculos laborales conforme a la legislación colombiana y mejorar la trazabilidad de los procesos de atención a los clientes.',
    loginEyebrow: 'Acceso seguro',
    loginTitle: 'Iniciar sesión',
    loginDescription:
      'Ingresa al sistema de demostración del bufete. Esta autenticación es simulada para la presentación del frontend.',
    email: 'Correo electrónico',
    password: 'Contraseña',
    fullName: 'Nombre completo',
    confirmPassword: 'Confirmar contraseña',
    forgotPassword: 'Olvidé mi contraseña',
    createAccount: 'Crear cuenta',
    signIn: 'Entrar',
    backToLogin: 'Volver al inicio',
    sendLink: 'Enviar enlace',
    newUser: 'Nuevo usuario',
    recover: 'Recuperación',
    register: 'Registro',
    logout: 'Cerrar sesión',
    language: 'ES',
    light: 'Claro',
    dark: 'Oscuro',
    dashboard: 'Dashboard',
    dashboardSubtitle: 'Resumen ejecutivo de la firma',
    sectionSubtitle: 'Panel principal',
    clients: 'Clientes',
    cases: 'Casos',
    documents: 'Documentos',
    activities: 'Actividades',
    calculator: 'Calculadora',
    reports: 'Reportes',
    admin: 'Administración',
    roleLabel: 'Abogado',
    navSubtitle: 'Sistema Jurídicos Quimbaya Polonia Asociados',
    welcomeToast: 'Bienvenido a JQPA',
    loginToast: 'Inicio de sesión simulado correctamente.',
    logoutToast: 'Has salido del sistema.',
    savedToast: 'Guardado',
    genericToast: 'La acción se completó correctamente.',
    exportToast: 'Exportación simulada',
    exportDesc: 'Se simuló la descarga para esta entrega frontend.',
    loading: 'Cargando JQPA…',
    menu: 'Menú',
    clientsDesc:
      'Registro, búsqueda y consulta de clientes naturales o jurídicos con información asociada a casos y documentos.',
    casesDesc:
      'Creación, búsqueda y seguimiento visual de procesos jurídicos por cliente, área y estado.',
    documentsDesc:
      'Control de soportes, piezas procesales y archivos asociados a cada caso.',
    activitiesDesc:
      'Registro de actuaciones, tiempo invertido y clasificación entre actividades facturables y no facturables.',
    calculatorDesc:
      'Simulación frontend de liquidación laboral para demostrar cálculos, validaciones visuales y generación futura de reportes PDF.',
    reportsDesc:
      'Panel de reportes con filtros y simulación de exportación a PDF, Excel y Word.',
    adminDesc:
      'Gestión visual de usuarios, roles y permisos granulares conectados al backend en una fase posterior.',
    dashboardDesc:
      'Resumen ejecutivo de clientes, casos, audiencias, documentos y actividad jurídica del bufete.',
    activeClients: 'Clientes activos',
    openCases: 'Casos abiertos',
    documentsCount: 'Documentos',
    billableHours: 'Horas facturables',
    priorityCases: 'Casos prioritarios',
    hearings: 'Próximas audiencias y términos',
    casesOpenLabel: 'Abiertos',
    clientsLabel: 'Clientes',
    city: 'Ciudad',
    type: 'Tipo',
    updated: 'Actualizado',
    client: 'Cliente',
    court: 'Despacho',
    nextHearing: 'Próxima audiencia',
    progress: 'Avance',
    uploaded: 'Subido',
    status: 'Estado',
    rate: 'Tarifa hora',
    estimate: 'Estimado a facturar',
    registerActivity: 'Registrar actividad',
    activity: 'Actividad',
    case: 'Caso',
    date: 'Fecha',
    hours: 'Horas',
    billable: 'Facturable',
    salary: 'Salario mensual',
    transport: 'Auxilio transporte',
    days: 'Días trabajados',
    contractType: 'Tipo de contrato',
    result: 'Resultado estimado',
    note:
      'Nota: cálculo académico aproximado para exposición frontend. La versión final debe validar reglas legales con backend y constantes actualizadas.',
    filters: 'Filtros del reporte',
    module: 'Módulo',
    period: 'Periodo',
    format: 'Formato',
    totalDocuments: 'Total documentos',
    rolesDefined: 'Roles definidos',
    userMatrix: 'Matriz de usuarios',
    newClient: 'Nuevo cliente',
    newCase: 'Nuevo caso',
    viewDetails: 'Ver detalles',
    generateReport: 'Generar reporte',
    save: 'Guardar',
    cancel: 'Cancelar',
  },
  en: {
    appName: 'JQPA',
    slogan: 'Sistema Jurídicos Quimbaya Polonia Asociados',
    intro:
      'The Jurídicos Quimbaya y Polanias Asociados project emerged as a digital transformation initiative focused on optimizing the firm’s internal processes through the development of a comprehensive web platform. The system aims to centralize legal activities, automate labor calculations in accordance with Colombian legislation, and improve the traceability of client service processes.',
    loginEyebrow: 'Secure access',
    loginTitle: 'Sign in',
    loginDescription:
      'Enter the law firm demo dashboard. This authentication is simulated for the frontend presentation.',
    email: 'Email address',
    password: 'Password',
    fullName: 'Full name',
    confirmPassword: 'Confirm password',
    forgotPassword: 'Forgot my password',
    createAccount: 'Create account',
    signIn: 'Sign in',
    backToLogin: 'Back to login',
    sendLink: 'Send link',
    newUser: 'New user',
    recover: 'Recovery',
    register: 'Register',
    logout: 'Logout',
    language: 'EN',
    light: 'Light',
    dark: 'Dark',
    dashboard: 'Dashboard',
    dashboardSubtitle: 'Executive summary of the firm',
    sectionSubtitle: 'Main panel',
    clients: 'Clients',
    cases: 'Cases',
    documents: 'Documents',
    activities: 'Activities',
    calculator: 'Calculator',
    reports: 'Reports',
    admin: 'Administration',
    roleLabel: 'Lawyer',
    navSubtitle: 'Sistema Jurídicos Quimbaya Polonia Asociados',
    welcomeToast: 'Welcome to JQPA',
    loginToast: 'Simulated login completed successfully.',
    logoutToast: 'You have signed out.',
    savedToast: 'Saved',
    genericToast: 'The action completed successfully.',
    exportToast: 'Simulated export',
    exportDesc: 'The download was simulated for this frontend delivery.',
    loading: 'Loading JQPA…',
    menu: 'Menu',
    clientsDesc:
      'Registration, search, and consultation of natural or legal clients with data associated with cases and documents.',
    casesDesc:
      'Creation, search, and visual tracking of legal matters by client, area, and status.',
    documentsDesc:
      'Control of evidence, procedural documents, and files associated with each case.',
    activitiesDesc:
      'Recording of actions, invested time, and billing classification.',
    calculatorDesc:
      'Frontend simulation of labor settlement to demonstrate calculations, visual validations, and future PDF reports.',
    reportsDesc:
      'Executive reports dashboard with filters and simulated export to PDF, Excel, and Word.',
    adminDesc:
      'Visual management of users, roles, and granular permissions that will later connect to the backend.',
    dashboardDesc:
      'Executive summary of clients, cases, hearings, documents, and law firm activity.',
    activeClients: 'Active clients',
    openCases: 'Open cases',
    documentsCount: 'Documents',
    billableHours: 'Billable hours',
    priorityCases: 'Priority cases',
    hearings: 'Upcoming hearings and deadlines',
    casesOpenLabel: 'Open',
    clientsLabel: 'Clients',
    city: 'City',
    type: 'Type',
    updated: 'Updated',
    client: 'Client',
    court: 'Court',
    nextHearing: 'Next hearing',
    progress: 'Progress',
    uploaded: 'Uploaded',
    status: 'Status',
    rate: 'Hourly rate',
    estimate: 'Estimated billing',
    registerActivity: 'Register activity',
    activity: 'Activity',
    case: 'Case',
    date: 'Date',
    hours: 'Hours',
    billable: 'Billable',
    salary: 'Monthly salary',
    transport: 'Transport allowance',
    days: 'Worked days',
    contractType: 'Contract type',
    result: 'Estimated result',
    note:
      'Note: approximate academic calculation for frontend presentation. The final version should validate legal rules with backend and updated constants.',
    filters: 'Report filters',
    module: 'Module',
    period: 'Period',
    format: 'Format',
    totalDocuments: 'Total documents',
    rolesDefined: 'Defined roles',
    userMatrix: 'User matrix',
    newClient: 'New client',
    newCase: 'New case',
    viewDetails: 'View details',
    generateReport: 'Generate report',
    save: 'Save',
    cancel: 'Cancel',
  },
};

const MENU_ITEMS = [
  { key: 'dashboard', emoji: '🏠' },
  { key: 'clients', emoji: '👥' },
  { key: 'cases', emoji: '💼' },
  { key: 'documents', emoji: '📄' },
  { key: 'activities', emoji: '⏱️' },
  { key: 'calculator', emoji: '🧮' },
  { key: 'reports', emoji: '📊' },
  { key: 'admin', emoji: '⚙️' },
];

const CLIENTS = [
  { name: 'Comercializadora Quimbaya S.A.S.', type: 'Jurídico', city: 'Pereira', cases: 5, updated: 'Hace 1 h' },
  { name: 'María Fernanda Rojas', type: 'Natural', city: 'Armenia', cases: 2, updated: 'Hace 4 h' },
  { name: 'Polonia Constructores Ltda.', type: 'Jurídico', city: 'Manizales', cases: 3, updated: 'Ayer' },
  { name: 'Andrés Felipe Gómez', type: 'Natural', city: 'Cartago', cases: 1, updated: 'Hoy' },
];

const CASES = [
  { title: 'Proceso laboral 2025-014', client: 'Comercializadora Quimbaya S.A.S.', court: 'Juzgado 3 Laboral', hearing: '18/05/2026', progress: 72, area: 'Laboral' },
  { title: 'Cobro ejecutivo 2025-002', client: 'María Fernanda Rojas', court: 'Juzgado 1 Civil', hearing: '22/05/2026', progress: 45, area: 'Civil' },
  { title: 'Tutela por salud', client: 'Andrés Felipe Gómez', court: 'Tribunal Superior', hearing: '28/05/2026', progress: 88, area: 'Constitucional' },
];

const DOCUMENTS = [
  { name: 'Demanda inicial.pdf', status: 'Aprobado', uploaded: 'Hoy' },
  { name: 'Poder especial.docx', status: 'En revisión', uploaded: 'Ayer' },
  { name: 'Prueba documental.zip', status: 'Firmado', uploaded: 'Hace 2 días' },
];

const ACTIVITIES = [
  { activity: 'Revisión de expediente', case: 'Proceso laboral 2025-014', date: '15/05/2026', hours: 2.5, billable: true },
  { activity: 'Redacción memorial', case: 'Cobro ejecutivo 2025-002', date: '16/05/2026', hours: 1.5, billable: true },
  { activity: 'Llamada de seguimiento', case: 'Tutela por salud', date: '16/05/2026', hours: 0.5, billable: false },
];

const REPORTS = [
  { module: 'Clientes', period: 'Mensual', format: 'PDF' },
  { module: 'Casos', period: 'Trimestral', format: 'Excel' },
  { module: 'Actividades', period: 'Semanal', format: 'Word' },
];

const ADMINS = [
  { name: 'Laura Quimbaya', role: 'Abogada', status: 'Activo' },
  { name: 'Carlos Polonia', role: 'Abogado', status: 'Activo' },
  { name: 'Sofía Restrepo', role: 'Abogada', status: 'Pendiente' },
];

const DEFAULT_USER = {
  name: 'Abogada JQPA',
  email: 'demo@jqpa.com',
  role: 'Abogado',
};

const AppContext = createContext(null);

function AppProvider({ children }) {
  const [ready, setReady] = useState(false);
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('es');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authView, setAuthView] = useState('login');
  const [activeSection, setActiveSection] = useState('dashboard');
  const [user, setUser] = useState(DEFAULT_USER);
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const values = await AsyncStorage.multiGet([STORAGE.theme, STORAGE.language, STORAGE.auth]);
        const saved = Object.fromEntries(values);
        if (!mounted) return;
        if (saved[STORAGE.theme] === 'dark' || saved[STORAGE.theme] === 'light') setTheme(saved[STORAGE.theme]);
        if (saved[STORAGE.language] === 'es' || saved[STORAGE.language] === 'en') setLanguage(saved[STORAGE.language]);
        if (saved[STORAGE.auth] === '1') setIsAuthenticated(true);
      } finally {
        if (mounted) setReady(true);
      }
    })();
    return () => {
      mounted = false;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    AsyncStorage.setItem(STORAGE.theme, theme).catch(() => {});
  }, [ready, theme]);

  useEffect(() => {
    if (!ready) return;
    AsyncStorage.setItem(STORAGE.language, language).catch(() => {});
  }, [ready, language]);

  const t = (key) => STRINGS[language]?.[key] ?? STRINGS.es[key] ?? key;
  const colors = COLORS[theme];

  const showToast = (payload) => {
    const next = typeof payload === 'string' ? { title: payload, message: '' } : payload;
    setToast(next);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setToast(null), 2400);
  };

  const dismissToast = () => setToast(null);
  const toggleTheme = () => setTheme((current) => (current === 'light' ? 'dark' : 'light'));
  const toggleLanguage = () => setLanguage((current) => (current === 'es' ? 'en' : 'es'));
  const login = ({ email }) => {
    setUser({ ...DEFAULT_USER, email: email?.trim() || DEFAULT_USER.email });
    setIsAuthenticated(true);
    setAuthView('login');
    setActiveSection('dashboard');
    AsyncStorage.setItem(STORAGE.auth, '1').catch(() => {});
    showToast({ title: t('welcomeToast'), message: t('loginToast') });
  };
  const logout = async () => {
    setIsAuthenticated(false);
    setActiveSection('dashboard');
    setAuthView('login');
    await AsyncStorage.removeItem(STORAGE.auth).catch(() => {});
    showToast({ title: t('logoutToast'), message: '' });
  };
  const value = useMemo(() => ({
    ready,
    theme,
    language,
    colors,
    t,
    isAuthenticated,
    authView,
    activeSection,
    user,
    toast,
    showToast,
    dismissToast,
    toggleTheme,
    toggleLanguage,
    setAuthView,
    setActiveSection,
    login,
    logout,
  }), [ready, theme, language, isAuthenticated, authView, activeSection, user, toast]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used inside AppProvider');
  return context;
}

function Card({ children, style }) {
  const { colors } = useApp();
  return <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, shadowColor: colors.shadow }, style]}>{children}</View>;
}

function LogoMark({ size = 48 }) {
  const { colors } = useApp();
  return (
    <View style={[styles.logo, { width: size, height: size, backgroundColor: colors.primary }]}>
      <Text style={styles.logoText}>JQ</Text>
    </View>
  );
}

function Button({ title, onPress, variant = 'primary', fullWidth = false, style, disabled = false }) {
  const { colors } = useApp();
  const backgroundColor = variant === 'ghost' ? 'transparent' : variant === 'secondary' ? colors.mutedSurface : colors.primary;
  const textColor = variant === 'ghost' ? colors.text : variant === 'secondary' ? colors.text : '#fff';
  const borderColor = variant === 'ghost' ? colors.border : backgroundColor;
  return (
    <Pressable onPress={onPress} disabled={disabled} style={({ pressed }) => [styles.button, { backgroundColor, borderColor, opacity: disabled ? 0.6 : pressed ? 0.88 : 1 }, fullWidth && styles.fullWidth, style]}>
      <Text style={[styles.buttonText, { color: textColor }]}>{title}</Text>
    </Pressable>
  );
}

function ToggleButton() {
  const { theme, toggleTheme, t, colors } = useApp();
  const isDark = theme === 'dark';
  return (
    <Pressable onPress={toggleTheme} style={({ pressed }) => [styles.toggle, { backgroundColor: colors.mutedSurface, borderColor: colors.border, opacity: pressed ? 0.88 : 1 }]}>
      <Text style={{ fontSize: 15 }}>{isDark ? '🌙' : '☀️'}</Text>
      <Text style={[styles.toggleText, { color: colors.text }]}>{isDark ? t('dark') : t('light')}</Text>
    </Pressable>
  );
}

function LanguageButton() {
  const { language, toggleLanguage, colors } = useApp();
  return (
    <Pressable onPress={toggleLanguage} style={({ pressed }) => [styles.toggle, { backgroundColor: colors.mutedSurface, borderColor: colors.border, opacity: pressed ? 0.88 : 1 }]}>
      <Text style={{ fontSize: 15 }}>🌐</Text>
      <Text style={[styles.toggleText, { color: colors.text }]}>{language === 'es' ? 'ES' : 'EN'}</Text>
    </Pressable>
  );
}

function Field({ label, value, onChangeText, placeholder, secureTextEntry = false, keyboardType = 'default', multiline = false, numberOfLines = 4, editable = true, error }) {
  const { colors } = useApp();
  return (
    <View style={{ marginBottom: 12 }}>
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
          {
            backgroundColor: colors.surface,
            color: colors.text,
            borderColor: error ? colors.danger : colors.border,
            minHeight: multiline ? 100 : 50,
            textAlignVertical: multiline ? 'top' : 'center',
          },
        ]}
      />
      {error ? <Text style={[styles.error, { color: colors.danger }]}>{error}</Text> : null}
    </View>
  );
}

function StatCard({ label, value, note, emoji }) {
  const { colors } = useApp();
  return (
    <Card style={{ flex: 1, minWidth: 150 }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.statLabel, { color: colors.mutedText }]}>{label}</Text>
          <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
          {note ? <Text style={[styles.statNote, { color: colors.success }]}>{note}</Text> : null}
        </View>
        <View style={[styles.statIcon, { backgroundColor: colors.primarySoft }]}>
          <Text style={{ fontSize: 21 }}>{emoji}</Text>
        </View>
      </View>
    </Card>
  );
}

function Pill({ children, variant = 'neutral' }) {
  const { colors } = useApp();
  const background = variant === 'success' ? 'rgba(16, 129, 75, 0.15)' : variant === 'warning' ? 'rgba(182, 106, 0, 0.15)' : variant === 'danger' ? 'rgba(192, 57, 43, 0.15)' : colors.mutedSurface;
  const color = variant === 'success' ? colors.success : variant === 'warning' ? colors.warning : variant === 'danger' ? colors.danger : colors.text;
  return <View style={[styles.pill, { backgroundColor: background }]}><Text style={[styles.pillText, { color }]}>{children}</Text></View>;
}

function ProgressBar({ value }) {
  const { colors } = useApp();
  const safe = Math.max(0, Math.min(100, Number(value || 0)));
  return (
    <View style={[styles.progressTrack, { backgroundColor: colors.mutedSurface }]}>
      <View style={[styles.progressFill, { width: `${safe}%`, backgroundColor: colors.primary }]} />
    </View>
  );
}

function SectionCard({ title, subtitle, children, action }) {
  const { colors } = useApp();
  return (
    <Card style={{ marginBottom: 14 }}>
      <View style={styles.sectionHead}>
        <View style={{ flex: 1 }}>
          {subtitle ? <Text style={[styles.sectionSubtitle, { color: colors.primary }]}>{subtitle.toUpperCase()}</Text> : null}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
        </View>
        {action ? <View>{action}</View> : null}
      </View>
      {children}
    </Card>
  );
}

function LoadingScreen() {
  const { colors, t } = useApp();
  return (
    <View style={[styles.loadingWrap, { backgroundColor: colors.background }]}>
      <Text style={[styles.loadingMark, { color: colors.primary }]}>JQPA</Text>
      <Text style={[styles.loadingText, { color: colors.mutedText }]}>{t('loading')}</Text>
    </View>
  );
}

function ToastBanner() {
  const { colors, toast, dismissToast } = useApp();
  if (!toast) return null;
  return (
    <Pressable onPress={dismissToast} style={[styles.toast, { backgroundColor: colors.surface, borderColor: colors.border, shadowColor: colors.shadow }]}>
      <View style={[styles.toastBar, { backgroundColor: colors.primary }]} />
      <View style={{ flex: 1 }}>
        <Text style={[styles.toastTitle, { color: colors.text }]}>{toast.title}</Text>
        {toast.message ? <Text style={[styles.toastMessage, { color: colors.mutedText }]}>{toast.message}</Text> : null}
      </View>
    </Pressable>
  );
}

function LoginScreen() {
  const { colors, t, setAuthView, login } = useApp();
  const [email, setEmail] = useState('demo@jqpa.com');
  const [password, setPassword] = useState('123456');
  const handleLogin = () => {
    if (!email.includes('@')) {
      Alert.alert('JQPA', 'Ingresa un correo válido.');
      return;
    }
    login({ email, password });
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.authScroll} keyboardShouldPersistTaps="handled">
        <View style={styles.brandBlock}>
          <LogoMark size={60} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.brandTitle, { color: colors.text }]}>{t('appName')}</Text>
            <Text style={[styles.brandSlogan, { color: colors.mutedText }]}>{t('slogan')}</Text>
          </View>
        </View>

        <Card style={styles.heroCard}>
          <Text style={[styles.heroEyebrow, { color: colors.primary }]}>{t('loginEyebrow').toUpperCase()}</Text>
          <Text style={[styles.heroTitle, { color: colors.text }]}>{t('slogan')}</Text>
          <Text style={[styles.heroText, { color: colors.mutedText }]}>{t('intro')}</Text>
        </Card>

        <Card>
          <View style={styles.topRow}>
            <Text style={[styles.formTitle, { color: colors.text }]}>{t('loginTitle')}</Text>
            <View style={styles.toggleRow}>
              <ToggleButton />
              <LanguageButton />
            </View>
          </View>
          <Text style={[styles.formSubtitle, { color: colors.mutedText }]}>{t('loginDescription')}</Text>
          <Field label={t('email')} value={email} onChangeText={setEmail} placeholder="demo@jqpa.com" keyboardType="email-address" />
          <Field label={t('password')} value={password} onChangeText={setPassword} placeholder="••••••••" secureTextEntry />
          <Button title={t('signIn')} onPress={handleLogin} fullWidth />
          <View style={styles.authLinks}>
            <Button title={t('createAccount')} onPress={() => setAuthView('register')} variant="secondary" style={{ flex: 1 }} />
            <Button title={t('forgotPassword')} onPress={() => setAuthView('recover')} variant="ghost" style={{ flex: 1 }} />
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

function RegisterScreen() {
  const { colors, t, setAuthView, showToast } = useApp();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const submit = () => {
    if (!form.name || !form.email || !form.password || form.password !== form.confirm) {
      Alert.alert('JQPA', 'Completa todos los campos y verifica las contraseñas.');
      return;
    }
    showToast({ title: t('savedToast'), message: t('genericToast') });
    setAuthView('login');
  };
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.authScroll} keyboardShouldPersistTaps="handled">
        <Card>
          <Text style={[styles.heroEyebrow, { color: colors.primary }]}>{t('newUser').toUpperCase()}</Text>
          <Text style={[styles.formTitle, { color: colors.text }]}>{t('register')}</Text>
          <Text style={[styles.formSubtitle, { color: colors.mutedText }]}>{t('loginDescription')}</Text>
          <Field label={t('fullName')} value={form.name} onChangeText={(v) => setForm((s) => ({ ...s, name: v }))} placeholder="Nombre completo" />
          <Field label={t('email')} value={form.email} onChangeText={(v) => setForm((s) => ({ ...s, email: v }))} placeholder="demo@jqpa.com" keyboardType="email-address" />
          <Field label={t('password')} value={form.password} onChangeText={(v) => setForm((s) => ({ ...s, password: v }))} placeholder="••••••••" secureTextEntry />
          <Field label={t('confirmPassword')} value={form.confirm} onChangeText={(v) => setForm((s) => ({ ...s, confirm: v }))} placeholder="••••••••" secureTextEntry />
          <Button title={t('createAccount')} onPress={submit} fullWidth />
          <Button title={t('backToLogin')} onPress={() => setAuthView('login')} variant="ghost" fullWidth style={{ marginTop: 8 }} />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

function RecoverScreen() {
  const { colors, t, setAuthView, showToast } = useApp();
  const [email, setEmail] = useState('');
  const submit = () => {
    if (!email.includes('@')) {
      Alert.alert('JQPA', 'Ingresa un correo válido.');
      return;
    }
    showToast({ title: t('savedToast'), message: t('genericToast') });
    setAuthView('login');
  };
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.authScroll} keyboardShouldPersistTaps="handled">
        <Card>
          <Text style={[styles.heroEyebrow, { color: colors.primary }]}>{t('recover').toUpperCase()}</Text>
          <Text style={[styles.formTitle, { color: colors.text }]}>{t('forgotPassword')}</Text>
          <Text style={[styles.formSubtitle, { color: colors.mutedText }]}>{t('loginDescription')}</Text>
          <Field label={t('email')} value={email} onChangeText={setEmail} placeholder="demo@jqpa.com" keyboardType="email-address" />
          <Button title={t('sendLink')} onPress={submit} fullWidth />
          <Button title={t('backToLogin')} onPress={() => setAuthView('login')} variant="ghost" fullWidth style={{ marginTop: 8 }} />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

function Drawer({ open, onClose }) {
  const { colors, t, activeSection, setActiveSection, user, theme, language } = useApp();
  const width = useWindowDimensions().width;
  if (!open) return null;
  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={[styles.overlay, { backgroundColor: colors.overlay }]} onPress={onClose}>
        <Pressable onPress={() => {}} style={[styles.drawer, { backgroundColor: colors.surface, borderColor: colors.border, width: Math.min(width * 0.84, 330) }]}>
          <View style={styles.drawerHeader}>
            <LogoMark size={46} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.drawerTitle, { color: colors.text }]}>{t('appName')}</Text>
              <Text style={[styles.drawerSubtitle, { color: colors.mutedText }]}>{t('navSubtitle')}</Text>
            </View>
            <Pressable onPress={onClose} style={[styles.closeBtn, { backgroundColor: colors.mutedSurface, borderColor: colors.border }]}>
              <Text style={{ color: colors.text, fontSize: 18 }}>✕</Text>
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 12 }}>
            {MENU_ITEMS.map((item) => {
              const active = activeSection === item.key;
              return (
                <Pressable key={item.key} onPress={() => { setActiveSection(item.key); onClose(); }} style={({ pressed }) => [styles.menuItem, { backgroundColor: active ? colors.primarySoft : 'transparent', borderColor: active ? colors.primary : colors.border, opacity: pressed ? 0.92 : 1 }]}>
                  <Text style={{ fontSize: 18 }}>{item.emoji}</Text>
                  <Text style={[styles.menuText, { color: active ? colors.primary : colors.text }]}>{t(item.key)}</Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={styles.drawerFooter}>
            <Card style={{ marginBottom: 0 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Text style={{ fontSize: 20 }}>👤</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.userName, { color: colors.text }]}>{user.name}</Text>
                  <Text style={[styles.userEmail, { color: colors.mutedText }]}>{user.email}</Text>
                </View>
              </View>
            </Card>
            <View style={styles.drawerToggleRow}>
              <ToggleButton />
              <LanguageButton />
            </View>
            <Text style={[styles.drawerMeta, { color: colors.mutedText }]}>{theme.toUpperCase()} · {language.toUpperCase()}</Text>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function TopBar({ onMenu }) {
  const { colors, t, activeSection, user, logout } = useApp();
  return (
    <View style={[styles.topbar, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
      <View style={styles.topbarLeft}>
        <Pressable onPress={onMenu} style={({ pressed }) => [styles.menuBtn, { backgroundColor: colors.mutedSurface, borderColor: colors.border, opacity: pressed ? 0.86 : 1 }]}>
          <Text style={{ fontSize: 18, color: colors.text }}>☰</Text>
        </Pressable>
        <View style={styles.topbarBrand}>
          <LogoMark size={42} />
          <View>
            <Text style={[styles.topbarTitle, { color: colors.text }]}>{t('appName')}</Text>
            <Text style={[styles.topbarSubtitle, { color: colors.mutedText }]}>{t('slogan')}</Text>
          </View>
        </View>
      </View>
      <View style={styles.topbarRight}>
        <View>
          <Text style={[styles.activeTitle, { color: colors.text }]}>{t(activeSection)}</Text>
          <Text style={[styles.topbarSubtitle, { color: colors.mutedText }]}>{t('sectionSubtitle')}</Text>
        </View>
        <View style={styles.topbarActions}>
          <ToggleButton />
          <LanguageButton />
        </View>
        <View style={[styles.roleBadge, { backgroundColor: colors.primarySoft }]}>
          <Text style={[styles.roleText, { color: colors.primary }]}>{user.role}</Text>
        </View>
        <Button title={t('logout')} onPress={logout} variant="ghost" />
      </View>
    </View>
  );
}

function DashboardScreen() {
  const { colors, t } = useApp();
  return (
    <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
      <Text style={[styles.pageEyebrow, { color: colors.primary }]}>{t('sectionSubtitle').toUpperCase()}</Text>
      <Text style={[styles.pageTitle, { color: colors.text }]}>{t('dashboard')}</Text>
      <Text style={[styles.pageDescription, { color: colors.mutedText }]}>{t('dashboardDesc')}</Text>

      <View style={styles.grid}>
        <StatCard label={t('activeClients')} value="128" note="+12%" emoji="👥" />
        <StatCard label={t('openCases')} value="42" note="+4" emoji="💼" />
        <StatCard label={t('documentsCount')} value="316" note="+18" emoji="📄" />
        <StatCard label={t('billableHours')} value="86 h" note="+7 h" emoji="⏱️" />
      </View>

      <SectionCard title={t('priorityCases')} subtitle={t('dashboard')}>
        {CASES.slice(0, 2).map((item) => (
          <View key={item.title} style={styles.listRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.rowTitle, { color: colors.text }]}>{item.title}</Text>
              <Text style={[styles.rowText, { color: colors.mutedText }]}>{item.client}</Text>
            </View>
            <Pill variant={item.progress > 70 ? 'success' : item.progress > 45 ? 'warning' : 'neutral'}>{item.progress}%</Pill>
          </View>
        ))}
      </SectionCard>

      <SectionCard title={t('hearings')} subtitle={t('dashboard')}>
        {CASES.map((item) => (
          <View key={item.title} style={styles.listRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.rowTitle, { color: colors.text }]}>{item.title}</Text>
              <Text style={[styles.rowText, { color: colors.mutedText }]}>{item.court} · {item.hearing}</Text>
            </View>
            <Pill>{item.area}</Pill>
          </View>
        ))}
      </SectionCard>
    </ScrollView>
  );
}

function ClientsScreen() {
  const { colors, t } = useApp();
  return (
    <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
      <Text style={[styles.pageEyebrow, { color: colors.primary }]}>{t('clients').toUpperCase()}</Text>
      <Text style={[styles.pageTitle, { color: colors.text }]}>{t('clients')}</Text>
      <Text style={[styles.pageDescription, { color: colors.mutedText }]}>{t('clientsDesc')}</Text>
      {CLIENTS.map((item) => (
        <SectionCard key={item.name} title={item.name} subtitle={item.type}>
          <View style={styles.infoGrid}>
            <Info label={t('city')} value={item.city} />
            <Info label={t('type')} value={item.type} />
            <Info label={t('casesOpenLabel')} value={String(item.cases)} />
            <Info label={t('updated')} value={item.updated} />
          </View>
        </SectionCard>
      ))}
    </ScrollView>
  );
}

function CasesScreen() {
  const { colors, t } = useApp();
  return (
    <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
      <Text style={[styles.pageEyebrow, { color: colors.primary }]}>{t('cases').toUpperCase()}</Text>
      <Text style={[styles.pageTitle, { color: colors.text }]}>{t('cases')}</Text>
      <Text style={[styles.pageDescription, { color: colors.mutedText }]}>{t('casesDesc')}</Text>
      {CASES.map((item) => (
        <SectionCard key={item.title} title={item.title} subtitle={item.area}>
          <Text style={[styles.rowText, { color: colors.mutedText }]}>{t('client')}: {item.client}</Text>
          <Text style={[styles.rowText, { color: colors.mutedText, marginTop: 4 }]}>{t('court')}: {item.court}</Text>
          <Text style={[styles.rowText, { color: colors.mutedText, marginTop: 4 }]}>{t('nextHearing')}: {item.hearing}</Text>
          <View style={{ marginTop: 10 }}>
            <ProgressBar value={item.progress} />
            <Text style={[styles.progressLabel, { color: colors.mutedText }]}>{t('progress')}: {item.progress}%</Text>
          </View>
        </SectionCard>
      ))}
    </ScrollView>
  );
}

function DocumentsScreen() {
  const { colors, t } = useApp();
  return (
    <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
      <Text style={[styles.pageEyebrow, { color: colors.primary }]}>{t('documents').toUpperCase()}</Text>
      <Text style={[styles.pageTitle, { color: colors.text }]}>{t('documents')}</Text>
      <Text style={[styles.pageDescription, { color: colors.mutedText }]}>{t('documentsDesc')}</Text>
      {DOCUMENTS.map((item) => (
        <SectionCard key={item.name} title={item.name} subtitle={t('uploaded')}>
          <View style={styles.listRow}>
            <Text style={[styles.rowText, { color: colors.mutedText }]}>{t('status')}: {item.status}</Text>
            <Pill variant={item.status === 'Firmado' ? 'success' : item.status === 'En revisión' ? 'warning' : 'neutral'}>{item.uploaded}</Pill>
          </View>
        </SectionCard>
      ))}
    </ScrollView>
  );
}

function ActivitiesScreen() {
  const { colors, t } = useApp();
  return (
    <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
      <Text style={[styles.pageEyebrow, { color: colors.primary }]}>{t('activities').toUpperCase()}</Text>
      <Text style={[styles.pageTitle, { color: colors.text }]}>{t('activities')}</Text>
      <Text style={[styles.pageDescription, { color: colors.mutedText }]}>{t('activitiesDesc')}</Text>
      <SectionCard title={t('billableHours')} subtitle={t('activities')} action={<Button title={t('registerActivity')} onPress={() => {}} /> }>
        {ACTIVITIES.map((item) => (
          <View key={`${item.activity}-${item.date}`} style={styles.listRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.rowTitle, { color: colors.text }]}>{item.activity}</Text>
              <Text style={[styles.rowText, { color: colors.mutedText }]}>{item.case}</Text>
              <Text style={[styles.rowText, { color: colors.mutedText, marginTop: 2 }]}>{item.date} · {item.hours} h</Text>
            </View>
            <Pill variant={item.billable ? 'success' : 'warning'}>{item.billable ? t('billable') : 'No'}</Pill>
          </View>
        ))}
      </SectionCard>
    </ScrollView>
  );
}

function CalculatorScreen() {
  const { colors, t } = useApp();
  const [salary, setSalary] = useState('1800000');
  const [transport, setTransport] = useState('162000');
  const [days, setDays] = useState('30');
  const [type, setType] = useState('Indefinido');
  const salaryNum = Number(String(salary).replace(/\./g, '').replace(/,/g, '')) || 0;
  const transportNum = Number(String(transport).replace(/\./g, '').replace(/,/g, '')) || 0;
  const daysNum = Number(days) || 0;
  const result = Math.round(((salaryNum + transportNum) / 30) * daysNum);
  return (
    <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
      <Text style={[styles.pageEyebrow, { color: colors.primary }]}>{t('calculator').toUpperCase()}</Text>
      <Text style={[styles.pageTitle, { color: colors.text }]}>{t('calculator')}</Text>
      <Text style={[styles.pageDescription, { color: colors.mutedText }]}>{t('calculatorDesc')}</Text>
      <SectionCard title={t('result')} subtitle={t('calculator')}>
        <Field label={t('salary')} value={salary} onChangeText={setSalary} keyboardType="numeric" />
        <Field label={t('transport')} value={transport} onChangeText={setTransport} keyboardType="numeric" />
        <Field label={t('days')} value={days} onChangeText={setDays} keyboardType="numeric" />
        <Text style={[styles.label, { color: colors.text }]}>{t('contractType')}</Text>
        <View style={styles.filterRow}>
          {['Indefinido', 'Término fijo', 'Prestación'].map((option) => (
            <Pressable key={option} onPress={() => setType(option)} style={({ pressed }) => [styles.chip, { backgroundColor: type === option ? colors.primarySoft : colors.mutedSurface, borderColor: type === option ? colors.primary : colors.border, opacity: pressed ? 0.92 : 1 }]}>
              <Text style={{ color: type === option ? colors.primary : colors.text, fontWeight: '700' }}>{option}</Text>
            </Pressable>
          ))}
        </View>
        <Text style={[styles.bigMoney, { color: colors.text }]}>${result.toLocaleString('es-CO')}</Text>
        <Text style={[styles.rowText, { color: colors.mutedText, marginTop: 6 }]}>{t('note')}</Text>
      </SectionCard>
    </ScrollView>
  );
}

function ReportsScreen() {
  const { colors, t, showToast } = useApp();
  const exportReport = () => showToast({ title: t('exportToast'), message: t('exportDesc') });
  return (
    <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
      <Text style={[styles.pageEyebrow, { color: colors.primary }]}>{t('reports').toUpperCase()}</Text>
      <Text style={[styles.pageTitle, { color: colors.text }]}>{t('reports')}</Text>
      <Text style={[styles.pageDescription, { color: colors.mutedText }]}>{t('reportsDesc')}</Text>
      <SectionCard title={t('filters')} subtitle={t('reports')} action={<Button title={t('generateReport')} onPress={exportReport} />}>
        <View style={styles.infoGrid}>
          <Info label={t('module')} value="Clientes" />
          <Info label={t('period')} value="Mensual" />
          <Info label={t('format')} value="PDF" />
          <Info label={t('totalDocuments')} value="316" />
        </View>
      </SectionCard>
      {REPORTS.map((item) => (
        <SectionCard key={item.module} title={item.module} subtitle={item.format}>
          <Text style={[styles.rowText, { color: colors.mutedText }]}>{t('period')}: {item.period}</Text>
          <View style={{ flexDirection: 'row', gap: 10, flexWrap: 'wrap', marginTop: 12 }}>
            <Button title="PDF" onPress={exportReport} variant="secondary" />
            <Button title="Excel" onPress={exportReport} variant="secondary" />
            <Button title="Word" onPress={exportReport} variant="secondary" />
          </View>
        </SectionCard>
      ))}
    </ScrollView>
  );
}

function AdminScreen() {
  const { colors, t } = useApp();
  return (
    <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
      <Text style={[styles.pageEyebrow, { color: colors.primary }]}>{t('admin').toUpperCase()}</Text>
      <Text style={[styles.pageTitle, { color: colors.text }]}>{t('admin')}</Text>
      <Text style={[styles.pageDescription, { color: colors.mutedText }]}>{t('adminDesc')}</Text>
      <SectionCard title={t('rolesDefined')} subtitle={t('admin')}>
        <View style={styles.roleList}>
          {['Abogado', 'Coordinador', 'Paralegal'].map((role) => (
            <Pill key={role}>{role}</Pill>
          ))}
        </View>
      </SectionCard>
      <SectionCard title={t('userMatrix')} subtitle={t('admin')} action={<Button title="+" onPress={() => {}} /> }>
        {ADMINS.map((item) => (
          <View key={item.name} style={styles.listRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.rowTitle, { color: colors.text }]}>{item.name}</Text>
              <Text style={[styles.rowText, { color: colors.mutedText }]}>{item.role}</Text>
            </View>
            <Pill variant={item.status === 'Activo' ? 'success' : 'warning'}>{item.status}</Pill>
          </View>
        ))}
      </SectionCard>
    </ScrollView>
  );
}

function Info({ label, value }) {
  const { colors } = useApp();
  return (
    <View style={styles.infoBox}>
      <Text style={[styles.infoLabel, { color: colors.mutedText }]}>{label}</Text>
      <Text style={[styles.infoValue, { color: colors.text }]} numberOfLines={2}>{value}</Text>
    </View>
  );
}

function MainShell() {
  const { colors, activeSection } = useApp();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const content = useMemo(() => {
    switch (activeSection) {
      case 'clients': return <ClientsScreen />;
      case 'cases': return <CasesScreen />;
      case 'documents': return <DocumentsScreen />;
      case 'activities': return <ActivitiesScreen />;
      case 'calculator': return <CalculatorScreen />;
      case 'reports': return <ReportsScreen />;
      case 'admin': return <AdminScreen />;
      case 'dashboard':
      default: return <DashboardScreen />;
    }
  }, [activeSection]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <TopBar onMenu={() => setDrawerOpen(true)} />
        <View style={{ flex: 1 }}>{content}</View>
        <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
        <ToastBanner />
      </View>
    </SafeAreaView>
  );
}

function Root() {
  const { ready, isAuthenticated, authView, theme, colors } = useApp();
  if (!ready) return <LoadingScreen />;
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      {isAuthenticated ? (
        <MainShell />
      ) : authView === 'register' ? (
        <RegisterScreen />
      ) : authView === 'recover' ? (
        <RecoverScreen />
      ) : (
        <LoginScreen />
      )}
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <Root />
      </AppProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  authScroll: { padding: 16, paddingBottom: 28, gap: 14 },
  brandBlock: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 6 },
  brandTitle: { fontSize: 24, fontWeight: '900', letterSpacing: 0.3 },
  brandSlogan: { fontSize: 13, fontWeight: '700', marginTop: 3, lineHeight: 19 },
  heroCard: { paddingVertical: 18 },
  heroEyebrow: { fontSize: 12, fontWeight: '900', letterSpacing: 1 },
  heroTitle: { fontSize: 22, fontWeight: '900', marginTop: 8, lineHeight: 28 },
  heroText: { fontSize: 14, lineHeight: 22, marginTop: 10, fontWeight: '500' },
  formTitle: { fontSize: 22, fontWeight: '900' },
  formSubtitle: { fontSize: 13, lineHeight: 20, marginTop: 6, marginBottom: 14, fontWeight: '500' },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, alignItems: 'center', marginBottom: 8 },
  toggleRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' },
  toggle: { flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderRadius: 14, paddingHorizontal: 12, paddingVertical: 9 },
  toggleText: { fontSize: 12, fontWeight: '800' },
  label: { fontSize: 13, fontWeight: '800', marginBottom: 6 },
  input: { borderWidth: 1, borderRadius: 16, paddingHorizontal: 14, paddingVertical: 13, fontSize: 15, fontWeight: '500' },
  error: { marginTop: 5, fontSize: 12, fontWeight: '700' },
  authLinks: { flexDirection: 'row', gap: 10, marginTop: 10, flexWrap: 'wrap' },
  card: { borderWidth: 1, borderRadius: 24, padding: 16, shadowOpacity: 0.08, shadowRadius: 18, shadowOffset: { width: 0, height: 8 }, elevation: 1 },
  button: { borderWidth: 1, borderRadius: 16, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  buttonText: { fontSize: 14, fontWeight: '900' },
  fullWidth: { width: '100%' },
  logo: { borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  logoText: { color: '#fff', fontSize: 19, fontWeight: '900', letterSpacing: 0.5 },
  topbar: { borderBottomWidth: 1, paddingHorizontal: 14, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' },
  topbarLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flexShrink: 1 },
  topbarRight: { flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap', justifyContent: 'flex-end', flexShrink: 1 },
  topbarBrand: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  topbarTitle: { fontSize: 18, fontWeight: '900' },
  topbarSubtitle: { fontSize: 12, fontWeight: '600', marginTop: 2, maxWidth: 230 },
  activeTitle: { fontSize: 16, fontWeight: '900' },
  topbarActions: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  menuBtn: { width: 42, height: 42, borderWidth: 1, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  roleBadge: { paddingHorizontal: 12, paddingVertical: 9, borderRadius: 14 },
  roleText: { fontSize: 13, fontWeight: '900' },
  page: { padding: 16, paddingBottom: 32 },
  pageEyebrow: { fontSize: 12, fontWeight: '900', letterSpacing: 1 },
  pageTitle: { fontSize: 24, fontWeight: '900', marginTop: 6 },
  pageDescription: { fontSize: 14, lineHeight: 22, marginTop: 8, marginBottom: 14, fontWeight: '500' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 4 },
  sectionHead: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 10 },
  sectionSubtitle: { fontSize: 11, fontWeight: '900', letterSpacing: 0.7 },
  sectionTitle: { fontSize: 18, fontWeight: '900', marginTop: 4 },
  listRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 12 },
  rowTitle: { fontSize: 15, fontWeight: '900' },
  rowText: { fontSize: 13, lineHeight: 20, fontWeight: '500' },
  progressLabel: { fontSize: 12, fontWeight: '700', marginTop: 8 },
  progressTrack: { height: 10, borderRadius: 999, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 999 },
  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  infoBox: { width: '48%', minWidth: 140, padding: 12, borderRadius: 16, backgroundColor: 'rgba(127, 142, 178, 0.08)' },
  infoLabel: { fontSize: 11, fontWeight: '900', letterSpacing: 0.4, textTransform: 'uppercase' },
  infoValue: { fontSize: 14, marginTop: 6, fontWeight: '800' },
  statLabel: { fontSize: 12, fontWeight: '800' },
  statValue: { fontSize: 28, fontWeight: '900', marginTop: 4 },
  statNote: { fontSize: 12, marginTop: 4, fontWeight: '800' },
  statIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  pill: { paddingHorizontal: 11, paddingVertical: 7, borderRadius: 999 },
  pillText: { fontSize: 12, fontWeight: '900' },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 8, marginBottom: 12 },
  chip: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8 },
  bigMoney: { fontSize: 30, lineHeight: 34, fontWeight: '900', marginTop: 12 },
  roleList: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  loadingMark: { fontSize: 48, fontWeight: '900', letterSpacing: 1.2 },
  loadingText: { fontSize: 14, fontWeight: '700', marginTop: 10 },
  toast: { position: 'absolute', left: 16, right: 16, bottom: 16, borderWidth: 1, borderRadius: 18, padding: 14, flexDirection: 'row', alignItems: 'stretch', gap: 12, shadowOpacity: 0.14, shadowRadius: 20, shadowOffset: { width: 0, height: 10 }, elevation: 4 },
  toastBar: { width: 5, borderRadius: 999 },
  toastTitle: { fontSize: 14, fontWeight: '900' },
  toastMessage: { fontSize: 12, lineHeight: 18, marginTop: 3, fontWeight: '500' },
  overlay: { flex: 1, justifyContent: 'flex-start' },
  drawer: { height: '100%', borderRightWidth: 1, padding: 16 },
  drawerHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  drawerTitle: { fontSize: 20, fontWeight: '900' },
  drawerSubtitle: { fontSize: 12, fontWeight: '600', marginTop: 2 },
  closeBtn: { width: 38, height: 38, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12, paddingHorizontal: 12, borderRadius: 14, borderWidth: 1, marginBottom: 8 },
  menuText: { fontSize: 15, fontWeight: '800' },
  drawerFooter: { gap: 12, paddingTop: 12 },
  drawerToggleRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  drawerMeta: { fontSize: 12, fontWeight: '700', textAlign: 'center' },
  userName: { fontSize: 14, fontWeight: '900' },
  userEmail: { fontSize: 12, fontWeight: '600', marginTop: 2 },
});
