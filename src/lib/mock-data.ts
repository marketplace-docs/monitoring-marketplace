export type BacklogItem = {
  store: string;
  orderId: string;
  payment: 'Paid' | 'Pending';
  source: 'Amazon' | 'Shopify' | 'Ebay';
};

export const backlogData: BacklogItem[] = [
  { store: 'Main Warehouse', orderId: '#A1B2C3', payment: 'Paid', source: 'Shopify' },
  { store: 'North Depot', orderId: '#D4E5F6', payment: 'Paid', source: 'Amazon' },
  { store: 'East Hub', orderId: '#G7H8I9', payment: 'Pending', source: 'Ebay' },
  { store: 'Main Warehouse', orderId: '#J0K1L2', payment: 'Paid', source: 'Amazon' },
  { store: 'West Unit', orderId: '#M3N4O5', payment: 'Paid', source: 'Shopify' },
  { store: 'Main Warehouse', orderId: '#P6Q7R8', payment: 'Pending', source: 'Ebay' },
];

export type PerformanceData = {
  month: string;
  avg_time_min: number;
};

export const pickingPerformanceData: PerformanceData[] = [
  { month: 'Jan', avg_time_min: 5.2 },
  { month: 'Feb', avg_time_min: 5.5 },
  { month: 'Mar', avg_time_min: 5.1 },
  { month: 'Apr', avg_time_min: 4.8 },
  { month: 'May', avg_time_min: 4.7 },
  { month: 'Jun', avg_time_min: 4.5 },
];

export const packingPerformanceData: PerformanceData[] = [
  { month: 'Jan', avg_time_min: 3.1 },
  { month: 'Feb', avg_time_min: 3.3 },
  { month: 'Mar', avg_time_min: 3.0 },
  { month: 'Apr', avg_time_min: 2.9 },
  { month: 'May', avg_time_min: 2.8 },
  { month: 'Jun', avg_time_min: 2.7 },
];

export type ShippingPerformanceData = {
  month: string;
  avg_time_hours: number;
}

export const shippingPerformanceData: ShippingPerformanceData[] = [
  { month: 'Jan', avg_time_hours: 24.3 },
  { month: 'Feb', avg_time_hours: 23.0 },
  { month: 'Mar', avg_time_hours: 22.5 },
  { month: 'Apr', avg_time_hours: 21.0 },
  { month: 'May', avg_time_hours: 20.0 },
  { month: 'Jun', avg_time_hours: 19.8 },
];

export const stats = {
  totalPicked: 1245,
  totalPacked: 1198,
  totalShipped: 1150,
};
