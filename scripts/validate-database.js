/**
 * Database validation script
 * Run with: node scripts/validate-database.js
 */

const fs = require('fs');
const path = require('path');

// Load the database
const databasePath = path.join(__dirname, '../src/data/religious-sites.json');
let database;

try {
  const rawData = fs.readFileSync(databasePath, 'utf8');
  database = JSON.parse(rawData);
} catch (error) {
  console.error('❌ Failed to load database:', error.message);
  process.exit(1);
}

// Validation functions
function validateSite(site, index) {
  const errors = [];
  
  // Required fields
  if (!site.id) errors.push('Missing id');
  if (!site.name) errors.push('Missing name');
  if (!site.type || !['temple', 'gurdwara'].includes(site.type)) {
    errors.push('Invalid or missing type');
  }
  if (!site.location) errors.push('Missing location');
  if (!site.description) errors.push('Missing description');
  if (!site.history) errors.push('Missing history');
  if (!site.timings) errors.push('Missing timings');
  if (!site.facilities || !Array.isArray(site.facilities)) {
    errors.push('Missing or invalid facilities');
  }
  
  // Location validation
  if (site.location) {
    if (!site.location.address) errors.push('Missing location.address');
    if (!site.location.city) errors.push('Missing location.city');
    if (!site.location.coordinates) errors.push('Missing location.coordinates');
    
    if (site.location.coordinates) {
      if (typeof site.location.coordinates.lat !== 'number') {
        errors.push('Invalid latitude');
      }
      if (typeof site.location.coordinates.lng !== 'number') {
        errors.push('Invalid longitude');
      }
    }
  }
  
  // Timings validation
  if (site.timings) {
    if (!site.timings.weekdays) errors.push('Missing weekday timings');
    if (!site.timings.weekends) errors.push('Missing weekend timings');
  }
  
  return errors;
}

// Run validation
console.log('🔍 Validating HoshiarpurSakhi Religious Sites Database...\n');

if (!database.sites || !Array.isArray(database.sites)) {
  console.error('❌ Invalid database structure - missing sites array');
  process.exit(1);
}

const totalSites = database.sites.length;
let validSites = 0;
let temples = 0;
let gurdwaras = 0;
let sitesWithContact = 0;
let sitesWithImages = 0;
const invalidSites = [];

database.sites.forEach((site, index) => {
  const errors = validateSite(site, index);
  
  if (errors.length === 0) {
    validSites++;
    
    if (site.type === 'temple') temples++;
    if (site.type === 'gurdwara') gurdwaras++;
    if (site.contact && (site.contact.phone || site.contact.email)) sitesWithContact++;
    if (site.images && site.images.length > 0) sitesWithImages++;
  } else {
    invalidSites.push({
      index,
      id: site.id || `site-${index}`,
      errors
    });
  }
});

// Display results
console.log('📊 Database Statistics:');
console.log(`   Total Sites: ${totalSites}`);
console.log(`   Valid Sites: ${validSites}`);
console.log(`   Invalid Sites: ${invalidSites.length}`);
console.log(`   Temples: ${temples}`);
console.log(`   Gurdwaras: ${gurdwaras}`);
console.log(`   Sites with Contact: ${sitesWithContact}`);
console.log(`   Sites with Images: ${sitesWithImages}`);
console.log();

// Check requirements
const requirementsMet = [];
const requirementsFailed = [];

if (totalSites >= 40) {
  requirementsMet.push(`✅ Has 40+ sites (${totalSites} sites)`);
} else {
  requirementsFailed.push(`❌ Needs 40+ sites (only ${totalSites} sites)`);
}

if (temples > 0 && gurdwaras > 0) {
  requirementsMet.push(`✅ Contains both temples (${temples}) and gurdwaras (${gurdwaras})`);
} else {
  requirementsFailed.push(`❌ Must contain both temples and gurdwaras`);
}

if (validSites === totalSites) {
  requirementsMet.push(`✅ All sites have complete required fields`);
} else {
  requirementsFailed.push(`❌ ${invalidSites.length} sites have missing or invalid fields`);
}

const contactPercentage = Math.round((sitesWithContact / totalSites) * 100);
if (contactPercentage >= 50) {
  requirementsMet.push(`✅ ${contactPercentage}% of sites have contact information`);
} else {
  requirementsFailed.push(`❌ Only ${contactPercentage}% of sites have contact information (should be 50%+)`);
}

// Display requirements check
console.log('📋 Requirements Check:');
requirementsMet.forEach(req => console.log(`   ${req}`));
requirementsFailed.forEach(req => console.log(`   ${req}`));
console.log();

// Display invalid sites if any
if (invalidSites.length > 0) {
  console.log('❌ Invalid Sites:');
  invalidSites.forEach(site => {
    console.log(`   Site ${site.index} (${site.id}):`);
    site.errors.forEach(error => console.log(`     - ${error}`));
  });
  console.log();
}

// Final result
if (requirementsFailed.length === 0) {
  console.log('🎉 Database validation PASSED! All requirements met.');
  process.exit(0);
} else {
  console.log('💥 Database validation FAILED! Please fix the issues above.');
  process.exit(1);
}