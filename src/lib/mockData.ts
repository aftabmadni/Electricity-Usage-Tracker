// Mock data generator for WattWise
import { 
  UsageData, 
  User, 
  AIInsight, 
  DeviceUsage, 
  PaymentHistory,
  CarbonFootprint,
  SavingStreak,
  Notification,
  Prediction,
  AggregatedUsage
} from './types';

// Seed for consistent random data
const seededRandom = (seed: number) => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

// Generate hourly usage data for the last 12 months
export const generateUsageData = (months: number = 12): UsageData[] => {
  const data: UsageData[] = [];
  const now = new Date();
  const devicesIds = ['ac-1', 'fridge-1', 'heater-1', 'lights-1', 'tv-1', 'washer-1'];
  
  for (let day = months * 30; day >= 0; day--) {
    for (let hour = 0; hour < 24; hour++) {
      const timestamp = new Date(now.getTime() - day * 24 * 60 * 60 * 1000 - hour * 60 * 60 * 1000);
      
      // Base load varies by hour (higher during day, lower at night)
      let baseLoad = 0.5;
      if (hour >= 6 && hour <= 9) baseLoad = 2.5; // Morning peak
      if (hour >= 18 && hour <= 23) baseLoad = 3.5; // Evening peak
      if (hour >= 0 && hour <= 5) baseLoad = 0.3; // Night minimum
      if (hour >= 10 && hour <= 17) baseLoad = 1.5; // Day baseline
      
      // Seasonal variation (higher in summer for AC)
      const month = timestamp.getMonth();
      const seasonalFactor = (month >= 3 && month <= 8) ? 1.5 : 1.0;
      
      // Random variation
      const randomFactor = 0.8 + seededRandom(day * 24 + hour) * 0.4;
      
      const unitsConsumed = baseLoad * seasonalFactor * randomFactor;
      const cost = unitsConsumed * 8; // ₹8 per kWh average
      
      data.push({
        timestamp: timestamp.toISOString(),
        unitsConsumed: parseFloat(unitsConsumed.toFixed(2)),
        deviceId: devicesIds[hour % devicesIds.length],
        temperature: 20 + seededRandom(day * 24 + hour + 100) * 15,
        regionCode: 'IN-MH',
        cost: parseFloat(cost.toFixed(2))
      });
    }
  }
  
  return data.reverse();
};

// Mock user data
export const mockUser: User = {
  id: 'user-001',
  email: 'demo@wattwise.app',
  name: 'Demo User',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Demo',
  createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
  preferences: {
    currency: 'INR',
    units: 'kWh',
    monthlyBudget: 2000,
    notifications: {
      email: true,
      push: true,
      aiInsights: true
    },
    language: 'en'
  }
};

// AI-generated insights with realistic messages
export const generateAIInsights = (): AIInsight[] => {
  return [
    {
      id: 'insight-1',
      type: 'warning',
      title: 'AC Usage Spike Detected',
      message: 'Your AC usage increased by 18% between 6-9 PM compared to last week. Setting temperature to 25°C instead of 23°C could save ₹450/month.',
      priority: 'high',
      actionable: true,
      action: 'Adjust AC settings',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      read: false
    },
    {
      id: 'insight-2',
      type: 'tip',
      title: 'Peak Hour Optimization',
      message: 'You consume 65% of electricity during peak hours (6-10 PM). Shifting washing machine and dishwasher to off-peak hours could save ₹320/month.',
      priority: 'medium',
      actionable: true,
      action: 'View schedule suggestions',
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      read: false
    },
    {
      id: 'insight-3',
      type: 'achievement',
      title: '🎉 7-Day Saving Streak!',
      message: 'Great job! You\'ve stayed under your daily target for 7 consecutive days. You\'re on track to save ₹850 this month.',
      priority: 'low',
      actionable: false,
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      read: false
    },
    {
      id: 'insight-4',
      type: 'anomaly',
      title: 'Unusual Night Usage',
      message: 'Detected 3.2 kWh consumption at 3 AM on Nov 1st. This is 4x higher than usual. Possible appliance left on?',
      priority: 'high',
      actionable: true,
      action: 'View details',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      read: true
    },
    {
      id: 'insight-5',
      type: 'tip',
      title: 'Refrigerator Efficiency',
      message: 'Your refrigerator consumes 15% more than optimal. Check door seals and defrost if needed. Could save ₹180/month.',
      priority: 'medium',
      actionable: true,
      action: 'Learn more',
      createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
      read: true
    }
  ];
};

// Device breakdown data
export const generateDeviceBreakdown = (): DeviceUsage[] => {
  return [
    {
      deviceId: 'ac-1',
      deviceName: 'Air Conditioner',
      deviceType: 'AC',
      percentage: 35,
      units: 105.5,
      cost: 844,
      color: '#3b82f6'
    },
    {
      deviceId: 'fridge-1',
      deviceName: 'Refrigerator',
      deviceType: 'Refrigerator',
      percentage: 20,
      units: 60.2,
      cost: 482,
      color: '#8b5cf6'
    },
    {
      deviceId: 'heater-1',
      deviceName: 'Water Heater',
      deviceType: 'Water Heater',
      percentage: 18,
      units: 54.1,
      cost: 433,
      color: '#ec4899'
    },
    {
      deviceId: 'lights-1',
      deviceName: 'Lighting',
      deviceType: 'Lights',
      percentage: 12,
      units: 36.1,
      cost: 289,
      color: '#f59e0b'
    },
    {
      deviceId: 'tv-1',
      deviceName: 'Television',
      deviceType: 'TV',
      percentage: 8,
      units: 24.1,
      cost: 193,
      color: '#10b981'
    },
    {
      deviceId: 'washer-1',
      deviceName: 'Washing Machine',
      deviceType: 'Washing Machine',
      percentage: 7,
      units: 21.1,
      cost: 169,
      color: '#06b6d4'
    }
  ];
};

// Payment history
export const generatePaymentHistory = (): PaymentHistory[] => {
  return [
    {
      id: 'pay-001',
      orderId: 'order_001',
      amount: 2410,
      currency: 'INR',
      status: 'success',
      method: 'razorpay',
      transactionId: 'txn_razorpay_001',
      billMonth: 'October 2024',
      paidAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      receipt: 'RCP-OCT-2024-001'
    },
    {
      id: 'pay-002',
      orderId: 'order_002',
      amount: 2180,
      currency: 'INR',
      status: 'success',
      method: 'upi',
      transactionId: 'upi_001',
      billMonth: 'September 2024',
      paidAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
      receipt: 'RCP-SEP-2024-002'
    },
    {
      id: 'pay-003',
      orderId: 'order_003',
      amount: 2650,
      currency: 'INR',
      status: 'success',
      method: 'razorpay',
      transactionId: 'txn_razorpay_002',
      billMonth: 'August 2024',
      paidAt: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000).toISOString(),
      receipt: 'RCP-AUG-2024-003'
    }
  ];
};

// Carbon footprint calculation
export const calculateCarbonFootprint = (unitsConsumed: number): CarbonFootprint => {
  const co2Kg = unitsConsumed * 0.92; // 0.92 kg CO2 per kWh (India average)
  const treesEquivalent = co2Kg / 21.77; // One tree absorbs ~21.77 kg CO2/year
  
  return {
    co2Kg: parseFloat(co2Kg.toFixed(2)),
    treesEquivalent: parseFloat(treesEquivalent.toFixed(2)),
    comparisonText: `Equivalent to ${(co2Kg / 411).toFixed(1)} km driven by car`
  };
};

// Saving streak
export const generateSavingStreak = (): SavingStreak => {
  return {
    currentStreak: 7,
    longestStreak: 14,
    goalProgress: 78,
    targetUnits: 250,
    actualUnits: 195
  };
};

// Notifications
export const generateNotifications = (): Notification[] => {
  return [
    {
      id: 'notif-1',
      type: 'insight',
      title: 'New AI Insight Available',
      message: 'AC usage spike detected during evening hours',
      read: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      link: '/dashboard'
    },
    {
      id: 'notif-2',
      type: 'payment',
      title: 'Payment Successful',
      message: 'Your October bill of ₹2,410 has been paid successfully',
      read: false,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      link: '/payments'
    },
    {
      id: 'notif-3',
      type: 'achievement',
      title: '7-Day Streak Achieved!',
      message: 'You\'ve saved energy for 7 consecutive days',
      read: true,
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'notif-4',
      type: 'alert',
      title: 'Budget Alert',
      message: 'You\'ve used 85% of your monthly budget',
      read: true,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      link: '/settings'
    }
  ];
};

// Prediction data
export const generatePrediction = (): Prediction => {
  return {
    predictedUnits: 285.5,
    predictedCost: 2284,
    confidenceInterval: {
      lower: 260.2,
      upper: 310.8
    },
    accuracy: 0.92,
    generatedAt: new Date().toISOString()
  };
};

// Aggregated usage helper
export const calculateAggregatedUsage = (data: UsageData[], period: 'today' | 'week' | 'month' | 'year'): AggregatedUsage => {
  const now = new Date();
  let startDate: Date;
  
  switch (period) {
    case 'today':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case 'week':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case 'year':
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
  }
  
  const filteredData = data.filter(d => new Date(d.timestamp) >= startDate);
  const totalUnits = filteredData.reduce((sum, d) => sum + d.unitsConsumed, 0);
  const totalCost = filteredData.reduce((sum, d) => sum + (d.cost || 0), 0);
  const days = Math.max(1, Math.ceil((now.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000)));
  
  // Find peak hours
  const hourlyUsage = new Array(24).fill(0);
  filteredData.forEach(d => {
    const hour = new Date(d.timestamp).getHours();
    hourlyUsage[hour] += d.unitsConsumed;
  });
  const peakHour = hourlyUsage.indexOf(Math.max(...hourlyUsage));
  const offPeakHour = hourlyUsage.indexOf(Math.min(...hourlyUsage.filter(u => u > 0)));
  
  return {
    period,
    totalUnits: parseFloat(totalUnits.toFixed(2)),
    totalCost: parseFloat(totalCost.toFixed(2)),
    avgDaily: parseFloat((totalUnits / days).toFixed(2)),
    peakHour,
    offPeakHour
  };
};
