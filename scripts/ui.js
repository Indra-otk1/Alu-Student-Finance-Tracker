// ui.js - User interface rendering and manipulation

import { 
  getState, 
  setUI, 
  getFilteredAndSortedRecords,
  addRecord,
  updateRecord,
  deleteRecord,
  setFilter
} from './state.js';
import { validateAll } from './validators.js';
import { searchRecords, highlightRecord, compileRegex } from './search.js';
import { loadSettings } from './storage.js';

export const renderDashboard = () => {
  const records = getState().records;
  const container = document.getElementById('dashboard-stats');
  
  if (!records.length) {
    container.innerHTML = '<p>No transactions yet. Add one to get started!</p>';
    return;
  }
  
  const total = records.reduce((sum, r) => sum + r.amount, 0);
  const lastWeek = records.filter(r => {
    const date = new Date(r.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return date >= weekAgo;
  });
  const lastWeekTotal = lastWeek.reduce((sum, r) => sum + r.amount, 0);
  
  // Get top category
  const categoryTotals = {};
  records.forEach(r => {
    categoryTotals[r.category] = (categoryTotals[r.category] || 0) + r.amount;
  });
  const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
  
  container.innerHTML = `
    <div class="stats-grid">
      <div class="stat-card">
        <h3>Total Spent</h3>
        <p class="stat-value">$${total.toFixed(2)}</p>
      </div>
      <div class="stat-card">
        <h3>Last 7 Days</h3>
        <p class="stat-value">$${lastWeekTotal.toFixed(2)}</p>
      </div>
      <div class="stat-card">
        <h3>Top Category</h3>
        <p class="stat-value">${topCategory ? topCategory[0] : 'N/A'}</p>
        <p class="stat-subtitle">$${topCategory ? topCategory[1].toFixed(2) : '0.00'}</p>
      </div>
      <div class="stat-card">
        <h3>Total Records</h3>
        <p class="stat-value">${records.length}</p>
      </div>
    </div>
  `;
};

export const renderRecordsTable = (recordsToRender = null) => {
  const state = getState();
  const records = recordsToRender || getFilteredAndSortedRecords();
  const tbody = document.querySelector('#records-table tbody');
  
  if (!tbody) return;
  
  if (!records.length) {
    tbody.innerHTML = '<tr><td colspan="6">No records found.</td></tr>';
    return;
  }
  
  tbody.innerHTML = records.map(record => `
    <tr data-id="${record.id}" class="record-row ${state.ui.editingId === record.id ? 'editing' : ''}">
      <td class="desc-col">${record.description}</td>
      <td class="amount-col">$${record.amount.toFixed(2)}</td>
      <td class="cat-col">${record.category}</td>
      <td class="date-col">${record.date}</td>
      <td class="actions-col">
        <button class="btn-edit" aria-label="Edit transaction">Edit</button>
        <button class="btn-delete" aria-label="Delete transaction">Delete</button>
      </td>
    </tr>
  `).join('');
};

export const showTab = (tabName) => {
  // Hide all tabs
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.hidden = true;
  });
  
  // Show selected tab
  const tab = document.getElementById(`tab-${tabName}`);
  if (tab) tab.hidden = false;
  
  // Update button states
  document.querySelectorAll('[role="tab"]').forEach(btn => {
    btn.setAttribute('aria-selected', btn.dataset.tab === tabName);
  });
  
  setUI({ activeTab: tabName });
};

export const showMessage = (message, type = 'info') => {
  const container = document.getElementById('messages');
  if (!container) return;
  
  const msg = document.createElement('div');
  msg.className = `message message-${type}`;
  msg.setAttribute('role', 'status');
  msg.setAttribute('aria-live', type === 'error' ? 'assertive' : 'polite');
  msg.textContent = message;
  
  container.appendChild(msg);
  
  setTimeout(() => msg.remove(), 5000);
};

export const showError = (fieldName, errors) => {
  const errorEl = document.querySelector(`[data-error="${fieldName}"]`);
  if (errorEl) {
    errorEl.textContent = errors.join('; ');
    errorEl.hidden = false;
  }
};

export const clearErrors = () => {
  document.querySelectorAll('[data-error]').forEach(el => {
    el.textContent = '';
    el.hidden = true;
  });
};

export const getFormData = () => {
  return {
    description: document.getElementById('input-description')?.value || '',
    amount: parseFloat(document.getElementById('input-amount')?.value || 0),
    category: document.getElementById('input-category')?.value || '',
    date: document.getElementById('input-date')?.value || ''
  };
};

export const setFormData = (record) => {
  if (!record) {
    document.getElementById('input-description').value = '';
    document.getElementById('input-amount').value = '';
    document.getElementById('input-category').value = '';
    document.getElementById('input-date').value = '';
    document.getElementById('form-submit').textContent = 'Add Transaction';
    setUI({ editingId: null });
    return;
  }
  
  document.getElementById('input-description').value = record.description;
  document.getElementById('input-amount').value = record.amount;
  document.getElementById('input-category').value = record.category;
  document.getElementById('input-date').value = record.date;
  document.getElementById('form-submit').textContent = 'Update Transaction';
  setUI({ editingId: record.id });
};

export const handleAddOrUpdateRecord = () => {
  clearErrors();
  const data = getFormData();
  const errors = validateAll(data);
  
  if (errors) {
    Object.entries(errors).forEach(([field, msgs]) => {
      showError(field, msgs);
    });
    return false;
  }
  
  const state = getState();
  if (state.ui.editingId) {
    updateRecord(state.ui.editingId, data);
    showMessage('Transaction updated successfully!', 'success');
  } else {
    addRecord(data);
    showMessage('Transaction added successfully!', 'success');
  }
  
  setFormData(null);
  renderRecordsTable();
  renderDashboard();
  
  return true;
};

export const handleDeleteRecord = (id) => {
  if (confirm('Are you sure you want to delete this transaction?')) {
    deleteRecord(id);
    showMessage('Transaction deleted.', 'info');
    renderRecordsTable();
    renderDashboard();
  }
};

export const populateCategorySelect = () => {
  const settings = loadSettings();
  const select = document.getElementById('input-category');
  
  if (!select) return;
  
  select.innerHTML = '<option value="">Select a category</option>' + 
    settings.categories.map(cat => 
      `<option value="${cat}">${cat}</option>`
    ).join('');
};
