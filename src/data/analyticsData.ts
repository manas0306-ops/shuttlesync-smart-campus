export interface HourlyWaitTime {
  hour: string;
  historicalWait: number; // minutes
  predictedWait: number;
  currentSimulatedWait: number;
}

export const HOURLY_WAIT_TIMES: HourlyWaitTime[] = [
  { hour: '07:30', historicalWait: 4.2, predictedWait: 4.5, currentSimulatedWait: 4.0 },
  { hour: '08:30', historicalWait: 9.8, predictedWait: 11.2, currentSimulatedWait: 10.5 },
  { hour: '09:30', historicalWait: 12.5, predictedWait: 13.0, currentSimulatedWait: 12.8 },
  { hour: '10:30', historicalWait: 6.4, predictedWait: 5.8, currentSimulatedWait: 6.0 },
  { hour: '11:30', historicalWait: 4.8, predictedWait: 4.2, currentSimulatedWait: 4.5 },
  { hour: '12:30', historicalWait: 8.9, predictedWait: 9.5, currentSimulatedWait: 9.2 },
  { hour: '13:30', historicalWait: 7.6, predictedWait: 7.1, currentSimulatedWait: 7.3 },
  { hour: '14:30', historicalWait: 4.5, predictedWait: 4.0, currentSimulatedWait: 4.1 },
  { hour: '15:30', historicalWait: 5.2, predictedWait: 5.0, currentSimulatedWait: 4.9 },
  { hour: '16:30', historicalWait: 8.7, predictedWait: 9.4, currentSimulatedWait: 9.1 },
  { hour: '17:30', historicalWait: 13.4, predictedWait: 14.2, currentSimulatedWait: 13.8 },
  { hour: '18:30', historicalWait: 10.1, predictedWait: 9.8, currentSimulatedWait: 10.2 },
  { hour: '19:30', historicalWait: 6.3, predictedWait: 5.9, currentSimulatedWait: 6.0 },
  { hour: '20:30', historicalWait: 4.1, predictedWait: 3.8, currentSimulatedWait: 3.9 },
];

export const STOP_POPULARITY_DATA = [
  { stopName: 'Hostel Clusters', passengerFlow: 1420, avgWaitMins: 8.5, crowdIndex: 'High' },
  { stopName: 'Food Court & SAC', passengerFlow: 1280, avgWaitMins: 7.2, crowdIndex: 'High' },
  { stopName: 'North Main Gate', passengerFlow: 1150, avgWaitMins: 4.5, crowdIndex: 'Moderate' },
  { stopName: 'Engineering Tower', passengerFlow: 980, avgWaitMins: 6.0, crowdIndex: 'Moderate' },
  { stopName: 'South Gate Market', passengerFlow: 650, avgWaitMins: 5.5, crowdIndex: 'Moderate' },
  { stopName: 'Central Library', passengerFlow: 590, avgWaitMins: 3.5, crowdIndex: 'Low' },
  { stopName: 'Science Complex', passengerFlow: 440, avgWaitMins: 5.0, crowdIndex: 'Low' },
  { stopName: 'Sports Arena', passengerFlow: 310, avgWaitMins: 4.0, crowdIndex: 'Low' },
];

export const ROUTE_EFFICIENCY_METRICS = [
  { routeCode: 'R-101', name: 'Blue Express', onTimeRate: 91, avgLoadFactor: 76, tripsCompleted: 48 },
  { routeCode: 'R-202', name: 'Green Loop', onTimeRate: 84, avgLoadFactor: 89, tripsCompleted: 36 },
  { routeCode: 'R-303', name: 'Hostel Link', onTimeRate: 79, avgLoadFactor: 94, tripsCompleted: 42 },
];
