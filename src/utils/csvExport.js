// CSV export/import utilities

export function exportToCSV(data, filename) {
  if (!data || data.length === 0) {
    throw new Error('No data to export')
  }

  // Get headers from first object
  const headers = Object.keys(data[0])
  
  // Create CSV content
  const csvContent = [
    headers.join(','),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header]
          // Handle values with commas, quotes, or newlines
          if (value === null || value === undefined) return ''
          const stringValue = String(value)
          if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
            return `"${stringValue.replace(/"/g, '""')}"`
          }
          return stringValue
        })
        .join(',')
    ),
  ].join('\n')

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', filename || 'export.csv')
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  URL.revokeObjectURL(url)
}

export function exportContainers(containers) {
  const csvData = containers.map((c) => ({
    'Container ID': c.containerId,
    'Shipment Name': c.shipmentName,
    'Origin': c.origin,
    'Destination': c.destination,
    'Status': c.status,
    'Current Location': c.currentLocation,
    'ETA': c.eta,
    'Confidence': c.confidence,
  }))
  exportToCSV(csvData, `containers_${new Date().toISOString().split('T')[0]}.csv`)
}

export function exportSuppliers(suppliers) {
  const csvData = suppliers.map((s) => ({
    'Supplier ID': s.supplierId,
    'Name': s.name,
    'Category': s.category,
    'Location': s.location,
    'Contact Person': s.contactPerson,
    'Email': s.email,
    'Phone': s.phone,
    'Rating': s.rating,
    'On-Time Delivery Rate': s.metrics?.onTimeDeliveryRate || 0,
    'Order Accuracy': s.metrics?.orderAccuracy || 0,
    'Response Time (hours)': s.metrics?.responseTime || 0,
    'Quality Score': s.metrics?.qualityScore || 0,
  }))
  exportToCSV(csvData, `suppliers_${new Date().toISOString().split('T')[0]}.csv`)
}

export function exportOrders(orders) {
  const csvData = orders.map((o) => ({
    'Order ID': o.orderId,
    'Supplier ID': o.supplierId,
    'Supplier Name': o.supplierName,
    'Product': o.product,
    'Quantity': o.quantity,
    'Order Date': o.orderDate,
    'Expected Delivery': o.expectedDelivery,
    'Status': o.status,
    'Value (ZAR)': o.value,
  }))
  exportToCSV(csvData, `orders_${new Date().toISOString().split('T')[0]}.csv`)
}

export function exportRoutes(routes) {
  const csvData = routes.flatMap((r) =>
    r.modes.map((mode) => ({
      'Route ID': r.routeId,
      'Origin': r.origin,
      'Destination': r.destination,
      'Mode': mode.type,
      'Distance (km)': mode.distance,
      'Estimated Time (hours)': mode.estimatedTime,
      'Cost (ZAR)': mode.cost,
      'Reliability (%)': mode.reliability || 'N/A',
      'Congestion Level': mode.congestionLevel || 'N/A',
    }))
  )
  exportToCSV(csvData, `routes_${new Date().toISOString().split('T')[0]}.csv`)
}

export function parseCSV(csvText) {
  const lines = csvText.split('\n').filter((line) => line.trim())
  if (lines.length < 2) return []

  const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''))
  
  return lines.slice(1).map((line) => {
    const values = line.split(',').map((v) => v.trim().replace(/^"|"$/g, ''))
    const obj = {}
    headers.forEach((header, index) => {
      obj[header] = values[index] || ''
    })
    return obj
  })
}

