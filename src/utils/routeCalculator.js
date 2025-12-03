// Route data and calculation utilities

export const sampleRoutes = [
  {
    routeId: 'JHB-DBN-001',
    origin: 'Johannesburg',
    destination: 'Durban',
    modes: [
      {
        type: 'road',
        distance: 568, // km
        estimatedTime: 6.5, // hours
        cost: 8500, // ZAR
        reliability: 85, // percentage
        congestionLevel: 'moderate',
        fuelCost: 3200,
        tollFees: 450,
        carbonFootprint: 245, // kg CO2
      },
      {
        type: 'rail',
        distance: 580,
        estimatedTime: 14, // hours
        cost: 4500,
        reliability: 45, // low due to Transnet issues
        status: 'limited_service',
      },
    ],
  },
  {
    routeId: 'CPT-JHB-001',
    origin: 'Cape Town',
    destination: 'Johannesburg',
    modes: [
      {
        type: 'road',
        distance: 1398,
        estimatedTime: 14.5,
        cost: 18500,
        reliability: 78,
        congestionLevel: 'high',
        fuelCost: 7800,
        tollFees: 680,
        carbonFootprint: 602,
      },
      {
        type: 'rail',
        distance: 1420,
        estimatedTime: 28,
        cost: 12000,
        reliability: 52,
        status: 'limited_service',
      },
    ],
  },
  {
    routeId: 'DBN-PE-001',
    origin: 'Durban',
    destination: 'Port Elizabeth',
    modes: [
      {
        type: 'road',
        distance: 865,
        estimatedTime: 9.5,
        cost: 11200,
        reliability: 82,
        congestionLevel: 'low',
        fuelCost: 4900,
        tollFees: 320,
        carbonFootprint: 373,
      },
    ],
  },
]

// Calculate route comparison
export function calculateRouteComparison(origin, destination, cargoWeight, urgency) {
  // This is a simplified calculator - in production would use real APIs
  const baseDistance = getDistance(origin, destination)
  const baseTime = baseDistance / 60 // Assume 60km/h average

  const roadRoute = {
    type: 'road',
    distance: baseDistance,
    estimatedTime: baseTime,
    cost: Math.round(baseDistance * 15 + cargoWeight * 2), // Base cost + weight factor
    reliability: 80,
    congestionLevel: 'moderate',
    fuelCost: Math.round(baseDistance * 5.5),
    tollFees: Math.round(baseDistance * 0.8),
    carbonFootprint: Math.round(baseDistance * 0.43),
  }

  const railRoute = {
    type: 'rail',
    distance: baseDistance * 1.02, // Rail usually slightly longer
    estimatedTime: baseTime * 2.1, // Rail is slower
    cost: Math.round(baseDistance * 8 + cargoWeight * 1.5),
    reliability: 50, // Transnet issues
    status: 'limited_service',
  }

  return {
    origin,
    destination,
    modes: [roadRoute, railRoute],
  }
}

// Get approximate distance between major SA cities (km)
function getDistance(origin, destination) {
  const routes = {
    'Johannesburg-Durban': 568,
    'Durban-Johannesburg': 568,
    'Cape Town-Johannesburg': 1398,
    'Johannesburg-Cape Town': 1398,
    'Durban-Port Elizabeth': 865,
    'Port Elizabeth-Durban': 865,
    'Cape Town-Port Elizabeth': 750,
    'Port Elizabeth-Cape Town': 750,
    'Johannesburg-Pretoria': 58,
    'Pretoria-Johannesburg': 58,
  }

  const key = `${origin}-${destination}`
  return routes[key] || 500 // Default fallback
}

// Get reliability color
export function getReliabilityColor(reliability) {
  if (reliability >= 80) return 'text-success'
  if (reliability >= 60) return 'text-warning'
  return 'text-danger'
}

// Get congestion level color
export function getCongestionColor(level) {
  if (level === 'high') return 'text-danger'
  if (level === 'moderate') return 'text-warning'
  return 'text-success'
}

