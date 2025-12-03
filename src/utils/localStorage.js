// Local storage utilities for data persistence

const STORAGE_KEYS = {
  CONTAINERS: 'logisticslink_containers',
  SUPPLIERS: 'logisticslink_suppliers',
  ORDERS: 'logisticslink_orders',
  ROUTES: 'logisticslink_routes',
  SETTINGS: 'logisticslink_settings',
}

export function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data))
    return true
  } catch (error) {
    console.error('Error saving to localStorage:', error)
    return false
  }
}

export function loadFromStorage(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error('Error loading from localStorage:', error)
    return defaultValue
  }
}

export function clearStorage(key) {
  try {
    localStorage.removeItem(key)
    return true
  } catch (error) {
    console.error('Error clearing localStorage:', error)
    return false
  }
}

// Container storage
export function saveContainers(containers) {
  return saveToStorage(STORAGE_KEYS.CONTAINERS, containers)
}

export function loadContainers(defaultContainers = []) {
  return loadFromStorage(STORAGE_KEYS.CONTAINERS, defaultContainers)
}

// Supplier storage
export function saveSuppliers(suppliers) {
  return saveToStorage(STORAGE_KEYS.SUPPLIERS, suppliers)
}

export function loadSuppliers(defaultSuppliers = []) {
  return loadFromStorage(STORAGE_KEYS.SUPPLIERS, defaultSuppliers)
}

// Order storage
export function saveOrders(orders) {
  return saveToStorage(STORAGE_KEYS.ORDERS, orders)
}

export function loadOrders(defaultOrders = []) {
  return loadFromStorage(STORAGE_KEYS.ORDERS, defaultOrders)
}

// Route storage
export function saveRoutes(routes) {
  return saveToStorage(STORAGE_KEYS.ROUTES, routes)
}

export function loadRoutes(defaultRoutes = []) {
  return loadFromStorage(STORAGE_KEYS.ROUTES, defaultRoutes)
}

// Settings storage
export function saveSettings(settings) {
  return saveToStorage(STORAGE_KEYS.SETTINGS, settings)
}

export function loadSettings(defaultSettings = {}) {
  return loadFromStorage(STORAGE_KEYS.SETTINGS, defaultSettings)
}

// Export all data
export function exportAllData() {
  return {
    containers: loadContainers([]),
    suppliers: loadSuppliers([]),
    orders: loadOrders([]),
    routes: loadRoutes([]),
    settings: loadSettings({}),
    exportDate: new Date().toISOString(),
  }
}

// Import all data
export function importAllData(data) {
  if (data.containers) saveContainers(data.containers)
  if (data.suppliers) saveSuppliers(data.suppliers)
  if (data.orders) saveOrders(data.orders)
  if (data.routes) saveRoutes(data.routes)
  if (data.settings) saveSettings(data.settings)
  return true
}

