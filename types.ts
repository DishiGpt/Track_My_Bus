
export enum UserRole {
  STUDENT = 'STUDENT',
  DRIVER = 'DRIVER',
  COORDINATOR = 'COORDINATOR',
  ADMIN = 'ADMIN'
}

export interface Stop {
  id: string;
  name: string;
  nameHindi: string;
  scheduledTime: string;
  actualTime?: string;
  status: 'visited' | 'upcoming' | 'current' | 'delayed';
}

export interface Bus {
  id: string;
  busNumber: string;
  driverName: string;
  driverNameHindi: string;
  driverContact: string;
  route: string;
  routeHindi: string;
  stops: Stop[];
  isGpsActive?: boolean;
  isDisabled?: boolean;
}

export interface User {
  id: string;
  phoneNumber: string;
  password?: string;
  role: UserRole;
  name: string;
  email?: string;
}

export interface Driver {
  id: string;
  name: string;
  nameHindi: string;
  phoneNumber: string;
  assignedBus?: string;
}
