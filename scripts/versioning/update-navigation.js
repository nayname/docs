#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const VERSION = process.argv[2];

if (!VERSION) {
  console.error('Usage: node update-navigation.js VERSION');
  process.exit(1);
}

const docsJsonPath = path.join(__dirname, '..', 'docs.json');
const docsJson = JSON.parse(fs.readFileSync(docsJsonPath, 'utf8'));

// Function to recursively update paths in navigation
function updatePaths(obj, fromPrefix, toPrefix) {
  if (typeof obj === 'string') {
    // Replace path prefix
    if (obj.startsWith(fromPrefix)) {
      return obj.replace(fromPrefix, toPrefix);
    }
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => updatePaths(item, fromPrefix, toPrefix));
  }

  if (typeof obj === 'object' && obj !== null) {
    const newObj = {};
    for (const key in obj) {
      if (key === 'page' || key === 'pages' || key === 'groups' || key === 'tabs' || key === 'anchors') {
        newObj[key] = updatePaths(obj[key], fromPrefix, toPrefix);
      } else {
        newObj[key] = obj[key];
      }
    }
    return newObj;
  }

  return obj;
}

// Initialize versions array if it doesn't exist
if (!docsJson.navigation.versions) {
  docsJson.navigation.versions = [];
}

// Check if this is the 'main' version
if (VERSION === 'main') {
  console.log('  Skipping navigation update for main version');
  process.exit(0);
}

// Check if version already exists
const existingVersionIndex = docsJson.navigation.versions.findIndex(v => v.version === VERSION);

// Get current navigation structure (from tabs or current structure)
let currentNavigation;
if (docsJson.navigation.tabs) {
  currentNavigation = { tabs: docsJson.navigation.tabs };
} else if (docsJson.navigation.versions && docsJson.navigation.versions.length > 0) {
  // Copy from the most recent version
  const latestVersion = docsJson.navigation.versions[0];
  currentNavigation = { ...latestVersion };
  delete currentNavigation.version;
} else {
  console.error(' No navigation structure found');
  process.exit(1);
}

// Create versioned navigation by updating all paths
const versionedNavigation = {
  version: VERSION,
  ...updatePaths(currentNavigation, 'docs/', `${VERSION}/`)
};

// Add or update the version in the navigation
if (existingVersionIndex >= 0) {
  docsJson.navigation.versions[existingVersionIndex] = versionedNavigation;
  console.log(` Updated navigation for version ${VERSION}`);
} else {
  // Add new version at the beginning (latest first)
  docsJson.navigation.versions.unshift(versionedNavigation);
  console.log(` Added navigation for version ${VERSION}`);
}

// Ensure 'main' version exists with current docs
const mainVersionIndex = docsJson.navigation.versions.findIndex(v => v.version === 'main');
const mainNavigation = {
  version: 'main',
  ...currentNavigation
};

if (mainVersionIndex >= 0) {
  docsJson.navigation.versions[mainVersionIndex] = mainNavigation;
} else {
  docsJson.navigation.versions.push(mainNavigation);
}

// Write updated docs.json
fs.writeFileSync(docsJsonPath, JSON.stringify(docsJson, null, 2) + '\n');
console.log(` Navigation updated for version ${VERSION}`);
console.log(` Updated docs.json with ${docsJson.navigation.versions.length} versions`);