import React, { useMemo, useState } from 'react';
import { Alert, FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { useApp } from './context/AppContext';
import { activities, cases, clients, documents, legalConstants, users } from './mockData';
import { clamp, formatCurrency, formatDate, normalizeText } from './utils';
import { Card, Chip, LogoMark, Pill, PrimaryButton, ProgressBar, ScreenHeader, SectionCard, StatCard, TextField } from './components/ui';

function authCardStyles(colors) {
  return StyleSheet.create({
    wrap: {
      flex: 1,
      justifyContent: 'center',
      padding: 18,
      backgroundColor: colors.background
    },
    hero: {
      flex: 1,
      justifyContent: 'space-between',
      paddingBottom: 10
    },
    logoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginBottom: 12
    },
    brandName: {
      color: colors.text,
      fontSize: 20,
      fontWeight: '800'
    },
    brandSlogan: {
      color: colors.mutedText,
      marginTop: 2,
      fontWeight: '600'
    },
    heroBadge: {
      width: 72,
      height: 72,
      borderRadius: 22,
      backgroundColor: colors.primarySoft,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 18,
      alignSelf: 'flex-start'
    },
    heroTitle: {
      color: colors.text,
      fontSize: 40,
      lineHeight: 44,
      fontWeight: '800',
      marginBottom: 12
    },
    heroDescription: {
      color: colors.mutedText,
      fontSize: 15,
      lineHeight: 23,
      fontWeight: '500',
      maxWidth: 520
    },
    toggleRow: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 22,
      flexWrap: 'wrap'
    },
    loginCard: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 28,
      backgroundColor: colors.surface,
      padding: 18,
      shadowColor: colors.shadow,
      shadowOpacity: 0.08,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 8 },
      elevation: 1
    },
    eyebrow: {
      color: colors.primary,
      fontSize: 12,
      fontWeight: '800',
      letterSpacing: 1.3,
      textTransform: 'uppercase'
    },
    title: {
      color: colors.text,
      fontSize: 30,
      lineHeight: 34,
      fontWeight: '800',
      marginTop: 8
    },
    description: {
      color: colors.mutedText,
      fontSize: 14,
      lineHeight: 22,
      marginTop: 10,
      marginBottom: 18,
      fontWeight: '500'
    },
    linkRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 14,
      marginTop: 14,
      flexWrap: 'wrap'
    },
    link: {
      color: colors.primary,
      fontWeight: '800'
    }
  });
}

export function LoginScreen() {
  const { colors, t, login, setAuthView } = useApp();
  const styles = authCardStyles(colors);
  const [email, setEmail] = useState('admin@jqpa.com');
  const [password, setPassword] = useState('123456');
  const [errors, setErrors] = useState({});

  const onSubmit = () => {
    const next = {};
    if (!email.trim()) next.email = t('form.required');
    if (!password.trim()) next.password = t('form.required');
    setErrors(next);
    if (Object.keys(next).length) return;
    login({ email, password });
  };

  return (
    <ScrollView contentContainerStyle={styles.wrap} keyboardShouldPersistTaps="handled">
      <View style={styles.hero}>
        <View>
          <View style={styles.logoRow}>
            <LogoMark size={48} />
            <View>
              <Text style={styles.brandName}>JQPA</Text>
              <Text style={styles.brandSlogan}>{t('auth.brand.slogan')}</Text>
            </View>
          </View>

          <View style={styles.heroBadge}>
            <FontAwesome5 name="balance-scale" size={24} color={colors.primary} />
          </View>

          <Text style={styles.heroTitle}>{t('auth.hero.title')}</Text>
          <Text style={styles.heroDescription}>{t('auth.hero.description')}</Text>

          <View style={styles.toggleRow}>
            <ThemeToggle />
            <LanguageToggle />
          </View>
        </View>

        <Card style={styles.loginCard}>
          <Text style={styles.eyebrow}>{t('auth.login.eyebrow')}</Text>
          <Text style={styles.title}>{t('auth.login.title')}</Text>
          <Text style={styles.description}>{t('auth.login.description')}</Text>

          <TextField label={t('auth.login.email')} value={email} onChangeText={setEmail} placeholder="admin@jqpa.com" error={errors.email} keyboardType="email-address" />
          <TextField label={t('auth.login.password')} value={password} onChangeText={setPassword} placeholder="••••••••" error={errors.password} secureTextEntry />
          <PrimaryButton title={t('auth.login.submit')} onPress={onSubmit} fullWidth />

          <View style={styles.linkRow}>
            <Text style={styles.link} onPress={() => setAuthView('register')}>{t('auth.login.createAccount')}</Text>
            <Text style={styles.link} onPress={() => setAuthView('recover')}>{t('auth.login.forgotPassword')}</Text>
          </View>
        </Card>
      </View>
    </ScrollView>
  );
}

export function RegisterScreen() {
  const { colors, t, setAuthView, showToast } = useApp();
  const styles = authCardStyles(colors);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});

  const onSubmit = () => {
    const next = {};
    if (!form.name.trim()) next.name = t('form.required');
    if (!form.email.trim()) next.email = t('form.required');
    if (!form.password.trim()) next.password = t('form.required');
    if (form.password !== form.confirmPassword) next.confirmPassword = t('form.passwordMismatch');
    setErrors(next);
    if (Object.keys(next).length) return;
    showToast({ title: t('toasts.savedTitle'), message: t('toasts.genericSuccess') });
    setAuthView('login');
  };

  return (
    <ScrollView contentContainerStyle={styles.wrap} keyboardShouldPersistTaps="handled">
      <Card style={styles.loginCard}>
        <Text style={styles.eyebrow}>{t('auth.register.eyebrow')}</Text>
        <Text style={styles.title}>{t('auth.register.title')}</Text>
        <Text style={styles.description}>{t('auth.register.description')}</Text>
        <TextField label={t('auth.register.name')} value={form.name} onChangeText={(value) => setForm((prev) => ({ ...prev, name: value }))} error={errors.name} />
        <TextField label={t('auth.register.email')} value={form.email} onChangeText={(value) => setForm((prev) => ({ ...prev, email: value }))} error={errors.email} keyboardType="email-address" />
        <TextField label={t('auth.register.password')} value={form.password} onChangeText={(value) => setForm((prev) => ({ ...prev, password: value }))} error={errors.password} secureTextEntry />
        <TextField label={t('auth.register.confirmPassword')} value={form.confirmPassword} onChangeText={(value) => setForm((prev) => ({ ...prev, confirmPassword: value }))} error={errors.confirmPassword} secureTextEntry />
        <PrimaryButton title={t('auth.register.submit')} onPress={onSubmit} fullWidth />
        <Text style={styles.link} onPress={() => setAuthView('login')}>
          {t('auth.register.hasAccount')}
        </Text>
      </Card>
    </ScrollView>
  );
}

export function RecoverScreen() {
  const { colors, t, setAuthView, showToast } = useApp();
  const styles = authCardStyles(colors);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const onSubmit = () => {
    if (!email.trim()) {
      setError(t('form.required'));
      return;
    }
    setError('');
    showToast({ title: t('toasts.savedTitle'), message: t('toasts.genericSuccess') });
    setAuthView('login');
  };

  return (
    <ScrollView contentContainerStyle={styles.wrap} keyboardShouldPersistTaps="handled">
      <Card style={styles.loginCard}>
        <Text style={styles.eyebrow}>{t('auth.recover.eyebrow')}</Text>
        <Text style={styles.title}>{t('auth.recover.title')}</Text>
        <Text style={styles.description}>{t('auth.recover.description')}</Text>
        <TextField label={t('auth.recover.email')} value={email} onChangeText={setEmail} error={error} keyboardType="email-address" />
        <PrimaryButton title={t('auth.recover.submit')} onPress={onSubmit} fullWidth />
        <Text style={styles.link} onPress={() => setAuthView('login')}>
          {t('auth.recover.back')}
        </Text>
      </Card>
    </ScrollView>
  );
}

function DashboardSection() {
  const { colors, t, language, showToast } = useApp();
  const activeCases = cases.filter((item) => item.status !== 'Cerrado');
  const billableHours = activities.filter((item) => item.billable).reduce((sum, item) => sum + item.hours, 0);
  const activeClients = clients.filter((item) => item.status === 'Activo').length;

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
      <ScreenHeader
        eyebrow={t('dashboard.sectionSubtitle')}
        title={t('dashboard.sectionTitle')}
        description={t('dashboard.description')}
        actions={(
          <>
            <PrimaryButton title={t('dashboard.newClient')} onPress={() => showToast({ title: t('toasts.savedTitle'), message: t('dashboard.newClient') })} />
            <PrimaryButton title={t('dashboard.newCase')} variant="secondary" onPress={() => showToast({ title: t('toasts.savedTitle'), message: t('dashboard.newCase') })} />
          </>
        )}
      />

      <View style={stylesGrid.row}>
        <StatCard label={t('dashboard.clientsActive')} value={activeClients} note={t('dashboard.baseLaw')} icon="users" accent="primary" />
        <StatCard label={t('dashboard.casesOpen')} value={activeCases.length} note={t('dashboard.followUp')} icon="briefcase" accent="warning" />
        <StatCard label={t('dashboard.documents')} value={documents.length} note={t('dashboard.repository')} icon="file-text" accent="neutral" />
        <StatCard label={t('dashboard.billableHours')} value={billableHours} note={formatCurrency(billableHours * 120000, language)} icon="activity" accent="success" />
      </View>

      <View style={stylesGrid.columns}>
        <SectionCard title={t('dashboard.priorityCases')} subtitle={t('dashboard.sectionSubtitle')}>
          <Text style={stylesGrid.muted}>{t('dashboard.priorityDescription')}</Text>
          <View style={{ marginTop: 10 }}>
            {cases.slice(0, 3).map((item) => (
              <View key={item.id} style={stylesGrid.itemRow}>
                <View style={{ flex: 1 }}>
                  <Text style={stylesGrid.rowTitle}>{item.id}</Text>
                  <Text style={[stylesGrid.muted, { marginTop: 3 }]}>{item.title}</Text>
                  <ProgressBar value={item.progress} />
                </View>
                <Pill variant={item.priority === 'Alta' ? 'danger' : item.priority === 'Media' ? 'warning' : 'neutral'}>{item.priority}</Pill>
              </View>
            ))}
          </View>
        </SectionCard>

        <SectionCard title={t('dashboard.hearings')} subtitle={t('dashboard.sectionSubtitle')}>
          <Text style={stylesGrid.muted}>{t('dashboard.hearingsDescription')}</Text>
          <View style={{ marginTop: 10 }}>
            {cases.filter((item) => item.nextHearing !== 'Sin audiencia').map((item) => (
              <View key={item.id} style={stylesGrid.itemRow}>
                <View style={{ flex: 1 }}>
                  <Text style={stylesGrid.rowTitle}>{item.client}</Text>
                  <Text style={[stylesGrid.muted, { marginTop: 3 }]}>{item.court}</Text>
                </View>
                <Pill variant="warning">{formatDate(item.nextHearing, language)}</Pill>
              </View>
            ))}
          </View>
        </SectionCard>
      </View>
    </ScrollView>
  );
}

function ClientsSection() {
  const { colors, t, language } = useApp();
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    const normalized = normalizeText(query);
    return clients.filter((client) => [client.name, client.document, client.email, client.city, client.status].map(normalizeText).some((value) => value.includes(normalized)));
  }, [query]);

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 28 }}>
      <ScreenHeader eyebrow={t('clients.sectionSubtitle')} title={t('clients.title')} description={t('clients.description')} />
      <Card>
        <TextField label={t('common.search')} value={query} onChangeText={setQuery} placeholder={t('clients.searchPlaceholder')} />
        <View style={stylesGrid.filterRow}>
          <Pill>{filtered.length} {t('clients.records')}</Pill>
        </View>
      </Card>

      {filtered.map((client) => (
        <Card key={client.id}>
          <View style={stylesGrid.cardHead}>
            <View style={{ flex: 1 }}>
              <Text style={stylesGrid.rowTitle}>{client.name}</Text>
              <Text style={[stylesGrid.muted, { marginTop: 4 }]}>{client.document}</Text>
            </View>
            <Pill variant={client.status === 'Activo' ? 'success' : client.status === 'En revisión' ? 'warning' : 'neutral'}>{client.status}</Pill>
          </View>
          <View style={stylesGrid.gridInfo}>
            <Info label={t('clients.type')} value={client.type} />
            <Info label={t('clients.city')} value={client.city} />
            <Info label={t('clients.cases')} value={String(client.cases)} />
            <Info label={t('clients.updated')} value={formatDate(client.lastUpdate, language)} />
          </View>
          <Text style={[stylesGrid.muted, { marginTop: 10 }]}>{client.email} · {client.phone}</Text>
        </Card>
      ))}
    </ScrollView>
  );
}

function CasesSection() {
  const { colors, t, language, showToast } = useApp();
  const [query, setQuery] = useState('');
  const [area, setArea] = useState('');
  const areas = ['Laboral', 'Comercial', 'Familia', 'Civil'];

  const filtered = useMemo(() => {
    const normalized = normalizeText(query);
    return cases.filter((item) => {
      const matchesText = [item.id, item.title, item.client, item.status, item.area].map(normalizeText).some((value) => value.includes(normalized));
      const matchesArea = area ? item.area === area : true;
      return matchesText && matchesArea;
    });
  }, [query, area]);

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 28 }}>
      <ScreenHeader eyebrow={t('cases.sectionSubtitle')} title={t('cases.title')} description={t('cases.description')} />
      <Card>
        <TextField label={t('common.search')} value={query} onChangeText={setQuery} placeholder={t('cases.searchPlaceholder')} />
        <Text style={[stylesGrid.sectionSmallTitle, { color: colors.text, marginBottom: 10 }]}>{t('cases.areaFilter')}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 4 }}>
          <Chip label={t('cases.areaAll')} active={!area} onPress={() => setArea('')} />
          {areas.map((item) => (
            <Chip key={item} label={item} active={area === item} onPress={() => setArea(item)} />
          ))}
        </ScrollView>
      </Card>

      {filtered.map((item) => (
        <Card key={item.id}>
          <View style={stylesGrid.cardHead}>
            <View style={{ flex: 1 }}>
              <Text style={stylesGrid.rowTitle}>{item.id}</Text>
              <Text style={[stylesGrid.muted, { marginTop: 4 }]}>{item.title}</Text>
            </View>
            <Pill variant={item.priority === 'Alta' ? 'danger' : item.priority === 'Media' ? 'warning' : 'neutral'}>{item.priority}</Pill>
          </View>
          <View style={stylesGrid.gridInfo}>
            <Info label={t('cases.client')} value={item.client} />
            <Info label={t('cases.areaFilter')} value={item.area} />
            <Info label={t('cases.court')} value={item.court} />
            <Info label={t('cases.nextHearing')} value={item.nextHearing === 'Sin audiencia' ? item.nextHearing : formatDate(item.nextHearing, language)} />
          </View>
          <Text style={[stylesGrid.muted, { marginTop: 10 }]}>{t('cases.progress')} · {item.progress}%</Text>
          <ProgressBar value={item.progress} />
          <View style={{ marginTop: 12, flexDirection: 'row', justifyContent: 'flex-end' }}>
            <PrimaryButton title={t('actions.view')} variant="secondary" onPress={() => showToast({ title: item.id, message: item.title })} />
          </View>
        </Card>
      ))}
    </ScrollView>
  );
}

function DocumentsSection() {
  const { t, language } = useApp();
  const total = documents.length;
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 28 }}>
      <ScreenHeader eyebrow={t('documents.sectionSubtitle')} title={t('documents.title')} description={t('documents.description')} />
      <View style={stylesGrid.row}>
        <StatCard label={t('documents.title')} value={total} note={t('dashboard.repository')} icon="file-text" accent="neutral" />
        <StatCard label={t('clients.title')} value={clients.length} note={t('dashboard.baseLaw')} icon="users" accent="primary" />
      </View>
      {documents.map((doc) => (
        <Card key={doc.id}>
          <View style={stylesGrid.cardHead}>
            <View style={{ flex: 1 }}>
              <Text style={stylesGrid.rowTitle}>{doc.name}</Text>
              <Text style={[stylesGrid.muted, { marginTop: 4 }]}>{doc.caseId} · {doc.type}</Text>
            </View>
            <Pill variant={doc.status === 'Vigente' ? 'success' : doc.status === 'Borrador' ? 'warning' : 'neutral'}>{doc.status}</Pill>
          </View>
          <View style={stylesGrid.gridInfo}>
            <Info label={t('documents.uploaded')} value={formatDate(doc.uploadedAt, language)} />
            <Info label={t('documents.status')} value={doc.size} />
          </View>
        </Card>
      ))}
    </ScrollView>
  );
}

function ActivitiesSection() {
  const { colors, t, language, showToast } = useApp();
  const [rate, setRate] = useState('120000');
  const totalHours = activities.filter((item) => item.billable).reduce((sum, item) => sum + item.hours, 0);
  const estimated = totalHours * Number(rate || 0);

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 28 }}>
      <ScreenHeader
        eyebrow={t('activities.sectionSubtitle')}
        title={t('activities.title')}
        description={t('activities.description')}
        actions={<PrimaryButton title={t('activities.register')} onPress={() => showToast({ title: t('toasts.savedTitle'), message: t('toasts.genericSuccess') })} />}
      />
      <View style={stylesGrid.row}>
        <StatCard label={t('activities.billableHours')} value={totalHours.toFixed(1)} note={formatCurrency(estimated, language)} icon="clock" accent="success" />
        <Card style={{ flex: 1 }}>
          <Text style={stylesGrid.smallLabel}>{t('activities.rate')}</Text>
          <TextField label={t('activities.rate')} value={rate} onChangeText={setRate} keyboardType="numeric" />
        </Card>
      </View>
      <Card>
        <Text style={stylesGrid.smallLabel}>{t('activities.estimated')}</Text>
        <Text style={[stylesGrid.bigMoney, { color: colors.text }]}>{formatCurrency(estimated, language)}</Text>
      </Card>

      {activities.map((item) => (
        <Card key={item.id}>
          <View style={stylesGrid.cardHead}>
            <View style={{ flex: 1 }}>
              <Text style={stylesGrid.rowTitle}>{item.title}</Text>
              <Text style={[stylesGrid.muted, { marginTop: 4 }]}>{item.caseId}</Text>
            </View>
            <Pill variant={item.status === 'Pendiente' ? 'warning' : item.billable ? 'success' : 'neutral'}>{item.status}</Pill>
          </View>
          <View style={stylesGrid.gridInfo}>
            <Info label={t('activities.date')} value={formatDate(item.date, language)} />
            <Info label={t('activities.hours')} value={String(item.hours)} />
            <Info label={t('activities.billable')} value={item.billable ? 'Sí' : 'No'} />
          </View>
        </Card>
      ))}
    </ScrollView>
  );
}

function CalculatorSection() {
  const { colors, t, language, showToast } = useApp();
  const [salary, setSalary] = useState('1800000');
  const [days, setDays] = useState('180');
  const [transport, setTransport] = useState('200000');
  const [contractType, setContractType] = useState('Indefinido');

  const result = useMemo(() => {
    const base = Number(salary || 0) + Number(transport || 0);
    const workedDays = Number(days || 0);
    const cesantias = (base * workedDays) / 360;
    const intereses = cesantias * 0.12 * (workedDays / 360);
    const prima = (base * workedDays) / 360;
    const vacaciones = (Number(salary || 0) * workedDays) / 720;
    const total = cesantias + intereses + prima + vacaciones;
    return { cesantias, intereses, prima, vacaciones, total };
  }, [salary, days, transport]);

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 28 }}>
      <ScreenHeader eyebrow={t('calculator.sectionSubtitle')} title={t('calculator.title')} description={t('calculator.description')} actions={<PrimaryButton title={t('actions.generateReport')} onPress={() => showToast({ title: t('toasts.exportTitle'), message: t('toasts.exportSuccess') })} />} />
      <View style={stylesGrid.columns}>
        <Card>
          <TextField label={t('calculator.salary')} value={salary} onChangeText={setSalary} keyboardType="numeric" />
          <TextField label={t('calculator.transport')} value={transport} onChangeText={setTransport} keyboardType="numeric" />
          <TextField label={t('calculator.days')} value={days} onChangeText={setDays} keyboardType="numeric" />
          <Text style={[stylesGrid.smallLabel, { color: colors.text, marginBottom: 8 }]}>{t('calculator.contractType')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 4 }}>
            {['Indefinido', 'Fijo', 'Obra o labor'].map((item) => (
              <Chip key={item} label={item} active={contractType === item} onPress={() => setContractType(item)} />
            ))}
          </ScrollView>
          <Text style={[stylesGrid.muted, { marginTop: 12 }]}>{t('calculator.note')}</Text>
        </Card>
        <Card>
          <Text style={stylesGrid.smallLabel}>{t('calculator.result')}</Text>
          <Text style={[stylesGrid.bigMoney, { color: colors.text }]}>{formatCurrency(result.total, language)}</Text>
          <View style={{ marginTop: 16 }}>
            <Info label="Cesantías" value={formatCurrency(result.cesantias, language)} />
            <Info label="Intereses de cesantías" value={formatCurrency(result.intereses, language)} />
            <Info label="Prima de servicios" value={formatCurrency(result.prima, language)} />
            <Info label="Vacaciones" value={formatCurrency(result.vacaciones, language)} />
          </View>
        </Card>
      </View>
    </ScrollView>
  );
}

function ReportsSection() {
  const { t, showToast } = useApp();
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 28 }}>
      <ScreenHeader eyebrow={t('reports.sectionSubtitle')} title={t('reports.title')} description={t('reports.description')} />
      <View style={stylesGrid.columns}>
        <Card>
          <Text style={stylesGrid.sectionSmallTitle}>{t('reports.clients')}</Text>
          <Text style={[stylesGrid.muted, { marginTop: 6 }]}>Clientes activos, inactivos y casos relacionados.</Text>
          <Text style={stylesGrid.bigNumber}>{clients.length}</Text>
          <PrimaryButton title={t('reports.exportPdf')} onPress={() => showToast({ title: t('toasts.exportTitle'), message: t('toasts.exportSuccess') })} fullWidth />
        </Card>
        <Card>
          <Text style={stylesGrid.sectionSmallTitle}>{t('reports.cases')}</Text>
          <Text style={[stylesGrid.muted, { marginTop: 6 }]}>Procesos por área, estado, prioridad y responsable.</Text>
          <Text style={stylesGrid.bigNumber}>{cases.length}</Text>
          <PrimaryButton title={t('reports.exportExcel')} variant="secondary" onPress={() => showToast({ title: t('toasts.exportTitle'), message: t('toasts.exportSuccess') })} fullWidth />
        </Card>
        <Card>
          <Text style={stylesGrid.sectionSmallTitle}>{t('reports.activities')}</Text>
          <Text style={[stylesGrid.muted, { marginTop: 6 }]}>Horas invertidas, facturables y no facturables.</Text>
          <Text style={stylesGrid.bigNumber}>{activities.length}</Text>
          <PrimaryButton title={t('reports.exportWord')} variant="secondary" onPress={() => showToast({ title: t('toasts.exportTitle'), message: t('toasts.exportSuccess') })} fullWidth />
        </Card>
      </View>

      <Card>
        <Text style={stylesGrid.sectionSmallTitle}>{t('reports.filters')}</Text>
        <View style={stylesGrid.gridInfo}>
          <Info label={t('reports.module')} value="Clientes / Casos / Documentos / Actividades" />
          <Info label={t('reports.period')} value="Últimos 30 días" />
          <Info label={t('reports.format')} value="PDF / Excel / Word" />
          <Info label={t('reports.totalDocuments')} value={`${documents.length} archivos`} />
        </View>
      </Card>
    </ScrollView>
  );
}

function AdminSection() {
  const { t, showToast } = useApp();
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 28 }}>
      <ScreenHeader eyebrow={t('admin.sectionSubtitle')} title={t('admin.title')} description={t('admin.description')} actions={<PrimaryButton title={t('admin.newUser')} onPress={() => showToast({ title: t('toasts.savedTitle'), message: t('toasts.genericSuccess') })} />} />
      <View style={stylesGrid.columns}>
        <Card>
          <Text style={stylesGrid.sectionSmallTitle}>{t('admin.roles')}</Text>
          <View style={{ marginTop: 12 }}>
            <View style={stylesGrid.itemRow}><Text style={stylesGrid.rowTitle}>Administrador</Text><Pill variant="success">Activo</Pill></View>
            <View style={stylesGrid.itemRow}><Text style={stylesGrid.rowTitle}>Abogado</Text><Pill variant="success">Activo</Pill></View>
            <View style={stylesGrid.itemRow}><Text style={stylesGrid.rowTitle}>Abogado</Text><Pill variant="success">Activo</Pill></View>
          </View>
        </Card>
        <Card>
          <Text style={stylesGrid.sectionSmallTitle}>{t('admin.matrix')}</Text>
          <View style={{ marginTop: 12 }}>
            {users.map((item) => (
              <View key={item.id} style={stylesGrid.itemRow}>
                <View style={{ flex: 1 }}>
                  <Text style={stylesGrid.rowTitle}>{item.name}</Text>
                  <Text style={stylesGrid.muted}>{item.email}</Text>
                </View>
                <Pill variant={item.role === 'Administrador' ? 'warning' : 'neutral'}>{item.role}</Pill>
              </View>
            ))}
          </View>
        </Card>
      </View>
    </ScrollView>
  );
}

function Info({ label, value }) {
  const { colors } = useApp();
  return (
    <View style={stylesGrid.infoBox}>
      <Text style={[stylesGrid.infoLabel, { color: colors.mutedText }]}>{label}</Text>
      <Text style={[stylesGrid.infoValue, { color: colors.text }]} numberOfLines={2}>{value}</Text>
    </View>
  );
}

export function MainScreen() {
  const { activeSection } = useApp();
  switch (activeSection) {
    case 'clients':
      return <ClientsSection />;
    case 'cases':
      return <CasesSection />;
    case 'documents':
      return <DocumentsSection />;
    case 'activities':
      return <ActivitiesSection />;
    case 'calculator':
      return <CalculatorSection />;
    case 'reports':
      return <ReportsSection />;
    case 'admin':
      return <AdminSection />;
    case 'dashboard':
    default:
      return <DashboardSection />;
  }
}

const stylesGrid = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 8
  },
  columns: {
    gap: 12,
    marginTop: 4
  },
  muted: {
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '500'
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 12
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '800'
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8
  },
  cardHead: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 10
  },
  gridInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },
  infoBox: {
    width: '48%',
    minWidth: 140,
    padding: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(127, 142, 178, 0.08)'
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.4,
    textTransform: 'uppercase'
  },
  infoValue: {
    fontSize: 14,
    marginTop: 6,
    fontWeight: '700'
  },
  sectionSmallTitle: {
    fontSize: 18,
    fontWeight: '800'
  },
  bigMoney: {
    fontSize: 30,
    lineHeight: 34,
    fontWeight: '800',
    marginTop: 10
  },
  bigNumber: {
    fontSize: 34,
    fontWeight: '800',
    marginVertical: 12
  }
});

export { ThemeToggle, LanguageToggle };
