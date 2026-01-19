import { UserRole } from './types';

export const INITIAL_USERS = [
  { id: 'u1', name: 'Super Admin', phoneNumber: '1111111111', password: 'password123', role: UserRole.ADMIN },
  { id: 'u2', name: 'Raj Singh', phoneNumber: '2222222222', password: 'password123', role: UserRole.COORDINATOR },
  { id: 'u3', name: 'Ramesh Kumar', phoneNumber: '3333333333', password: 'password123', role: UserRole.DRIVER },
  { id: 'u4', name: 'Rahul Sharma', phoneNumber: '4444444444', password: 'password123', role: UserRole.STUDENT },
];

export const INITIAL_BUSES = [
  {
    id: '10',
    busNumber: '10',
    driverName: 'Mohan Lal',
    driverNameHindi: 'मोहन लाल',
    driverContact: '9876543210',
    route: 'Bhuwana',
    routeHindi: 'भुवाणा',
    isGpsActive: true,
    stops: [
      { id: 's1', name: 'BHU', nameHindi: 'भुवाणा कैंपस', scheduledTime: '08:00 AM', actualTime: '08:05 AM', status: 'visited' },
      { id: 's2', name: 'VVP', nameHindi: 'वैली पार्क', scheduledTime: '08:15 AM', actualTime: '08:28 AM', status: 'visited' },
      { id: 's3', name: 'HSM', nameHindi: 'हाई मॉल', scheduledTime: '08:30 AM', status: 'current' },
      { id: 's4', name: 'MJC', nameHindi: 'मेन जंक्शन', scheduledTime: '08:45 AM', status: 'upcoming' }
    ]
  },
  {
    id: '11',
    busNumber: '11',
    driverName: 'Suresh Das',
    driverNameHindi: 'सुरेश दास',
    driverContact: '9876543211',
    route: 'Bedla',
    routeHindi: 'बेदला',
    isGpsActive: true,
    stops: [
      { id: 's5', name: 'BDL', nameHindi: 'बेदला चौराहा', scheduledTime: '08:10 AM', status: 'current' },
      { id: 's6', name: 'WAK', nameHindi: 'वाकड', scheduledTime: '08:40 AM', status: 'delayed' }
    ]
  },
  {
    id: '12',
    busNumber: '12',
    driverName: 'Vikram Singh',
    driverNameHindi: 'विक्रम सिंह',
    driverContact: '9876543212',
    route: 'Tekri',
    routeHindi: 'टेकरी',
    isGpsActive: false,
    stops: [
      { id: 's7', name: 'TEK', nameHindi: 'टेकरी बस स्टैंड', scheduledTime: '08:15 AM', status: 'upcoming' }
    ]
  },
  {
    id: '13',
    busNumber: '13',
    driverName: 'Abdul Khan',
    driverNameHindi: 'अब्दुल खान',
    driverContact: '9876543213',
    route: 'Rampura',
    routeHindi: 'रामपुरा',
    isGpsActive: false,
    stops: [
      { id: 's8', name: 'RAM', nameHindi: 'रामपुरा गाँव', scheduledTime: '08:20 AM', status: 'upcoming' }
    ]
  }
];

export const INITIAL_DRIVERS = [
  { id: 'd1', name: 'Mohan Lal', nameHindi: 'मोहन लाल', phoneNumber: '9876543210', assignedBus: '10' },
  { id: 'd2', name: 'Suresh Das', nameHindi: 'सुरेश दास', phoneNumber: '9876543211', assignedBus: '11' },
  { id: 'd3', name: 'Vikram Singh', nameHindi: 'विक्रम सिंह', phoneNumber: '9876543212', assignedBus: '12' },
  { id: 'd4', name: 'Abdul Khan', nameHindi: 'अब्दुल खान', phoneNumber: '9876543213', assignedBus: '13' }
];
