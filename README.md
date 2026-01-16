# Fresh Market Finder 🛒

A modern, full-featured Progressive Web App for finding fresh groceries from local markets and farmers.

## ✨ Features

- 🏪 **Market Discovery** - Find local markets and farmers near you
- 🔍 **Smart Search** - Search for products, markets, and categories
- 💰 **Price Comparison** - Compare prices across different markets
- ⭐ **Reviews & Ratings** - Read and write market reviews
- 📍 **Location-Based** - Find nearby markets using geolocation
- 📱 **PWA Support** - Install as a mobile app with offline support
- 🛒 **Shopping Cart** - Add items and manage your shopping list
- ❤️ **Favorites** - Save your favorite markets and items
- 🔔 **Notifications** - Get notified about price changes and deals
- 🌙 **Dark Mode** - Beautiful UI in light and dark themes

## 🚀 Quick Start

### **Prerequisites**

- Node.js 18+ and npm
- Git

### **Installation**

```bash
# Clone the repository
git clone https://github.com/yourusername/fresh-market-finder.git
cd fresh-market-finder

# Install dependencies
npm install

# Setup environment variables
npm run setup:env

# Edit .env.local with your configuration
nano .env.local

# Validate environment
npm run validate:env

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the app.

## 📚 Documentation

### **Setup & Configuration**
- [Environment Setup Guide](./ENV_SETUP_GUIDE.md) - Complete environment configuration
- [Environment Files Summary](./ENV_FILES_SUMMARY.md) - Quick reference

### **Features & Implementation**
- [PWA Features](./PWA_README.md) - Progressive Web App implementation
- [Zustand State Management](./ZUSTAND_README.md) - Global state management
- [React Query API](./REACT_QUERY_API_README.md) - API integration guide
- [API Implementation](./API_IMPLEMENTATION_SUMMARY.md) - API summary

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI
- **Icons**: Lucide React

### **State Management**
- **Global State**: Zustand
- **Server State**: React Query (TanStack Query)
- **Form State**: React Hook Form (optional)

### **Data Fetching**
- **HTTP Client**: Axios
- **Caching**: React Query
- **Real-time**: WebSockets (optional)

### **PWA**
- **Service Worker**: next-pwa
- **Offline Support**: Workbox
- **Manifest**: Web App Manifest

### **Development**
- **Package Manager**: npm
- **Linting**: ESLint
- **Type Checking**: TypeScript
- **Build Tool**: Turbopack

## 📁 Project Structure

```
fresh-market-finder/
├── src/
│   ├── app/                      # Next.js app directory
│   │   ├── _components/          # Page-specific components
│   │   ├── markets/              # Markets pages
│   │   ├── category/             # Category pages
│   │   ├── profile/              # Profile pages
│   │   └── layout.tsx            # Root layout
│   ├── components/               # Shared components
│   │   ├── ui/                   # UI components
│   │   ├── auth/                 # Auth components
│   │   └── ...
│   ├── lib/                      # Utilities
│   │   ├── api/                  # API client & services
│   │   │   ├── client.ts         # Axios client
│   │   │   ├── types.ts          # API types
│   │   │   ├── services/         # API services
│   │   │   └── hooks/            # React Query hooks
│   │   ├── env.ts                # Environment config
│   │   └── utils.ts              # Utilities
│   ├── store/                    # Zustand store
│   │   ├── app-store.ts          # Main store
│   │   ├── hooks.ts              # Store hooks
│   │   └── slices/               # Store slices
│   ├── hooks/                    # Custom hooks
│   ├── providers/                # Context providers
│   └── types/                    # TypeScript types
├── public/                       # Static assets
│   ├── icons/                    # PWA icons
│   ├── screenshots/              # PWA screenshots
│   └── manifest.json             # PWA manifest
├── scripts/                      # Build scripts
│   └── validate-env.js           # Env validation
├── .env.example                  # Environment template
├── .env.local                    # Development env (git-ignored)
├── .env.production               # Production env (git-ignored)
└── package.json                  # Dependencies
```

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint

# Environment
npm run setup:env        # Setup environment file
npm run validate:env     # Validate environment config

# Testing (add as needed)
npm run test             # Run tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Generate coverage report
```

## 🌍 Environment Variables

### **Required Variables**

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### **Optional Variables**

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
DATABASE_URL=postgresql://...
JWT_SECRET=your_secret
```

See [ENV_SETUP_GUIDE.md](./ENV_SETUP_GUIDE.md) for complete documentation.

## 🚀 Deployment

### **Vercel** (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

### **Docker**

```bash
# Build image
docker build -t fresh-market-finder .

# Run container
docker run -p 3000:3000 fresh-market-finder
```

### **Other Platforms**
- Netlify
- AWS Amplify
- Google Cloud Run
- Azure Static Web Apps

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 📱 PWA Installation

### **Desktop**
1. Visit the website
2. Click the install icon in the address bar
3. Click "Install"

### **Mobile**
1. Visit the website
2. Tap the share button
3. Select "Add to Home Screen"

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Radix UI](https://www.radix-ui.com/) - UI components
- [Zustand](https://zustand-demo.pmnd.rs/) - State management
- [React Query](https://tanstack.com/query) - Data fetching
- [Lucide](https://lucide.dev/) - Icons

## 📞 Support

- **Email**: support@freshmarketfinder.com
- **Documentation**: [docs.freshmarketfinder.com](https://docs.freshmarketfinder.com)
- **Issues**: [GitHub Issues](https://github.com/yourusername/fresh-market-finder/issues)

## 🗺️ Roadmap

- [ ] Mobile app (React Native)
- [ ] Real-time price updates
- [ ] Social features (share finds)
- [ ] Loyalty programs integration
- [ ] Recipe suggestions
- [ ] Meal planning
- [ ] Delivery integration
- [ ] Multi-language support

---

**Built with ❤️ by the Fresh Market Finder Team**