# YouTube API Terms of Service Compliance Guide

## **🚨 CRITICAL COMPLIANCE REQUIREMENTS**

This document outlines the **mandatory compliance requirements** for YouTube API usage in the Timeline Puzzle Game project.

### **Violation History & Remediation**
- **Date**: 2024 - YouTube API Terms of Service violation notice received
- **Issue**: Multiple Google Cloud projects used to circumvent quota restrictions
- **Action**: Complete remediation to single-project legitimate usage
- **Status**: ✅ COMPLIANT (as of latest checkpoint)

---

## **📋 Current Compliance Status**

### **✅ COMPLIANT PRACTICES**
1. **Single Project Usage**: All API keys from one Google Cloud project
2. **Centralized Key Management**: `youtubeApiKeys.js` system implemented
3. **Quota Respect**: Official 10,000 units/day limit observed
4. **No Circumvention**: No multiple projects for quota expansion
5. **Clean Codebase**: All hardcoded multi-keys removed

### **🔧 REMEDIATION COMPLETED**
- **Removed**: 149+ hardcoded API keys across multiple projects
- **Updated**: All crawler files to use centralized system
- **Deleted**: Test files with non-compliant API keys
- **Implemented**: Single-key rotation system

---

## **🎯 MANDATORY REQUIREMENTS**

### **1. Single Google Cloud Project**
- **Rule**: Use only ONE Google Cloud project for all API keys
- **Implementation**: All keys in `youtubeApiKeys.js` from same project
- **Verification**: Check Google Cloud Console for project consistency

### **2. Legitimate Quota Usage**
- **Daily Limit**: 10,000 units maximum
- **Reset Time**: Midnight Pacific Time
- **Monitoring**: Use `scripts/checkYouTubeQuota.js`
- **No Circumvention**: Never create additional projects for more quota

### **3. Centralized Key Management**
```javascript
// COMPLIANT: Use centralized system
const { getActiveKeys } = require('./youtubeApiKeys.js');
const YOUTUBE_API_KEYS = getActiveKeys();

// NON-COMPLIANT: Hardcoded keys
const API_KEY = "AIzaSy..."; // ❌ NEVER DO THIS
```

### **4. Code Compliance**
- **Import System**: All files must use `getActiveKeys()` import
- **No Hardcoding**: Zero hardcoded API keys in source files
- **Clean Tests**: No API keys in test files or utilities

---

## **⚠️ PROHIBITED PRACTICES**

### **❌ NEVER DO THESE**
1. **Multiple Projects**: Creating additional Google Cloud projects for quota
2. **Key Proliferation**: Hardcoding API keys in multiple files
3. **Quota Circumvention**: Any attempt to exceed 10,000 unit daily limit
4. **Key Sharing**: Using same key across different applications/domains
5. **Fake Projects**: Creating projects with misleading information

### **🚫 VIOLATION TRIGGERS**
- Using 2+ Google Cloud projects for same application
- Exceeding quotas through multiple API keys
- Automated key rotation across projects
- Sharing keys between unrelated services

---

## **🔍 COMPLIANCE VERIFICATION**

### **Daily Checks**
```bash
# Verify API key status
node checkSpecificApiKey.js

# Check quota usage
node scripts/checkYouTubeQuota.js

# Scan for hardcoded keys (should return 0 results)
grep -r "AIzaSy" --exclude="youtubeApiKeys.js" *.js
```

### **Weekly Audits**
1. **Review Google Cloud Console** for project consistency
2. **Audit codebase** for new hardcoded keys
3. **Monitor quota usage** patterns
4. **Verify crawler compliance** with centralized system

---

## **🛠️ IMPLEMENTATION GUIDE**

### **For New Crawlers**
```javascript
// Template for compliant crawler
const { getActiveKeys } = require('./youtubeApiKeys.js');

class CompliantCrawler {
  constructor() {
    this.apiKeys = getActiveKeys();
    this.currentKeyIndex = 0;
    this.quotaLimit = 10000; // Daily limit
  }
  
  async makeAPICall(endpoint, params) {
    const apiKey = this.apiKeys[this.currentKeyIndex];
    // Make API call with legitimate key
    // Track quota usage
  }
}
```

### **Migration Checklist**
- [ ] Remove all hardcoded API keys
- [ ] Import `getActiveKeys()` function
- [ ] Update API call logic
- [ ] Test with quota monitoring
- [ ] Verify Google Cloud Console shows single project
- [ ] Document compliance in code comments

---

## **📊 QUOTA MANAGEMENT**

### **Daily Limits**
- **Search Operations**: ~100 units each
- **Video Details**: ~1 unit each
- **Playlist Items**: ~1 unit each
- **Total Daily Budget**: 10,000 units

### **Cost-Effective Strategies**
1. **Batch Requests**: Combine multiple video IDs in single requests
2. **Cache Results**: Store API responses to avoid redundant calls
3. **Efficient Queries**: Use specific search parameters
4. **Progress Tracking**: Save state to resume after quota reset

### **Quota Monitoring**
```javascript
// Example quota tracking
let dailyUsage = 0;
const QUOTA_LIMIT = 10000;

function trackQuotaUsage(operationType, cost) {
  dailyUsage += cost;
  console.log(`Quota used: ${dailyUsage}/${QUOTA_LIMIT} (${operationType}: ${cost} units)`);
  
  if (dailyUsage >= QUOTA_LIMIT * 0.9) {
    console.warn('⚠️ Approaching quota limit!');
  }
}
```

---

## **🔒 SECURITY BEST PRACTICES**

### **API Key Protection**
- **Environment Variables**: Store keys in secure environment
- **Access Restrictions**: Limit keys to specific IPs/domains
- **Regular Rotation**: Update keys periodically
- **No Logging**: Never log API keys in console/files

### **Code Security**
```javascript
// SECURE: Environment-based configuration
const API_KEY = process.env.YOUTUBE_API_KEY || getActiveKeys()[0];

// INSECURE: Hardcoded in source
const API_KEY = "AIzaSyBOti4mM..."; // ❌ NEVER
```

---

## **📞 EMERGENCY PROCEDURES**

### **If Violation Notice Received**
1. **STOP**: Immediately halt all API usage
2. **AUDIT**: Run compliance verification scripts
3. **REMEDIATE**: Fix all identified violations
4. **DOCUMENT**: Record all changes made
5. **APPEAL**: Submit appeal with remediation proof

### **Appeal Template**
```
Subject: YouTube API Terms of Service Compliance Remediation

Dear YouTube API Team,

We received notice of Terms of Service violation regarding quota circumvention. 
We have immediately implemented the following remediation:

1. Consolidated to single Google Cloud project
2. Removed all hardcoded API keys (149+ keys removed)
3. Implemented centralized key management system
4. Updated all crawler files to use legitimate single-key system
5. Established quota monitoring and compliance verification

Current status: FULLY COMPLIANT
Verification: Available upon request

We commit to maintaining strict compliance going forward.

Best regards,
[Project Team]
```

---

## **📝 COMPLIANCE DOCUMENTATION**

### **Required Records**
- Google Cloud project configuration screenshots
- Quota usage logs and monitoring reports
- Codebase audit results (no hardcoded keys)
- Compliance verification script outputs

### **Reporting**
- **Daily**: Quota usage monitoring
- **Weekly**: Compliance verification
- **Monthly**: Full codebase audit
- **Quarterly**: Google Cloud Console review

---

## **🎯 SUCCESS METRICS**

### **Compliance KPIs**
- ✅ Zero hardcoded API keys in codebase
- ✅ Single Google Cloud project usage
- ✅ Daily quota under 10,000 units
- ✅ All crawlers using centralized system
- ✅ Regular compliance verification passing

### **Monitoring Dashboard**
- Current quota usage
- API call success rates
- Compliance verification status
- Security audit results

---

**Last Updated**: Checkpoint - Party Mode Clean Up and Music Videos  
**Compliance Status**: ✅ FULLY COMPLIANT  
**Next Review**: Weekly verification required 