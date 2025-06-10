// ========================================
// YOUTUBE API CONFIGURATION - SINGLE PROJECT COMPLIANCE
// ========================================
// IMPORTANT: This complies with YouTube API Terms of Service
// - Uses only ONE project ID per API client
// - No quota circumvention via multiple projects
// - Legitimate usage within API limits

const YOUTUBE_API_KEYS = {
  
  // ==========================================
  // SINGLE PROJECT CONFIGURATION
  // ==========================================
  // Project: movie-crawler11
  // Status: ACTIVE (within terms of service)
  
  primary: [
    { id: 'mc-primary', key: 'AIzaSyB86xrw1w8OlHAIX5I1kG3-nzM4bcrCVm0', status: 'ACTIVE' }
  ]
};

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

// Get all keys as a flat array
function getAllKeys() {
  const allKeys = [];
  Object.values(YOUTUBE_API_KEYS).forEach(tier => {
    tier.forEach(keyObj => allKeys.push(keyObj.key));
  });
  return allKeys;
}

// Get only active keys
function getActiveKeys() {
  const activeKeys = [];
  Object.values(YOUTUBE_API_KEYS).forEach(tier => {
    tier.forEach(keyObj => {
      if (keyObj.status === 'ACTIVE') {
        activeKeys.push(keyObj.key);
      }
    });
  });
  return activeKeys;
}

// Get summary statistics
function getKeySummary() {
  let total = 0, active = 0, exhausted = 0, invalid = 0;
  
  Object.values(YOUTUBE_API_KEYS).forEach(tier => {
    tier.forEach(keyObj => {
      total++;
      switch(keyObj.status) {
        case 'ACTIVE': active++; break;
        case 'QUOTA_EXHAUSTED': exhausted++; break;
        case 'INVALID': invalid++; break;
      }
    });
  });
  
  return {
    total,
    active,
    exhausted,
    invalid,
    availableQuota: active * 10000
  };
}

// ==========================================
// EXPORTS
// ==========================================

module.exports = {
  YOUTUBE_API_KEYS,
  getAllKeys,
  getActiveKeys,
  getKeySummary
};

// ==========================================
// COMPLIANCE NOTICE
// ==========================================
console.log('✅ YOUTUBE API CONFIGURATION - TERMS OF SERVICE COMPLIANT');
const stats = getKeySummary();
console.log(`🔑 Total keys: ${stats.total}`);
console.log(`✅ Active keys: ${stats.active}`);
console.log(`💰 Daily quota: ${stats.availableQuota.toLocaleString()} units`);
console.log(`📏 Legitimate usage within API limits`); 