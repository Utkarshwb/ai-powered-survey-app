# Security Documentation - READ BEFORE PRODUCTION

## 🚨 CRITICAL SECURITY ACTIONS NEEDED

### 1. Regenerate ALL API Keys
- **Gemini API Key**: Go to Google AI Studio and create new key
- **Resend API Key**: Go to Resend dashboard and create new key  
- **NextAuth Secret**: Generate new 32-character random string

### 2. Remove Development Files
```bash
rm -f app/api/ai/test-questions/route.ts
rm -f app/api/ai/test-insights/route.ts
rm -f test-*.js
```

### 3. Environment Security
- Move sensitive keys to `.env.local` (not tracked by git)
- Use different keys for production vs development
- Never commit actual API keys to git

### 4. Add Rate Limiting (Production)
```typescript
// Add to API routes:
import rateLimit from "express-rate-limit"

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
})
```

### 5. Survey Access Control
Current: Anyone with survey ID can access
Recommended: Add optional password protection for surveys

### 6. Database Security Checklist
- ✅ RLS enabled on all tables
- ✅ User isolation enforced 
- ✅ No direct database access
- ✅ Audit logging enabled

### 7. Production Deployment
- Use HTTPS only
- Set secure cookie flags
- Enable CORS restrictions
- Use environment-specific API keys

## Current Security Rating: 7/10
**Issues**: Exposed API keys, test endpoints, no rate limiting
**Strengths**: Strong authentication, RLS, user isolation
