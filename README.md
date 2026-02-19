# 💰 Student Finance Tracker

A fully responsive, accessible student finance management web application built with vanilla HTML, CSS, and JavaScript. Track transactions, manage budgets, search spending patterns, and export financial data—all without frameworks.

## 🎯 Features

- **📊 Dashboard** - Overview of total spending, 7-day trends, and top spending categories
- **💾 Auto-Save** - All changes persist automatically to browser localStorage
- **🔍 Regex-Powered Search** - Advanced pattern matching with case-sensitive options
- **📤 Import/Export** - JSON round-trip with full validation
- **💱 Multi-Currency** - Support for USD, EUR, GBP with configurable exchange rates
- **🎛️ Settings** - Customize categories, spending caps, and themes
- **📱 Responsive Design** - Mobile-first layout with 3+ breakpoints
- **♿ Fully Accessible** - Keyboard navigation, ARIA labels, skip links, color contrast
- **🎨 Semantic HTML** - Proper landmarks, headings, and form structure

## 🚀 Quick Start

### Option 1: Live Demo (GitHub Pages)
Visit: [your-github-pages-url.com](https://your-github-pages-url.com)

### Option 2: Local Development
```bash
# Clone the repository
git clone https://github.com/yourname/student-finance-tracker.git
cd student-finance-tracker

# Open in browser (any local server works)
# Using Python:
python -m http.server 8000

# Using Node.js (http-server):
npx http-server

# Then open http://localhost:8000 in your browser
```

## 📁 Project Structure

```
student-finance-tracker/
├── index.html              # Main application page
├── styles/
│   ├── main.css           # Core styles (mobile-first)
│   └── responsive.css     # Breakpoints (768px, 1024px, 1440px)
├── scripts/
│   ├── main.js            # App initialization & event handling
│   ├── state.js           # Application state management
│   ├── storage.js         # localStorage persistence
│   ├── validators.js      # Input validation with regex
│   ├── search.js          # Search & highlight utilities
│   └── ui.js              # UI rendering functions
├── tests/
│   └── tests.html         # Validation test suite
├── seed.json              # Sample data (15 transactions)
└── README.md              # This file
```

## 🔐 Data Model

Each transaction record includes:
```javascript
{
  "id": "rec_001",                                // Unique identifier
  "description": "Lunch at cafeteria",            // Item description
  "amount": 12.50,                                // Numeric amount
  "category": "Food",                             // Transaction category
  "date": "2025-09-25",                           // Date (YYYY-MM-DD)
  "createdAt": "2025-09-25T14:30:00.000Z",       // ISO timestamp
  "updatedAt": "2025-09-25T14:30:00.000Z"        // Last modified
}
```

## ✅ Validation Rules

### 4+ Regex Patterns Implemented

| Rule | Pattern | Example |
|------|---------|---------|
| **Description** | `/^\S(?:.*\S)?$/` | "Lunch at cafeteria" (no leading/trailing spaces) |
| **Amount** | `/^(0\|[1-9]\d*)(\.\d{1,2})?$/` | "12.50", "45", "0.99" |
| **Date** | `/^\d{4}-(0[1-9]\|1[0-2])-(0[1-9]\|[12]\d\|3[01])$/` | "2025-09-25" |
| **Category** | `/^[A-Za-z]+(?:[ -][A-Za-z]+)*$/` | "Food", "Personal-Care" |
| **Duplicate Words (Advanced)** | `/\b(\w+)\s+\1\b/` | Detects "coffee coffee" ❌ |

### Advanced Regex Features
- **Backreference** - `/\b(\w+)\s+\1\b/` detects duplicate consecutive words
- **Negative Lookahead** - Can extend to validate password strength
- **Case-Insensitive** - Toggle via checkbox for flexible searching

## 🔍 Search Examples

Try these patterns in the search box:

```regex
# Beverage search
coffee|tea

# Amounts with cents
\.\d{2}$

# Specific month
2025-09

# Category prefix
^Food

# Duplicate detection (advanced)
\b(\w+)\s+\1\b
```

## ♿ Accessibility Features

- ✅ **Semantic HTML** - `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`, landmarks
- ✅ **Heading Hierarchy** - Proper h1-h6 structure
- ✅ **ARIA Labels** - `aria-label`, `aria-live`, `role="status"`, `role="tab"`
- ✅ **Keyboard Navigation**
  - Tab through all interactive elements
  - Arrow keys to switch tabs
  - Enter to submit forms
  - Space to toggle checkboxes
  - Skip-to-content link (focus first)
- ✅ **Focus Indicators** - Clear 2px outline on all interactive elements
- ✅ **Color Contrast** - WCAG AA compliant (4.5:1 for text)
- ✅ **Form Labels** - All inputs have associated labels
- ✅ **Error Messages** - Accessible inline validation with `aria-live` regions
- ✅ **Dark Mode** - Respects `prefers-color-scheme` media query
- ✅ **Motion** - Respects `prefers-reduced-motion`

## 📱 Responsive Breakpoints

| Device | Width | Layout Changes |
|--------|-------|-----------------|
| **Mobile** | <768px | Single column, touch-friendly buttons, stacked navigation |
| **Tablet** | 768px-1024px | 2-column grid, flexible forms, improved spacing |
| **Desktop** | ≥1024px | 4-column stats grid, full table display, max-width container |

## 💾 Data Persistence

### localStorage
- **Key**: `sft:data` - stores transaction array
- **Key**: `sft:settings` - stores user preferences
- Auto-saves on every change (add/edit/delete)
- Persists across browser sessions

### Import/Export
- **Format**: Valid JSON array of transaction objects
- **Validation**: Checks required fields before import
- **Error Handling**: Graceful fallback with user feedback
- **Filename**: `finance-tracker-export-YYYY-MM-DD.json`

## 🛠️ JavaScript Architecture

### Modular ES6 Structure
```javascript
// storage.js
- load() / save()
- loadSettings() / saveSettings()
- exportJSON() / validateImportData()

// state.js
- initializeState()
- addRecord() / updateRecord() / deleteRecord()
- getFilteredAndSortedRecords()

// validators.js
- validateDescription()
- validateAmount()
- validateDate()
- validateCategory()
- validateAll() (combined)

// search.js
- compileRegex() (safe)
- highlight() / highlightSafe()
- searchRecords()

// ui.js
- renderDashboard() / renderRecordsTable()
- handleAddOrUpdateRecord() / handleDeleteRecord()
- showTab() / showMessage()

// main.js
- Event delegation & handlers
- Tab navigation with arrow keys
- Form submission & validation
- Search with real-time results
```

### Error Handling
```javascript
// Safe regex compilation
try {
  return input ? new RegExp(input, flags) : null;
} catch (e) {
  console.warn('Invalid regex:', e.message);
  return null;
}
```

## 🎨 Design System

### Color Palette
```css
--color-danger: #ef4444       /* Destructive actions */
--color-bg: #f9fafb           /* Background */
--color-surface: #ffffff      /* Cards & surfaces */
--color-text: #1f2937         /* Text */
--color-mark-bg: #fef08a      /* Search highlights */
```

### Typography
- **Font Stack**: System fonts for performance (SF Pro, Segoe UI, etc.)
- **Line Height**: 1.6 for readability
- **Heading Scale**: 1.25x (h1: 1.875rem, h2: 1.5rem, h3: 1.25rem)

### Animations
- **Fade In**: Tab transitions (300ms)
- **Slide Down**: Message notifications (300ms)
- **Respects**: `prefers-reduced-motion: reduce`

## 🧪 Testing

### Validation Test Suite
Open `tests/tests.html` in browser to run automated tests:

```bash
# Tests include:
✓ Description validation (leading/trailing spaces, duplicates)
✓ Amount validation (decimals, negatives)
✓ Date validation (format, invalid dates, future dates)
✓ Category validation (format, special characters)
✓ Regex compilation (safe error handling)
✓ Search functionality (case sensitivity, patterns)
✓ Full form validation
```

### Manual Testing Checklist
- [ ] Add transaction with valid and invalid data
- [ ] Edit existing transaction
- [ ] Delete transaction with confirmation
- [ ] Search with various regex patterns
- [ ] Sort by date/description/amount (both directions)
- [ ] Export data to JSON
- [ ] Import data from JSON file
- [ ] Clear all data
- [ ] Keyboard-only navigation (Tab through all elements)
- [ ] Test on mobile (360px), tablet (768px), desktop (1440px)
- [ ] Test dark mode (Windows dark theme or browser dev tools)

## 🔄 Keyboard Map

| Key/Shortcut | Action |
|--------------|--------|
| <kbd>Tab</kbd> | Navigate through interactive elements |
| <kbd>Shift + Tab</kbd> | Navigate backwards |
| <kbd>Arrow Keys</kbd> | Switch between tabs |
| <kbd>Enter</kbd> | Submit form / Click button |
| <kbd>Space</kbd> | Toggle checkbox |
| <kbd>Ctrl/Cmd + S</kbd> | Open Settings tab |
| <kbd>Alt/Cmd + F</kbd> | Focus search input |
| <kbd>Escape</kbd> | (Future feature) Close modals |

## 📊 Statistics Dashboard

The dashboard shows:
- **Total Spent** - Sum of all transactions
- **Last 7 Days** - Sum of transactions from past week
- **Top Category** - Category with highest total spending
- **Total Records** - Number of transactions

*Future: Spending cap warnings, trend charts, budget goals*

## 🌐 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ⚠️ IE 11 (not tested, uses ES6 modules)

## 📚 Curriculum Alignment

### Learning Outcomes Met

#### 1. **Regex Validation & Search** ✅
- 4 basic patterns (description, amount, date, category)
- 1 advanced pattern (duplicate words with backreference)
- Safe regex compiler with try/catch
- Real-time search with highlighting

#### 2. **HTML/CSS Responsive Design** ✅
- Semantic structure (landmarks, headings, forms)
- Mobile-first layout
- 3+ breakpoints (360px, 768px, 1024px, 1440px)
- Smooth animations and transitions
- Color contrast WCAG AA

#### 3. **JavaScript & DOM Manipulation** ✅
- Event delegation (tab navigation, form submit, search)
- DOM updates without framework
- Sorting and filtering
- Modular ES6 code structure
- Error handling throughout

#### 4. **Data Persistence** ✅
- localStorage auto-save
- JSON import/export with validation
- Settings persistence
- Graceful error handling for bad data

#### 5. **Accessibility (a11y)** ✅
- Keyboard navigation (all features)
- Visible focus indicators
- ARIA live regions (status messages)
- Skip to main content link
- Adequate color contrast
- Semantic form structure

## 📝 Sample Data

15 diverse transactions included in `seed.json`:
- Various amounts (0.99 - 5500.00)
- All categories represented
- Spread across September 2025
- Includes edge cases (duplicate words, multiple categories, high amounts)

**To load sample data:**
1. Open the app
2. Go to Settings tab
3. Click "Import from JSON"
4. Select `seed.json` file

## 🚀 Deployment

### GitHub Pages Setup
```bash
# 1. Push to GitHub
git push origin main

# 2. Go to Settings > Pages
# 3. Select "Deploy from branch"
# 4. Choose "main" branch, "/" root
# 5. Save and wait ~3 minutes

# Your app is now live at:
# https://your-username.github.io/student-finance-tracker/
```

## 🤝 Contributing

This is an individual student project. No external contributions accepted.

## 🙋 Questions & Support

**GitHub**: [Your GitHub Profile](https://github.com/yourname)  
**Email**: your.email@example.com  

## 📄 License

This project is part of a coursework submission. All code is original work.

---

**Built with** ❤️ **using vanilla HTML, CSS, and JavaScript**  
**No frameworks. No dependencies. Just clean code.**

---

## 📋 Milestone Checklist

- [x] M1 – Wireframes & Data Model
- [x] M2 – Semantic HTML & Base CSS
- [x] M3 – Forms & Regex Validation
- [x] M4 – Table, Sorting, Search
- [x] M5 – Stats Dashboard
- [x] M6 – Persistence & Import/Export
- [ ] M7 – Demo Video & Polish
- [ ] Final a11y Audit

## 🎬 Demo Video

[Link to unlisted YouTube demo video]
- ⏱️ 2-3 minutes
- Shows keyboard navigation
- Regex search edge cases
- Import/export round trip
