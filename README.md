# LogisticsLink - SA Truck Logistics Command Platform

Navigate South Africa's Trucking & Logistics Crisis with Intelligence

## 🚀 Overview

LogisticsLink is a truck-focused logistics visibility platform designed specifically for South African fleets and shippers navigating infrastructure challenges. The app provides real-time port and yard congestion tracking (feeding your trucks), road vs rail route optimisation, supplier and order management, and analytics – all with a premium, data-rich UI.

## ✨ Features

### Port & Yard Intelligence (for Trucks)
- **Real-time Port Monitoring**: Track congestion for Durban, Cape Town, Port Elizabeth, and Richards Bay
- **Interactive Maps**: Visualize key ports feeding your truck fleet with Leaflet maps
- **Trucked Container Tracking**: Add, edit, and track multiple containers linked to your road legs
- **Cost Calculator**: Estimate demurrage and storage fees based on port delays
- **Congestion Analytics**: View 7-day trends and historical patterns

### Truck Route Optimizer
- **Multi-modal Comparison**: Compare road vs rail legs side-by-side for South African corridors
- **Cost Breakdown**: Detailed fuel, toll, and carbon footprint calculations for road freight
- **Reliability Scoring**: See reliability scores per mode
- **Route Saving**: Save and manage your favourite routes

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

### Licensing & Pricing
- **Per-Company Licences**: 1-year, 2-year, and 5-year licence options priced for South African fleets
- **Implementation Fee**: Once-off implementation / customisation fee for onboarding your company

## 🛠️ Technology Stack

- **Frontend**: React 19+ with Hooks
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

## 🔒 Security

**Status**: ✅ **SECURE** - No known vulnerabilities

- ✅ Latest React version (19.2.1+) installed
- ✅ Regular security audits pass (`npm audit`)
- ✅ Not affected by CVE-2025-55182 (React2Shell) - This is a client-side Vite app, not Next.js
- ✅ Security headers configured in Vercel deployment

See [SECURITY_ADVISORY.md](./SECURITY_ADVISORY.md) for detailed security information.

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

## 📋 Prototype Status

This project is currently a **front-end prototype** focused on South African truck logistics:

- ✅ All main views are implemented (Fleet Overview, Ports/Yards, Routes, Suppliers, Live Map, Pricing)
- ✅ Data is persisted in the browser via `localStorage`
- ✅ CSV export for containers, suppliers, orders, and routes
- ⚠️ Live data (ports, routes, suppliers) is **simulated** – no production APIs yet
- ⚠️ No authentication, user accounts, or licence enforcement have been implemented yet

## 📄 License

This project is private and proprietary.

## 🤝 Support

For issues or questions, please contact the development team.

---

Built with ❤️ for South African businesses navigating logistics challenges.
