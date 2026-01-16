# API Base URL Configuration Update

## ✅ Update Complete

The API base URL has been successfully updated to:
```
https://bazardor.chhagolnaiyasportareana.xyz/api
```

---

## 📝 Files Updated

### 1. **Environment Files**
- ✅ `.env.local` - Development environment
- ✅ `.env.example` - Example template
- ✅ `.env.production` - Production environment

### 2. **API Client**
- ✅ `src/lib/api/client.ts` - Axios client configuration

---

## 🔧 Configuration Details

### API Client (`src/lib/api/client.ts`)
```typescript
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://bazardor.chhagolnaiyasportareana.xyz/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### Environment Variables
```bash
NEXT_PUBLIC_API_URL=https://bazardor.chhagolnaiyasportareana.xyz/api
NEXT_PUBLIC_API_TIMEOUT=10000
```

---

## 🚀 Next Steps

### 1. **Restart Development Server**
```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

### 2. **Verify API Connection**
The app will now make requests to:
- Base URL: `https://bazardor.chhagolnaiyasportareana.xyz/api`
- Example endpoints:
  - Markets: `https://bazardor.chhagolnaiyasportareana.xyz/api/markets`
  - Categories: `https://bazardor.chhagolnaiyasportareana.xyz/api/categories`
  - Items: `https://bazardor.chhagolnaiyasportareana.xyz/api/items`
  - Auth: `https://bazardor.chhagolnaiyasportareana.xyz/api/auth/login`

### 3. **Test API Endpoints**
Open your browser console and check for API calls:
```javascript
// The app will automatically use the new base URL
// Check Network tab in DevTools to verify requests
```

---

## 📋 Available API Endpoints

Based on your API implementation, these endpoints should be available:

### **Authentication**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh token

### **Markets**
- `GET /api/markets` - List all markets
- `GET /api/markets/:id` - Get market details
- `POST /api/markets` - Create market (admin)
- `PUT /api/markets/:id` - Update market (admin)
- `DELETE /api/markets/:id` - Delete market (admin)
- `GET /api/markets/nearby` - Get nearby markets

### **Categories**
- `GET /api/categories` - List all categories
- `GET /api/categories/:id` - Get category details
- `GET /api/categories/:id/items` - Get items in category

### **Items**
- `GET /api/items` - List all items
- `GET /api/items/:id` - Get item details
- `POST /api/items` - Create item
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item
- `GET /api/items/search` - Search items

### **Reviews**
- `GET /api/reviews` - List reviews
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review
- `GET /api/markets/:id/reviews` - Get market reviews

### **User**
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile
- `GET /api/user/favorites` - Get favorite markets
- `POST /api/user/favorites/:marketId` - Add favorite
- `DELETE /api/user/favorites/:marketId` - Remove favorite

---

## 🔍 Testing the Connection

### Method 1: Browser Console
```javascript
// Open browser console and run:
fetch('https://bazardor.chhagolnaiyasportareana.xyz/api/markets')
  .then(res => res.json())
  .then(data => console.log('API Response:', data))
  .catch(err => console.error('API Error:', err));
```

### Method 2: Using the App
1. Start the development server: `npm run dev`
2. Open the app in your browser
3. Navigate to the Markets page
4. Open DevTools → Network tab
5. Check for API requests to the new base URL

### Method 3: Using curl
```bash
curl https://bazardor.chhagolnaiyasportareana.xyz/api/markets
```

---

## ⚠️ Important Notes

### CORS Configuration
Make sure your backend API allows requests from your frontend domain:
```javascript
// Backend should have CORS configured
app.use(cors({
  origin: ['http://localhost:3000', 'https://your-frontend-domain.com'],
  credentials: true
}));
```

### HTTPS
The API uses HTTPS, which is good for security. Make sure:
- ✅ SSL certificate is valid
- ✅ No mixed content warnings
- ✅ Cookies/tokens work with secure flag

### Authentication
The API client is configured to:
- ✅ Automatically add `Authorization: Bearer <token>` header
- ✅ Store tokens in localStorage
- ✅ Handle 401 unauthorized responses
- ✅ Redirect to login on auth failure

---

## 🐛 Troubleshooting

### Issue: API requests fail
**Solution:**
1. Check if the API server is running
2. Verify the URL is correct
3. Check CORS configuration
4. Look for SSL certificate issues

### Issue: 401 Unauthorized
**Solution:**
1. Check if token is stored in localStorage
2. Verify token is not expired
3. Try logging in again

### Issue: Network timeout
**Solution:**
1. Check internet connection
2. Verify API server is accessible
3. Increase timeout in `.env` if needed:
   ```bash
   NEXT_PUBLIC_API_TIMEOUT=30000  # 30 seconds
   ```

### Issue: CORS errors
**Solution:**
Backend needs to allow your frontend origin:
```javascript
// Backend CORS config
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

---

## 📚 Related Documentation

- [API Implementation Summary](./API_IMPLEMENTATION_SUMMARY.md)
- [React Query API Guide](./REACT_QUERY_API_README.md)
- [Environment Setup Guide](./ENV_SETUP_GUIDE.md)
- [Zustand Store Guide](./ZUSTAND_README.md)

---

## ✅ Verification Checklist

- [x] Updated `.env.local`
- [x] Updated `.env.example`
- [x] Updated `.env.production`
- [x] Updated `src/lib/api/client.ts`
- [ ] Restart development server
- [ ] Test API connection
- [ ] Verify authentication works
- [ ] Check all API endpoints
- [ ] Test in production build

---

**Status:** ✅ Configuration Updated Successfully

**Next Action:** Restart your development server to apply changes
```bash
npm run dev
```
