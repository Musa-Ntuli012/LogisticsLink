// Supplier data and utilities

export const sampleSuppliers = [
  {
    supplierId: 'SUP-001',
    name: 'TechParts International',
    category: 'Electronics',
    location: 'China',
    contactPerson: 'Li Wei',
    email: 'li.wei@techparts.com',
    phone: '+86 123 456 7890',
    rating: 4.5,
    metrics: {
      onTimeDeliveryRate: 87, // percentage
      orderAccuracy: 95,
      responseTime: 24, // hours
      qualityScore: 4.3,
    },
    orders: ['ORD-001', 'ORD-002'],
    notes: 'Reliable for small orders, tends to delay on large quantities',
  },
  {
    supplierId: 'SUP-002',
    name: 'SA Manufacturing Co',
    category: 'Raw Materials',
    location: 'South Africa',
    contactPerson: 'John Smith',
    email: 'john@samfg.co.za',
    phone: '+27 11 123 4567',
    rating: 4.2,
    metrics: {
      onTimeDeliveryRate: 92,
      orderAccuracy: 98,
      responseTime: 12,
      qualityScore: 4.5,
    },
    orders: ['ORD-003'],
    notes: 'Excellent local supplier, fast shipping within SA',
  },
  {
    supplierId: 'SUP-003',
    name: 'Global Textiles Ltd',
    category: 'Textiles',
    location: 'India',
    contactPerson: 'Raj Patel',
    email: 'raj@globaltextiles.in',
    phone: '+91 22 1234 5678',
    rating: 3.8,
    metrics: {
      onTimeDeliveryRate: 75,
      orderAccuracy: 88,
      responseTime: 48,
      qualityScore: 3.9,
    },
    orders: [],
    notes: 'Good quality but communication can be slow',
  },
]

export const sampleOrders = [
  {
    orderId: 'ORD-001',
    supplierId: 'SUP-001',
    supplierName: 'TechParts International',
    product: 'Electronic Components',
    quantity: 500,
    orderDate: '2024-11-15',
    expectedDelivery: '2024-12-10',
    status: 'in_transit',
    value: 125000, // ZAR
  },
  {
    orderId: 'ORD-002',
    supplierId: 'SUP-001',
    supplierName: 'TechParts International',
    product: 'Circuit Boards',
    quantity: 200,
    orderDate: '2024-11-20',
    expectedDelivery: '2024-12-15',
    status: 'confirmed',
    value: 85000,
  },
  {
    orderId: 'ORD-003',
    supplierId: 'SUP-002',
    supplierName: 'SA Manufacturing Co',
    product: 'Steel Sheets',
    quantity: 1000,
    orderDate: '2024-11-25',
    expectedDelivery: '2024-12-05',
    status: 'shipped',
    value: 45000,
  },
]

export function getStatusColor(status) {
  const colors = {
    ordered: 'bg-slate-500/20 border-slate-500/30 text-slate-400',
    confirmed: 'bg-primary/20 border-primary/30 text-primary',
    shipped: 'bg-warning/20 border-warning/30 text-warning',
    in_transit: 'bg-primary/20 border-primary/30 text-primary',
    delivered: 'bg-success/20 border-success/30 text-success',
    cancelled: 'bg-danger/20 border-danger/30 text-danger',
  }
  return colors[status] || colors.ordered
}

export function getRatingStars(rating) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)
  return { fullStars, hasHalfStar, emptyStars }
}

