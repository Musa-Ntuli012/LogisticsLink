export const samplePorts = [
  {
    portId: 'durban',
    portName: 'Port of Durban',
    congestionScore: 78,
    vesselsWaiting: 45,
    averageWaitDays: 5.2,
    containersBacklog: 61000,
    weatherDelay: false,
    lastUpdated: '2024-12-03T10:30:00Z',
    trend: 'increasing',
  },
  {
    portId: 'cape-town',
    portName: 'Port of Cape Town',
    congestionScore: 62,
    vesselsWaiting: 21,
    averageWaitDays: 3.1,
    containersBacklog: 28000,
    weatherDelay: true,
    lastUpdated: '2024-12-03T10:25:00Z',
    trend: 'stable',
  },
  {
    portId: 'pe',
    portName: 'Port Elizabeth (Ngqura)',
    congestionScore: 54,
    vesselsWaiting: 12,
    averageWaitDays: 2.9,
    containersBacklog: 19000,
    weatherDelay: false,
    lastUpdated: '2024-12-03T10:20:00Z',
    trend: 'decreasing',
  },
  {
    portId: 'richards-bay',
    portName: 'Port of Richards Bay',
    congestionScore: 68,
    vesselsWaiting: 18,
    averageWaitDays: 4.0,
    containersBacklog: 24000,
    weatherDelay: false,
    lastUpdated: '2024-12-03T10:15:00Z',
    trend: 'increasing',
  },
]

export const sampleContainers = [
  {
    containerId: 'TCLU1234567',
    shipmentName: 'November Electronics Order',
    origin: 'Shanghai',
    destination: 'Durban',
    status: 'in_port',
    currentLocation: 'Port of Durban',
    eta: '2024-12-08',
    confidence: 'medium',
    milestones: [
      { stage: 'departed', date: '2024-11-15', location: 'Shanghai' },
      { stage: 'transit', date: '2024-11-16', location: 'At Sea' },
      { stage: 'in_port', date: '2024-12-01', location: 'Port of Durban' },
    ],
    alerts: [
      { type: 'delay', message: 'Port congestion - 3 day delay expected' },
    ],
  },
  {
    containerId: 'MSCU7654321',
    shipmentName: 'Automotive Components',
    origin: 'Hamburg',
    destination: 'Port Elizabeth',
    status: 'transit',
    currentLocation: 'At Sea',
    eta: '2024-12-12',
    confidence: 'high',
    milestones: [
      { stage: 'departed', date: '2024-11-20', location: 'Hamburg' },
      { stage: 'transit', date: '2024-11-21', location: 'At Sea' },
    ],
    alerts: [],
  },
]

export function getOverallCongestionScore(ports) {
  if (!ports.length) return 0
  const total = ports.reduce((sum, p) => sum + p.congestionScore, 0)
  return Math.round(total / ports.length)
}


