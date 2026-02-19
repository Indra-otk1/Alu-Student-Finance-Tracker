// state.js - Application state management

import { load, save } from './storage.js';

let appState = {
  records: [],
  filter: {
    searchPattern: '',
    caseSensitive: false,
    sortBy: 'date', // date, description, amount
    sortOrder: 'desc' // asc, desc
  },
  ui: {
    editingId: null,
    activeTab: 'dashboard' // dashboard, records, add, settings, about
  }
};

export const initializeState = () => {
  appState.records = load();
  return appState;
};

export const getState = () => ({ ...appState });

export const setState = (updates) => {
  appState = { ...appState, ...updates };
};

export const updateRecords = (records) => {
  appState.records = records;
  save(records);
};

export const addRecord = (record) => {
  const now = new Date().toISOString();
  const newRecord = {
    ...record,
    id: `rec_${Date.now()}`,
    createdAt: now,
    updatedAt: now
  };
  
  appState.records.push(newRecord);
  save(appState.records);
  return newRecord;
};

export const updateRecord = (id, updates) => {
  const idx = appState.records.findIndex(r => r.id === id);
  if (idx === -1) return null;
  
  const updated = {
    ...appState.records[idx],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  appState.records[idx] = updated;
  save(appState.records);
  return updated;
};

export const deleteRecord = (id) => {
  const idx = appState.records.findIndex(r => r.id === id);
  if (idx === -1) return false;
  
  appState.records.splice(idx, 1);
  save(appState.records);
  return true;
};

export const setFilter = (filterUpdates) => {
  appState.filter = { ...appState.filter, ...filterUpdates };
};

export const setUI = (uiUpdates) => {
  appState.ui = { ...appState.ui, ...uiUpdates };
};

export const getFilteredAndSortedRecords = () => {
  let filtered = [...appState.records];
  
  // Apply filter (not used yet, will be used with search)
  
  // Apply sorting
  filtered.sort((a, b) => {
    let aVal = a[appState.filter.sortBy];
    let bVal = b[appState.filter.sortBy];
    
    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }
    
    let cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    return appState.filter.sortOrder === 'asc' ? cmp : -cmp;
  });
  
  return filtered;
};
