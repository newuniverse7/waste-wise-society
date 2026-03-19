export interface User {
  id: string;
  name: string;
  email: string;
  society: string;
  flat: string;
  points: number;
  carbonSaved: number;
  joinedDate: string;
}

export interface Worker {
  id: string;
  name: string;
  email: string;
  phone: string;
  activePickups: number;
  completedToday: number;
  zone: string;
}

export type WasteType = "plastic" | "cardboard" | "e-waste";
export type PickupStatus = "pending" | "in_progress" | "completed";

export interface PickupRequest {
  id: string;
  userId: string;
  userName: string;
  society: string;
  flat: string;
  wasteType: WasteType;
  weight: number;
  status: PickupStatus;
  createdAt: string;
  completedAt?: string;
  workerId?: string;
  workerName?: string;
  qrCode: string;
  points: number;
  lat: number;
  lng: number;
  proofImage?: string;
}

export interface Notification {
  id: string;
  message: string;
  time: string;
  read: boolean;
  type: "success" | "info" | "reward" | "warning";
}

export interface RewardActivity {
  id: string;
  action: string;
  points: number;
  date: string;
}

export type UserRole = "user" | "admin" | "worker";

export interface AuthState {
  isAuthenticated: boolean;
  role: UserRole;
  userId: string;
  userName: string;
}
