import { PickupRequest, User, Worker, Notification, RewardActivity } from "./types";

export const mockUsers: User[] = [
  { id: "u1", name: "Priya Sharma", email: "priya@email.com", society: "Green Valley Towers", flat: "A-401", points: 1250, carbonSaved: 45.2, joinedDate: "2025-08-15" },
  { id: "u2", name: "Rahul Mehta", email: "rahul@email.com", society: "Sunrise Apartments", flat: "B-203", points: 980, carbonSaved: 32.1, joinedDate: "2025-09-01" },
  { id: "u3", name: "Anita Desai", email: "anita@email.com", society: "Green Valley Towers", flat: "C-102", points: 2100, carbonSaved: 68.9, joinedDate: "2025-07-20" },
  { id: "u4", name: "Vikram Patel", email: "vikram@email.com", society: "Lake View Complex", flat: "D-505", points: 760, carbonSaved: 22.3, joinedDate: "2025-10-10" },
  { id: "u5", name: "Sneha Kulkarni", email: "sneha@email.com", society: "Palm Heights", flat: "E-301", points: 1890, carbonSaved: 55.7, joinedDate: "2025-06-05" },
];

export const mockWorkers: Worker[] = [
  { id: "w1", name: "Suresh Kumar", email: "suresh@eco.com", phone: "9876543210", activePickups: 3, completedToday: 5, zone: "Zone A" },
  { id: "w2", name: "Ramesh Yadav", email: "ramesh@eco.com", phone: "9876543211", activePickups: 2, completedToday: 7, zone: "Zone B" },
  { id: "w3", name: "Amit Singh", email: "amit@eco.com", phone: "9876543212", activePickups: 1, completedToday: 4, zone: "Zone A" },
];

export const mockPickups: PickupRequest[] = [
  { id: "p1", userId: "u1", userName: "Priya Sharma", society: "Green Valley Towers", flat: "A-401", wasteType: "plastic", weight: 2.5, status: "completed", createdAt: "2026-03-18T09:00:00", completedAt: "2026-03-18T11:30:00", workerId: "w1", workerName: "Suresh Kumar", qrCode: "ECO-P1-2026", points: 25, lat: 19.1726, lng: 72.9512 },
  { id: "p2", userId: "u2", userName: "Rahul Mehta", society: "Sunrise Apartments", flat: "B-203", wasteType: "cardboard", weight: 5.0, status: "in_progress", createdAt: "2026-03-19T08:00:00", workerId: "w2", workerName: "Ramesh Yadav", qrCode: "ECO-P2-2026", points: 50, lat: 19.1800, lng: 72.9600 },
  { id: "p3", userId: "u3", userName: "Anita Desai", society: "Green Valley Towers", flat: "C-102", wasteType: "e-waste", weight: 1.2, status: "pending", createdAt: "2026-03-19T10:00:00", qrCode: "ECO-P3-2026", points: 60, lat: 19.1726, lng: 72.9512 },
  { id: "p4", userId: "u1", userName: "Priya Sharma", society: "Green Valley Towers", flat: "A-401", wasteType: "plastic", weight: 3.0, status: "pending", createdAt: "2026-03-19T11:00:00", qrCode: "ECO-P4-2026", points: 30, lat: 19.1726, lng: 72.9512 },
  { id: "p5", userId: "u5", userName: "Sneha Kulkarni", society: "Palm Heights", flat: "E-301", wasteType: "cardboard", weight: 4.5, status: "completed", createdAt: "2026-03-17T14:00:00", completedAt: "2026-03-17T16:00:00", workerId: "w1", workerName: "Suresh Kumar", qrCode: "ECO-P5-2026", points: 45, lat: 19.1650, lng: 72.9450 },
  { id: "p6", userId: "u4", userName: "Vikram Patel", society: "Lake View Complex", flat: "D-505", wasteType: "e-waste", weight: 0.8, status: "completed", createdAt: "2026-03-16T09:00:00", completedAt: "2026-03-16T12:00:00", workerId: "w3", workerName: "Amit Singh", qrCode: "ECO-P6-2026", points: 40, lat: 19.1900, lng: 72.9700 },
];

export const mockNotifications: Notification[] = [
  { id: "n1", message: "Your pickup request #ECO-P1 has been completed!", time: "2 hours ago", read: false, type: "success" },
  { id: "n2", message: "Worker Suresh Kumar is on the way for your pickup.", time: "3 hours ago", read: false, type: "info" },
  { id: "n3", message: "You earned 25 reward points!", time: "5 hours ago", read: true, type: "reward" },
  { id: "n4", message: "New pickup request submitted successfully.", time: "1 day ago", read: true, type: "info" },
];

export const mockRewardActivities: RewardActivity[] = [
  { id: "r1", action: "Plastic recycled - 2.5kg", points: 25, date: "2026-03-18" },
  { id: "r2", action: "Cardboard recycled - 5kg", points: 50, date: "2026-03-15" },
  { id: "r3", action: "Referral bonus", points: 100, date: "2026-03-10" },
  { id: "r4", action: "E-waste recycled - 1.2kg", points: 60, date: "2026-03-05" },
];

export const analyticsData = {
  totalWaste: 156.8,
  totalRequests: 342,
  activeUsers: 89,
  carbonSaved: 512.4,
  wasteByType: [
    { name: "Plastic", value: 45, fill: "hsl(var(--primary))" },
    { name: "Cardboard", value: 35, fill: "hsl(var(--accent))" },
    { name: "E-Waste", value: 20, fill: "hsl(var(--warning))" },
  ],
  weeklyPickups: [
    { day: "Mon", pickups: 12 },
    { day: "Tue", pickups: 19 },
    { day: "Wed", pickups: 15 },
    { day: "Thu", pickups: 22 },
    { day: "Fri", pickups: 18 },
    { day: "Sat", pickups: 25 },
    { day: "Sun", pickups: 8 },
  ],
  topSocieties: [
    { name: "Green Valley Towers", requests: 85, waste: 42.5 },
    { name: "Sunrise Apartments", requests: 62, waste: 31.0 },
    { name: "Palm Heights", requests: 58, waste: 29.0 },
    { name: "Lake View Complex", requests: 45, waste: 22.5 },
  ],
};
