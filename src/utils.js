export const normalizeText = (value = '') =>
  String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

export const formatDate = (value, language = 'es') => {
  if (!value) return '—';
  const date = new Date(`${value}T00:00:00`);
  return new Intl.DateTimeFormat(language === 'en' ? 'en-US' : 'es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date);
};

export const formatCurrency = (value, language = 'es') => {
  const number = Number(value || 0);
  return new Intl.NumberFormat(language === 'en' ? 'en-US' : 'es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(number);
};

export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
