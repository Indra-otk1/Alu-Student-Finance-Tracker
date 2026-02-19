# Student Finance Tracker

A responsive, accessible student finance app built with vanilla HTML, CSS, and JavaScript. No frameworks, no dependencies.

## Features

- **Dashboard** - Overview of total spending, 7-day trends, and top spending categories
- **Auto-Save** - All changes persist automatically to browser localStorage
- **Regex-Powered Search** - Advanced pattern matching with case-sensitive options
- **Import/Export** - JSON round-trip with full validation
- **Multi-Currency** - Support for USD, EUR, GBP with configurable exchange rates
- **Settings** - Customize categories, spending caps, and themes
- **Responsive Design** - Mobile-first layout with 3+ breakpoints
- **Fully Accessible** - Keyboard navigation, ARIA labels, skip links, color contrast
- **Semantic HTML** - Proper landmarks, headings, and form structure

## Quick Start

```bash
git clone https://github.com/yourname/student-finance-tracker.git
cd student-finance-tracker
python -m http.server 8000  # or: npx http-server
# Open http://localhost:8000
```

## Project Structure

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

## Data Model

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

## Validation Rules

Regex patterns for description, amount, date, category, and duplicate word detection.
- Safe regex compilation with try/catch
- Case-sensitive search toggle

## Search Examples

Use regex patterns like `coffee|tea`, `^Food`, `2025-09` in the search box.

### Import/Export
- **Format**: Valid JSON array of transaction objects
- **Validation**: Checks required fields before import
- **Error Handling**: Graceful fallback with user feedback
- **Filename**: `finance-tracker-export-YYYY-MM-DD.json`

## Testing

Open `tests/tests.html` to run automated validation tests. Manual testing: add/edit/delete transactions, search, sort, export/import, keyboard navigation, responsive layouts.

## Dashboard

Shows total spent, last 7 days balance, top category, and transaction count.

## Sample Data

`seed.json` includes 15 sample transactions. Import via Settings > Import from JSON.

## Deployment

Push to GitHub, enable Pages from Settings, select main branch. Live at `https://your-username.github.io/student-finance-tracker/`

## Contact

**GitHub**: [Indra-otk1](https://github.com/Indra-otk1) | **Email**: e.singizwa@alustudent.com  


## Demo

[Link to demo video](https://youtube.com) - Shows keyboard navigation, regex search, and import/export.
