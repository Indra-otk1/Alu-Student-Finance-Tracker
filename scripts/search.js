// search.js - Safe regex compilation and search functionality

export function compileRegex(input, flags = 'i') {
  try {
    return input ? new RegExp(input, flags) : null;
  } catch (e) {
    console.warn('Invalid regex pattern:', input, e.message);
    return null;
  }
}

export function highlight(text, re) {
  if (!re || !text) return text;
  
  try {
    return String(text).replace(re, (match) => `<mark>${match}</mark>`);
  } catch (e) {
    console.warn('Highlight failed:', e);
    return text;
  }
}

export function highlightSafe(text, re) {
  if (!re || !text) return text;
  
  // Create a temporary element to safely escape HTML
  const div = document.createElement('div');
  div.textContent = String(text);
  const safeText = div.innerHTML;
  
  try {
    return safeText.replace(re, (match) => {
      // Escape the match before wrapping
      const escaped = match
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      return `<mark>${escaped}</mark>`;
    });
  } catch (e) {
    console.warn('Safe highlight failed:', e);
    return safeText;
  }
}

export function searchRecords(records, pattern, caseSensitive = false) {
  const re = compileRegex(pattern, caseSensitive ? '' : 'i');
  if (!re) return [];
  
  return records.filter(record => {
    return (
      re.test(record.description) ||
      re.test(record.category) ||
      re.test(String(record.amount)) ||
      re.test(record.date)
    );
  });
}

export function highlightRecord(record, pattern, caseSensitive = false) {
  const re = compileRegex(pattern, caseSensitive ? '' : 'i');
  if (!re) return record;
  
  return {
    ...record,
    description: highlightSafe(record.description, re),
    category: highlightSafe(record.category, re),
    amount: highlightSafe(String(record.amount), re),
    date: highlightSafe(record.date, re)
  };
}
