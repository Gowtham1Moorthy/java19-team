export type UserRole = 'STUDENT' | 'STAFF';
export type UserStatus = 'ACTIVE' | 'INACTIVE';
export type ResourceType = 'LAB' | 'CLASSROOM' | 'EVENT_HALL';
export type ResourceStatus = 'AVAILABLE' | 'UNAVAILABLE';
export type BookingStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface User {
  id?: number;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface Resource {
  id?: number;
  name: string;
  type: ResourceType;
  capacity: number;
  status: ResourceStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface Booking {
  id?: number;
  userId: number;
  userName?: string;
  userEmail?: string;
  resourceId: number;
  resourceName?: string;
  resourceType?: string;
  bookingDate: string;
  timeSlot: string;
  status: BookingStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalResources: number;
  totalBookings: number;
  pendingBookings: number;
  approvedBookings: number;
  rejectedBookings: number;
}
