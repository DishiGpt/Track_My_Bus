
import { Bus, UserRole, Driver, User } from './types';

export const MOCK_USERS: Record<string, User> = {
  "1111111111": { id: 'u1', name: 'Super Admin', phoneNumber: '1111111111', password: 'password123', role: UserRole.ADMIN },
  "2222222222": { id: 'u2', name: 'Raj Singh', phoneNumber: '2222222222', password: 'password123', role: UserRole.COORDINATOR },
  "3333333333": { id: 'u3', name: 'Ramesh Kumar', phoneNumber: '3333333333', password: 'password123', role: UserRole.DRIVER },
  "4444444444": { id: 'u4', name: 'Rahul Sharma', phoneNumber: '4444444444', password: 'password123', role: UserRole.STUDENT },
};

export const MOCK_BUSES: Bus[] = [
  {
    id: '1',
    busNumber: 'MH-12-AZ-101',
    driverName: 'Ramesh Kumar',
    driverNameHindi: 'रमेश कुमार',
    driverContact: '+91 33333 33333',
    route: 'College to Swargate',
    routeHindi: 'कॉलेज से स्वारगेट',
    isGpsActive: false,
    stops: [
      { id: 's1', name: 'College Campus', nameHindi: 'कॉलेज कैंपस', scheduledTime: '08:00 AM', actualTime: '08:05 AM', status: 'visited' },
      { id: 's2', name: 'Valley View Park', nameHindi: 'वैली व्यू पार्क', scheduledTime: '08:15 AM', actualTime: '08:18 AM', status: 'visited' },
      { id: 's3', name: 'High Street Mall', nameHindi: 'हाई स्ट्रीट मॉल', scheduledTime: '08:30 AM', actualTime: '08:32 AM', status: 'current' },
      { id: 's4', name: 'Main Junction', nameHindi: 'मेन जंक्शन', scheduledTime: '08:45 AM', status: 'upcoming' },
      { id: 's5', name: 'Swargate Terminal', nameHindi: 'स्वारगेट टर्मिनल', scheduledTime: '09:00 AM', status: 'upcoming' }
    ]
  },
  {
    id: '2',
    busNumber: 'MH-12-AZ-202',
    driverName: 'Suresh Singh',
    driverNameHindi: 'सुरेश सिंह',
    driverContact: '+91 91234 56789',
    route: 'College to Hinjewadi',
    routeHindi: 'कॉलेज से हिंजेवाड़ी',
    isGpsActive: true,
    stops: [
      { id: 's6', name: 'College Campus', nameHindi: 'कॉलेज कैंपस', scheduledTime: '08:10 AM', actualTime: '08:10 AM', status: 'visited' },
      { id: 's7', name: 'Dange Chowk', nameHindi: 'डांगे चौक', scheduledTime: '08:40 AM', status: 'current' },
      { id: 's8', name: 'Wakad Bridge', nameHindi: 'वाकड ब्रिज', scheduledTime: '08:55 AM', status: 'delayed' },
      { id: 's9', name: 'Phase 3 Circle', nameHindi: 'फेज 3 सर्कल', scheduledTime: '09:15 AM', status: 'upcoming' }
    ]
  }
];

export const MOCK_DRIVERS: Driver[] = [
  { id: 'd1', name: 'Ramesh Kumar', nameHindi: 'रमेश कुमार', phoneNumber: '+91 33333 33333', assignedBus: 'MH-12-AZ-101' },
  { id: 'd2', name: 'Suresh Singh', nameHindi: 'सुरेश सिंह', phoneNumber: '+91 91234 56789', assignedBus: 'MH-12-AZ-202' },
  { id: 'd4', name: 'Vikram Rao', nameHindi: 'विक्रम राव', phoneNumber: '+91 88776 65544' }
];
