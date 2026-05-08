export const lightTheme = {
  background: '#f4f7fc',
  surface: '#ffffff',
  mutedSurface: '#eef3ff',
  card: '#ffffff',
  primary: '#2453e6',
  primarySoft: '#dbe7ff',
  primaryText: '#1737aa',
  text: '#0f172a',
  mutedText: '#64748b',
  border: '#d8e1f0',
  success: '#0f8a4a',
  warning: '#c67b00',
  danger: '#cc3b3b',
  info: '#3366cc',
  shadow: '#0f172a',
  overlay: 'rgba(15, 23, 42, 0.42)'
};

export const darkTheme = {
  background: '#08111f',
  surface: '#101a30',
  mutedSurface: '#15213a',
  card: '#111b31',
  primary: '#5f7ef5',
  primarySoft: '#1d2a49',
  primaryText: '#9db2ff',
  text: '#f7fafc',
  mutedText: '#9fb0ca',
  border: '#24324e',
  success: '#31c06d',
  warning: '#f1b53d',
  danger: '#ff7a7a',
  info: '#7aa2ff',
  shadow: '#000000',
  overlay: 'rgba(0, 0, 0, 0.58)'
};

export const getTheme = (mode = 'light') => (mode === 'dark' ? darkTheme : lightTheme);
