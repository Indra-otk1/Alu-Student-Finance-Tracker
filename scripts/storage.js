// storage.js - Persistent state management with localStorage

const KEY = 'sft:data';
const SETTINGS_KEY = 'sft:settings';

export const load = () => {
  try {
    const data = localStorage.getItem(KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to load data:', e);
    return [];
  }
};

export const save = (data) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error('Failed to save data:', e);
    return false;
  }
};

export const loadSettings = () => {
  try {
    const settings = localStorage.getItem(SETTINGS_KEY);
    return settings ? JSON.parse(settings) : getDefaultSettings();
  } catch (e) {
    console.error('Failed to load settings:', e);
    return getDefaultSettings();
  }
};

export const saveSettings = (settings) => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    return true;
  } catch (e) {
    console.error('Failed to save settings:', e);
    return false;
  }
};

export const getDefaultSettings = () => ({
  baseCurrency: 'USD',
  exchangeRates: {
    USD: 1,
    EUR: 0.92,
    GBP: 0.79
  },
  categories: ['Food', 'Books', 'Transport', 'Entertainment', 'Fees', 'Other'],
  theme: 'light',
  spendingCap: null
});

export const exportJSON = (data) => {
  const dataStr = JSON.stringify(data, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `finance-tracker-export-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);
};

export const validateImportData = (data) => {
  if (!Array.isArray(data)) {
    throw new Error('Invalid data format: expected array');
  }
  
  data.forEach((record, idx) => {
    if (!record.id) throw new Error(`Record ${idx}: missing id`);
    if (!record.description) throw new Error(`Record ${idx}: missing description`);
    if (record.amount === undefined) throw new Error(`Record ${idx}: missing amount`);
    if (!record.category) throw new Error(`Record ${idx}: missing category`);
    if (!record.date) throw new Error(`Record ${idx}: missing date`);
    if (typeof record.amount !== 'number') throw new Error(`Record ${idx}: amount must be a number`);
  });
  
  return data;
};
