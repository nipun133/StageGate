const fs = require('fs');
const path = require('path');
const allConceptExamples = require('./concept_examples');

const TOPIC_ORDER = [
  { id: 'general_knowledge', title: '0. General Knowledge', folder: 'general_knowledge' },
  { id: 'select_statement', title: '1. SELECT Statement', folder: 'select_statement' },
  { id: 'where_clause', title: '2. WHERE Clause', folder: 'where_clause' },
  { id: 'order_by_clause', title: '3. ORDER BY Clause', folder: 'order_by_clause' },
  { id: 'character_functions', title: '4. Character Functions', folder: 'character_functions' },
  { id: 'numeric_functions', title: '5. Numeric Functions', folder: 'numeric_functions' },
  { id: 'date_functions', title: '6. Date Functions', folder: 'date_functions' },
  { id: 'conversion_functions', title: '7. Conversion Functions', folder: 'conversion_functions' },
  { id: 'group_functions', title: '8. Group Functions & Aggregations', folder: 'group_functions' },
  { id: 'joins', title: '9. Joins & Relationships', folder: 'joins' },
  { id: 'subqueries', title: '10. Subqueries & EXISTS', folder: 'subqueries' },
  { id: 'set_operators', title: '11. Set Operators', folder: 'set_operators' },
  { id: 'dml_and_transactions', title: '12. DML & Transactions', folder: 'dml_and_transactions' },
  { id: 'ddl_and_constraints', title: '13. DDL & Integrity Constraints', folder: 'ddl_and_constraints' },
  { id: 'views_and_other_objects', title: '14. Views & Schema Objects', folder: 'views_and_other_objects' },
  { id: 'advanced_sql', title: '15. Advanced SQL (Window Functions)', folder: 'advanced_sql' }
];

const topicsData = [];

for (const t of TOPIC_ORDER) {
  const notePath = path.join(__dirname, 'SQL', t.folder, 'NOTES.md');
  if (fs.existsSync(notePath)) {
    const rawContent = fs.readFileSync(notePath, 'utf8');
    topicsData.push({
      id: t.id,
      title: t.title,
      folder: t.folder,
      content: rawContent,
      examples: allConceptExamples[t.folder] || {}
    });
  } else {
    console.warn(`Warning: ${notePath} not found!`);
  }
}

const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const buildTimestamp = Date.now();

const dataJsPath = path.join(publicDir, 'topics-data.js');
const jsContent = `window.STAGE_GATE_DATA = ${JSON.stringify(topicsData, null, 2)};`;
fs.writeFileSync(dataJsPath, jsContent, 'utf8');

const indexPath = path.join(publicDir, 'index.html');
if (fs.existsSync(indexPath)) {
  let html = fs.readFileSync(indexPath, 'utf8');
  html = html.replace(/src="topics-data\.js(?:\?v=\d+)?"/g, `src="topics-data.js?v=${buildTimestamp}"`);
  fs.writeFileSync(indexPath, html, 'utf8');
}

console.log(`Successfully compiled ${topicsData.length} topics with clean markdown and concept examples object. Cache-buster: ${buildTimestamp}`);
