#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');

// Google Sheets configuration
const SHEET_ID = '1OGscheUSh-g15p7mNYjSaxI05E8O_3R3tDK0IwXaczk';

async function fetchGoogleSheetData() {
  return new Promise((resolve, reject) => {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;

    https.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          // Parse Google's JSON response (wrapped in google.visualization.Query.setResponse())
          const jsonMatch = data.match(/google\.visualization\.Query\.setResponse\((.*)\);?$/);
          if (!jsonMatch) {
            throw new Error('Invalid response format from Google Sheets');
          }

          const parsed = JSON.parse(jsonMatch[1]);
          resolve(parsed);
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', reject);
  });
}

function parseSheetData(data) {
  const rows = data.table.rows;
  const cols = data.table.cols;

  // Convert to our format
  const parsed = rows.map(row => {
    const obj = {};
    cols.forEach((col, index) => {
      const value = row.c[index] ? row.c[index].v : null;
      const label = col.label || col.id;

      // Type conversion based on column name
      if (label === 'eip') {
        obj[label] = parseInt(value) || 0;
      } else if (label === 'critical') {
        obj[label] = value === true || value === 'TRUE';
      } else if (label === 'geth' || label === 'priority' || label === 'triage') {
        // Skip these columns
        return;
      } else {
        obj[label] = value || '';
      }
    });
    return obj;
  });

  // Filter out any empty objects
  return parsed.filter(item => item.eip);
}

async function snapshotEIPData(targetVersion) {
  console.log(' Fetching EIP data from Google Sheets...');

  try {
    const data = await fetchGoogleSheetData();
    const eipData = parseSheetData(data);

    console.log(`✓ Retrieved ${eipData.length} EIP entries`);

    // Create the snapshot with metadata
    const snapshot = {
      version: targetVersion || 'current',
      timestamp: new Date().toISOString(),
      sourceSheet: SHEET_ID,
      data: eipData
    };

    // Save to a JSON file
    const outputPath = targetVersion
      ? path.join(targetVersion, 'eip-data-snapshot.json')
      : path.join('tmp', 'eip-data-snapshot.json');

    // Ensure directory exists
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(outputPath, JSON.stringify(snapshot, null, 2));
    console.log(`✓ Saved EIP snapshot to ${outputPath}`);

    return snapshot;
  } catch (error) {
    console.error('✗ Failed to snapshot EIP data:', error.message);
    throw error;
  }
}

// Main execution
if (require.main === module) {
  const targetVersion = process.argv[2];

  snapshotEIPData(targetVersion)
    .then(() => {
      console.log('✓ EIP data snapshot complete');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error:', error);
      process.exit(1);
    });
}

module.exports = { snapshotEIPData };