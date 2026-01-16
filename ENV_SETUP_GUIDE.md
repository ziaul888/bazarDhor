# Environment Setup Guide

## 📋 Overview

This guide explains how to set up environment variables for the Fresh Market Finder application in both development and production environments.

## 🗂️ Environment Files

### **Available Files:**
- `.env.example` - Template with all available variables
- `.env.local` - Development environment (git-ignored)
- `.env.production` - Production environment (git-ignored)

### **File Priority:**
1. `.env.local` (highest priority for development)
2. `.env.production` (used in production builds)
3. `.env` (base configuration)

## 🚀 Quick Start

### **1. Development Setup**

```bash
# Copy the example file
cp .env.example .env.local

# Edit the file with your values
nano .env.local  # or use your preferred editor
```

### **2. Production Setup**

```bash
# Copy the example file
cp .env.example .env.production

# Edit with production values
nano .env.production
```

## 🔑 Required Variables

### **Minimum Required for Development:**

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### **Additional Required for Production:**

```env
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_API_URL=https://api.your-domain.com/api
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key
DATABASE_URL=your_database_url
JWT_SECRET=your_strong_secret
```

## 📚 Variable Categories

### **1. App Configuration**

```env
NEXT_PUBLIC_APP_NAME="Fresh Market Finder"
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

**Usage:**
```typescript
import { env } from '@/lib/env';

console.log(env.app.name);  // "Fresh Market Finder"
console.log(env.app.url);   // "http://localhost:3000"
```

### **2. API Configuration**

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_API_TIMEOUT=10000
```

**Usage:**
```typescript
import { env } from '@/lib/env';

const apiUrl = env.api.url;      // "http://localhost:3001/api"
const timeout = env.api.timeout;  // 10000
```

### **3. Authentication**

```env
NEXT_PUBLIC_AUTH_TOKEN_KEY=auth_token
NEXT_PUBLIC_SESSION_TIMEOUT=3600000
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
```

**Usage:**
```typescript
import { env } from '@/lib/env';

const tokenKey = env.auth.tokenKey;  // "auth_token"
```

### **4. Google Maps**

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key
NEXT_PUBLIC_DEFAULT_MAP_CENTER_LAT=40.7128
NEXT_PUBLIC_DEFAULT_MAP_CENTER_LNG=-74.0060
NEXT_PUBLIC_DEFAULT_MAP_ZOOM=12
```

**Get API Key:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Maps JavaScript API
4. Create credentials (API Key)
5. Restrict the key to your domain

**Usage:**
```typescript
import { env } from '@/lib/env';

const apiKey = env.maps.apiKey;
const center = env.maps.defaultCenter;  // { lat: 40.7128, lng: -74.0060 }
```

### **5. Feature Flags**

```env
NEXT_PUBLIC_ENABLE_PWA=true
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true
NEXT_PUBLIC_ENABLE_GEOLOCATION=true
NEXT_PUBLIC_ENABLE_OFFLINE_MODE=true
```

**Usage:**
```typescript
import { env } from '@/lib/env';

if (env.features.pwa) {
  // Enable PWA features
}
```

### **6. Analytics**

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

**Get Measurement ID:**
1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new property
3. Get your Measurement ID (starts with G-)

### **7. Database**

```env
DATABASE_URL=postgresql://user:password@host:5432/database
```

**Formats:**
- PostgreSQL: `postgresql://user:password@host:5432/database`
- MySQL: `mysql://user:password@host:3306/database`
- MongoDB: `mongodb://user:password@host:27017/database`

### **8. Email Service**

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your_api_key
EMAIL_FROM=noreply@freshmarketfinder.com
```

**Providers:**
- **SendGrid**: [sendgrid.com](https://sendgrid.com/)
- **Mailgun**: [mailgun.com](https://mailgun.com/)
- **AWS SES**: [aws.amazon.com/ses](https://aws.amazon.com/ses/)

### **9. File Storage (AWS S3)**

```env
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name
```

**Setup:**
1. Create AWS account
2. Create S3 bucket
3. Create IAM user with S3 permissions
4. Get access keys

### **10. Payment (Stripe)**

```env
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Get Keys:**
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Get API keys from Developers section
3. Use test keys for development
4. Use live keys for production

### **11. Error Tracking (Sentry)**

```env
SENTRY_DSN=https://...@sentry.io/...
SENTRY_ENVIRONMENT=production
```

**Setup:**
1. Create account at [sentry.io](https://sentry.io/)
2. Create new project
3. Get DSN from project settings

## 🔒 Security Best Practices

### **1. Never Commit Secrets**

```bash
# .gitignore already includes:
.env.local
.env.production
.env*.local
```

### **2. Use Strong Secrets**

```bash
# Generate strong JWT secret
openssl rand -base64 32

# Generate strong password
openssl rand -base64 24
```

### **3. Rotate Keys Regularly**

- Change JWT secrets every 90 days
- Rotate API keys quarterly
- Update passwords monthly

### **4. Use Different Keys per Environment**

- Development: Use test/sandbox keys
- Staging: Use separate keys
- Production: Use live keys only

### **5. Restrict API Keys**

- Add domain restrictions
- Limit API permissions
- Use IP whitelisting when possible

## 🌍 Environment-Specific Configuration

### **Development**

```env
NODE_ENV=development
NEXT_PUBLIC_ENABLE_DEVTOOLS=true
NEXT_PUBLIC_LOG_LEVEL=debug
NEXT_PUBLIC_ENABLE_ANALYTICS=false
```

### **Staging**

```env
NODE_ENV=production
NEXT_PUBLIC_ENABLE_DEVTOOLS=true
NEXT_PUBLIC_LOG_LEVEL=info
NEXT_PUBLIC_ENABLE_ANALYTICS=false
```

### **Production**

```env
NODE_ENV=production
NEXT_PUBLIC_ENABLE_DEVTOOLS=false
NEXT_PUBLIC_LOG_LEVEL=error
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

## 🧪 Testing Environment Variables

### **Check if variables are loaded:**

```typescript
import { env, validateEnv } from '@/lib/env';

// Validate required variables
try {
  validateEnv();
  console.log('✅ All required environment variables are set');
} catch (error) {
  console.error('❌ Missing environment variables:', error);
}

// Check specific values
console.log('API URL:', env.api.url);
console.log('Environment:', env.app.env);
console.log('Features:', env.features);
```

### **Test in browser console:**

```javascript
// Only NEXT_PUBLIC_* variables are available in browser
console.log(process.env.NEXT_PUBLIC_APP_NAME);
console.log(process.env.NEXT_PUBLIC_API_URL);
```

## 📦 Deployment

### **Vercel**

1. Go to Project Settings → Environment Variables
2. Add all `NEXT_PUBLIC_*` variables
3. Add server-side variables separately
4. Set environment (Production/Preview/Development)

### **Netlify**

1. Go to Site Settings → Build & Deploy → Environment
2. Add all variables
3. Deploy

### **Docker**

```dockerfile
# Pass environment variables
docker run -e NEXT_PUBLIC_API_URL=https://api.example.com app
```

### **Kubernetes**

```yaml
# ConfigMap for non-sensitive data
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  NEXT_PUBLIC_API_URL: "https://api.example.com"

# Secret for sensitive data
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
type: Opaque
data:
  JWT_SECRET: base64_encoded_secret
```

## 🐛 Troubleshooting

### **Variables not loading?**

1. Restart development server
2. Check file name (must be `.env.local`)
3. Check variable prefix (`NEXT_PUBLIC_` for client-side)
4. Clear `.next` cache: `rm -rf .next`

### **Variables undefined in browser?**

- Only `NEXT_PUBLIC_*` variables are available in browser
- Server-side variables are only available in API routes and server components

### **Build fails with missing variables?**

- Check `.env.production` file exists
- Verify all required variables are set
- Run `validateEnv()` to check

## 📖 Additional Resources

- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [12 Factor App Config](https://12factor.net/config)

## ✅ Checklist

Before deploying to production:

- [ ] All required variables are set
- [ ] Using production API URLs
- [ ] Using live API keys (not test keys)
- [ ] JWT secret is strong and unique
- [ ] Database URL is correct
- [ ] Email service is configured
- [ ] Analytics is enabled
- [ ] Error tracking is enabled
- [ ] DevTools are disabled
- [ ] Secrets are not committed to git
- [ ] API keys are restricted to domain

---

**Need Help?** Check the [API Implementation Summary](./API_IMPLEMENTATION_SUMMARY.md) or [Zustand README](./ZUSTAND_README.md) for more information.