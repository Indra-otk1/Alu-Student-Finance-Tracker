// main.js - Application entry point and event handling

import { initializeState, getState, setUI, setFilter, updateRecords } from './state.js';
import * as ui from './ui.js';
import { loadSettings, saveSettings, exportJSON, validateImportData } from './storage.js';
import { compileRegex, searchRecords, highlightRecord } from './search.js';

let currentSearchPattern = '';
let currentSearchCaseSensitive = false;

// Initialize app
window.addEventListener('DOMContentLoaded', () => {
  initializeState();
  
  // Populate categories
  ui.populateCategorySelect();
  
  // Initial render
  ui.renderDashboard();
  ui.renderRecordsTable();
  
  // Set today's date as default
  const today = new Date().toISOString().split('T')[0];
  const dateInput = document.getElementById('input-date');
  if (dateInput) dateInput.value = today;
  
  attachEventListeners();
  initTheme();
});

// Theme handling
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  try { localStorage.setItem('sft-theme', theme); } catch (e) {}
  // Update both header and settings toggle buttons if present
  const headerBtn = document.getElementById('theme-toggle');
  const settingsBtn = document.getElementById('settings-theme-toggle');
  [headerBtn, settingsBtn].forEach(btn => {
    if (!btn) return;
    btn.setAttribute('aria-pressed', theme === 'dark');
    btn.textContent = theme === 'dark' ? '🌙 Dark' : '☀️ Light';
  });
}

function initTheme() {
  const saved = (() => { try { return localStorage.getItem('sft-theme'); } catch (e) { return null; } })();
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (prefersDark ? 'dark' : 'light');
  applyTheme(theme);

  const tbtn = document.getElementById('theme-toggle');
  if (tbtn) {
    tbtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  const settingsBtn = document.getElementById('settings-theme-toggle');
  if (settingsBtn) {
    settingsBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  // Delegated handler as a fallback (works if button is added later or covered)
  document.addEventListener('click', (e) => {
    const target = e.target;
    if (target.closest && target.closest('#theme-toggle, #settings-theme-toggle')) {
      const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    }
  });
}

function attachEventListeners() {
  // Tab navigation
  document.querySelectorAll('[role="tab"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const tab = e.target.dataset.tab;
      ui.showTab(tab);
    });
    
    // Keyboard navigation for tabs (arrow keys)
    btn.addEventListener('keydown', (e) => {
      const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
      const idx = tabs.indexOf(e.target);
      
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        const next = tabs[(idx + 1) % tabs.length];
        next.focus();
        next.click();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = tabs[(idx - 1 + tabs.length) % tabs.length];
        prev.focus();
        prev.click();
      }
    });
  });

  // Form submission
  const form = document.getElementById('transaction-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      ui.handleAddOrUpdateRecord();
    });
  }

  // Form cancel button
  const cancelBtn = document.getElementById('form-cancel');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      ui.setFormData(null);
      ui.showTab('dashboard');
    });
  }

  // Search functionality
  const searchInput = document.getElementById('search-input');
  const caseSensitiveCheckbox = document.getElementById('case-sensitive');
  const searchClearBtn = document.getElementById('search-clear');
  const searchError = document.getElementById('search-error');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearchPattern = e.target.value;
      handleSearch();
    });
  }

  if (caseSensitiveCheckbox) {
    caseSensitiveCheckbox.addEventListener('change', (e) => {
      currentSearchCaseSensitive = e.target.checked;
      handleSearch();
    });
  }

  if (searchClearBtn) {
    searchClearBtn.addEventListener('click', () => {
      searchInput.value = '';
      caseSensitiveCheckbox.checked = false;
      currentSearchPattern = '';
      currentSearchCaseSensitive = false;
      handleSearch();
    });
  }

  function handleSearch() {
    if (searchError) searchError.hidden = true;

    if (!currentSearchPattern) {
      // Show all records
      ui.renderRecordsTable();
      attachTableEventListeners();
      return;
    }

    // Validate regex
    const re = compileRegex(currentSearchPattern, currentSearchCaseSensitive ? '' : 'i');
    if (!re) {
      if (searchError) {
        searchError.textContent = 'Invalid regex pattern. Please check your syntax.';
        searchError.hidden = false;
      }
      ui.renderRecordsTable([]);
      return;
    }

    // Search and render results with highlights
    const state = getState();
    const results = searchRecords(state.records, currentSearchPattern, currentSearchCaseSensitive);
    
    const highlightedResults = results.map(r => 
      highlightRecord(r, currentSearchPattern, currentSearchCaseSensitive)
    );
    
    ui.renderRecordsTable(highlightedResults);
    attachTableEventListeners();
  }

  // Sorting
  const sortBySelect = document.getElementById('sort-by');
  const sortOrderSelect = document.getElementById('sort-order');

  if (sortBySelect) {
    sortBySelect.addEventListener('change', (e) => {
      setFilter({ sortBy: e.target.value });
      handleSearch(); // Re-render with new sort
    });
  }

  if (sortOrderSelect) {
    sortOrderSelect.addEventListener('change', (e) => {
      setFilter({ sortOrder: e.target.value });
      handleSearch();
    });
  }

  // Table edit/delete buttons
  attachTableEventListeners();

  // Delegated click handler for records table to support dynamic rows
  const recordsTable = document.getElementById('records-table');
  if (recordsTable) {
    recordsTable.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      const row = btn.closest('.record-row');
      const id = row?.dataset.id;

      if (btn.classList.contains('btn-edit')) {
        const state = getState();
        const record = state.records.find(r => r.id === id);
        if (record) {
          ui.setFormData(record);
          ui.showTab('add');
        }
        return;
      }

      if (btn.classList.contains('btn-delete')) {
        ui.handleDeleteRecord(id);
        return;
      }
    });
  }

  // Settings
  const exportBtn = document.getElementById('export-btn');
  const importBtn = document.getElementById('import-btn');
  const importFile = document.getElementById('import-file');
  const clearBtn = document.getElementById('clear-btn');
  const addCategoryBtn = document.getElementById('add-category-btn');
  const newCategoryInput = document.getElementById('new-category');

  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const state = getState();
      exportJSON(state.records);
      ui.showMessage('Data exported successfully!', 'success');
    });
  }

  if (importBtn) {
    importBtn.addEventListener('click', () => {
      importFile?.click();
    });
  }

  if (importFile) {
    importFile.addEventListener('change', async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result || '[]');
          validateImportData(data);
          
          // Add imported records
          const state = getState();
          data.forEach(record => {
            state.records.push({
              ...record,
              id: record.id || `rec_${Date.now()}`,
              createdAt: record.createdAt || new Date().toISOString(),
              updatedAt: record.updatedAt || new Date().toISOString()
            });
          });
          
          updateRecords(state.records);
          ui.renderRecordsTable();
          ui.renderDashboard();
          ui.showMessage(`Imported ${data.length} records successfully!`, 'success');
          
          // Reset file input
          importFile.value = '';
        } catch (err) {
          ui.showMessage(`Import failed: ${err.message}`, 'error');
        }
      };
      reader.readAsText(file);
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (confirm('Are you sure? This will delete ALL transactions permanently.')) {
        updateRecords([]);
        ui.renderRecordsTable();
        ui.renderDashboard();
        ui.showMessage('All data cleared.', 'info');
      }
    });
  }

  // Theme toggle
  const themeToggleBtn = document.getElementById('settings-theme-toggle');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = current === 'light' ? 'dark' : 'light';
      applyTheme(newTheme);
      ui.showMessage(`Switched to ${newTheme} mode`, 'info');
    });
  }

  // Render category tags
  renderCategories();

  if (addCategoryBtn) {
    addCategoryBtn.addEventListener('click', () => {
      const value = newCategoryInput?.value.trim();
      if (!value) {
        ui.showMessage('Please enter a category name', 'error');
        return;
      }

      const settings = loadSettings();
      if (settings.categories.includes(value)) {
        ui.showMessage('Category already exists', 'error');
        return;
      }

      settings.categories.push(value);
      saveSettings(settings);
      ui.populateCategorySelect();
      renderCategories();
      
      if (newCategoryInput) newCategoryInput.value = '';
      ui.showMessage('Category added!', 'success');
    });
  }
}

function attachTableEventListeners() {
  // Edit buttons
  document.querySelectorAll('.btn-edit').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const row = e.target.closest('.record-row');
      const id = row?.dataset.id;
      if (!id) return;

      const state = getState();
      const record = state.records.find(r => r.id === id);
      if (record) {
        ui.setFormData(record);
        ui.showTab('add');
      }
    });
  });

  // Delete buttons
  document.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const row = e.target.closest('.record-row');
      const id = row?.dataset.id;
      if (!id) return;

      ui.handleDeleteRecord(id);
    });
  });

  // Keyboard accessibility for table rows
  document.querySelectorAll('.record-row').forEach(row => {
    row.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const btn = e.target.closest('button');
        if (btn) btn.click();
      }
    });
  });
}

function renderCategories() {
  const settings = loadSettings();
  const container = document.getElementById('categories-list');
  
  if (!container) return;

  container.innerHTML = settings.categories.map(cat => `
    <div class="category-tag">
      ${cat}
      <button type="button" class="remove-category" data-category="${cat}" aria-label="Remove category">×</button>
    </div>
  `).join('');

  // Attach remove handlers
  document.querySelectorAll('.remove-category').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const cat = btn.dataset.category;
      const settings = loadSettings();
      settings.categories = settings.categories.filter(c => c !== cat);
      saveSettings(settings);
      ui.populateCategorySelect();
      renderCategories();
      ui.showMessage(`Category "${cat}" removed.`, 'info');
    });
  });
}

// Handle keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Ctrl/Cmd + S to show settings (custom shortcut)
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault();
    ui.showTab('settings');
  }

  // Fast filter: Alt + F to focus search
  if ((e.altKey || e.metaKey) && e.key === 'f') {
    e.preventDefault();
    document.getElementById('search-input')?.focus();
  }
});

// Warn before unload if there are unsaved changes (optional)
window.addEventListener('beforeunload', (e) => {
  // In this app, all changes are auto-saved, so we don't need to warn
  // But this is a good practice for other apps
});
