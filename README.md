# LogisticsLink - Supply Chain Transparency Platform

Navigate South Africa's Logistics Crisis with Intelligence

## 🚀 Overview

LogisticsLink is a comprehensive supply chain visibility platform designed specifically for South African businesses navigating infrastructure challenges. The app provides real-time port congestion tracking, freight route optimization, supplier management, and analytics - all with a premium, data-rich UI.

## ✨ Features

### Port Intelligence Dashboard
- **Real-time Port Monitoring**: Track congestion for Durban, Cape Town, Port Elizabeth, and Richards Bay
- **Interactive Maps**: Visualize port locations with Leaflet maps
- **Container Tracking**: Add, edit, and track multiple containers with full CRUD operations
- **Cost Calculator**: Estimate demurrage and storage fees based on port delays
- **Congestion Analytics**: View 7-day trends and historical patterns

### Freight Route Optimizer
- **Multi-modal Comparison**: Compare road vs rail options side-by-side
- **Cost Breakdown**: Detailed fuel, toll, and carbon footprint calculations
- **Reliability Scoring**: See historical reliability data for each route
- **Route Saving**: Save and manage your favorite routes

### Supplier & Inventory Manager
- **Supplier Database**: Track suppliers with ratings and performance metrics
- **Order Management**: Monitor orders across multiple suppliers
- **Performance Analytics**: View supplier performance charts
- **Search & Filter**: Quickly find suppliers by name or category

### Analytics & Insights
- **Port Trend Charts**: 7-day congestion trends across all ports
- **Supplier Performance**: Visualize on-time delivery and accuracy metrics
- **Route Reliability**: Compare road vs rail reliability across routes
- **Export Functionality**: Export data to CSV for external analysis

## 🛠️ Technology Stack

- **Frontend**: React 18+ with Hooks
- **Styling**: Tailwind CSS 3.4
- **Charts**: Recharts
- **Maps**: Leaflet + React-Leaflet
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Date Handling**: date-fns
- **State Management**: React Context + LocalStorage

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎯 Usage

### Adding Containers
1. Navigate to **Ports** section
2. Click **Add Container**
3. Fill in container details (ID, origin, destination, etc.)
4. Save - data persists automatically in localStorage

### Planning Routes
1. Go to **Routes** section
2. Click **Plan New Route**
3. Select origin and destination
4. Enter cargo weight and urgency
5. Compare road vs rail options
6. Save route for future reference

### Managing Suppliers
1. Navigate to **Suppliers** section
2. Click **Add Supplier** to add new suppliers
3. Click on supplier cards to view detailed metrics
4. Track orders associated with each supplier

### Exporting Data
- Click **Export CSV** buttons in any section to download data
- Exports include containers, suppliers, orders, and routes

## 📊 Data Persistence

All data is stored locally in your browser using localStorage:
- Containers
- Suppliers
- Orders
- Routes
- Settings

Data persists across browser sessions and is automatically saved when you make changes.

## 🎨 Design System

- **Dark Theme**: Optimized for extended use
- **Color Palette**:
  - Primary (Blue): `#3b82f6` - Trust, logistics
  - Success (Green): `#10b981` - On-time, healthy metrics
  - Warning (Amber): `#f59e0b` - Delays, caution
  - Danger (Red): `#ef4444` - Critical issues
- **Glassmorphism**: Subtle backdrop blur on panels
- **Responsive**: Works on desktop, tablet, and mobile

## 📱 Responsive Design

- **Desktop**: Multi-column layouts, side-by-side comparisons
- **Tablet**: Two-column grids, collapsible sidebars
- **Mobile**: Single column, bottom navigation, touch-optimized

## 🚧 Future Enhancements

- Real-time GPS fleet tracking
- Logistics marketplace
- Advanced predictive analytics
- SMS notifications
- API integrations with shipping lines
- Multi-user collaboration
- Custom report builder

## 🚀 Deployment

### Vercel Deployment (Recommended)

LogisticsLink is fully configured for deployment on Vercel:

1. **Push to GitHub/GitLab/Bitbucket**
2. **Connect to Vercel**: Go to [vercel.com](https://vercel.com) and import your repository
3. **Deploy**: Vercel auto-detects Vite configuration - click Deploy!

**Configuration**: The `vercel.json` file includes:
- SPA routing (all routes redirect to index.html)
- Security headers
- Asset caching
- Build optimization

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Build Commands

```bash
# Development
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## 📋 Requirements & Compliance

- **Requirements Checklist**: See [REQUIREMENTS.md](./REQUIREMENTS.md)
- **Compliance Report**: See [REQUIREMENTS_COMPLIANCE.md](./REQUIREMENTS_COMPLIANCE.md)

**Status**: ✅ 92% feature complete, 100% MVP requirements met, ready for production deployment.

## 📄 License

This project is private and proprietary.

## 🤝 Support

For issues or questions, please contact the development team.

---

Built with ❤️ for South African businesses navigating logistics challenges.
