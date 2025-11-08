import React, { useState, useEffect } from 'react';
import { UsageSummaryCards } from './UsageSummaryCards';
import { PowerTimelineChart } from './PowerTimelineChart';
import { useAppliances } from '../contexts/ApplianceContext';
import { PredictionChart } from './PredictionChart';
import { ComparisonChart } from './ComparisonChart';
import { DeviceBreakdownChart } from './DeviceBreakdownChart';
import { CarbonFootprintGauge } from './CarbonFootprintGauge';
import { SavingStreakWidget } from './SavingStreakWidget';
import { AIInsightsBox } from './AIInsightsBox';
import { ApplianceManagementSection } from './ApplianceManagementSection';
import { usageApi, insightsApi } from '../lib/mockApi';
import { Appliance } from '../lib/applianceTypes';
import { 
  UsageData, 
  AggregatedUsage, 
  Prediction, 
  AIInsight, 
  DeviceUsage,
  CarbonFootprint,
  SavingStreak
} from '../lib/types';
import { Skeleton } from './ui/skeleton';
import { Alert, AlertDescription } from './ui/alert';
import { AlertCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { BarChart3, Zap } from 'lucide-react';

interface DashboardPageProps {
  currency: 'INR' | 'USD' | 'EUR';
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ currency }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Data state
  const [usageData, setUsageData] = useState<UsageData[]>([]);
  // Removed todayUsage and weekUsage state, now calculated from appliances
  const [monthUsage, setMonthUsage] = useState<AggregatedUsage | null>(null);
  const [previousMonthUsage, setPreviousMonthUsage] = useState<AggregatedUsage | null>(null);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const { appliances } = useAppliances();
  const [carbonFootprint, setCarbonFootprint] = useState<CarbonFootprint | null>(null);
  const [savingStreak, setSavingStreak] = useState<SavingStreak | null>(null);
  
  // Utility functions for time calculations
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getDaysSinceCreation = (createdAt: string) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffTime = Math.abs(now.getTime() - created.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };


  // Helper to aggregate appliance usage for a given period
  function aggregateApplianceUsage(appliances: Appliance[], period: 'today' | 'week' | 'month'): AggregatedUsage {
    const costPerKWh = 8;
    const now = new Date();
    let days = 1;
    if (period === 'week') days = 7;
    if (period === 'month') days = getDaysInMonth(now);

    let totalUnits = 0;
    appliances.forEach(app => {
      // Only count usage for days since appliance was added
      const daysSinceAdded = Math.min(days, getDaysSinceCreation(app.createdAt));
      const dailyKWh = (app.powerWatts * app.hoursPerDay) / 1000;
      totalUnits += dailyKWh * daysSinceAdded;
    });
    const totalCost = totalUnits * costPerKWh;
    const avgDaily = days > 0 ? totalUnits / days : 0;
    return {
      period,
      totalUnits: parseFloat(totalUnits.toFixed(2)),
      totalCost: parseFloat(totalCost.toFixed(2)),
      avgDaily: parseFloat(avgDaily.toFixed(2)),
      peakHour: 0,
      offPeakHour: 0
    };
  }

  const todayUsage = React.useMemo(() => aggregateApplianceUsage(appliances, 'today'), [appliances]);
  const weekUsage = React.useMemo(() => aggregateApplianceUsage(appliances, 'week'), [appliances]);
  const computedMonthUsage = React.useMemo(() => aggregateApplianceUsage(appliances, 'month'), [appliances]);

  // Device breakdown for charts (month-to-date)
  const currentDays = React.useMemo(() => {
    const now = new Date();
    return now.getDate();
  }, []);
  const daysInMonth = getDaysInMonth(new Date());
  const devices: DeviceUsage[] = React.useMemo(() => {
    if (appliances.length === 0) return [];
    const costPerKWh = 8;
    // Calculate current month-to-date usage
    const totalUnits = appliances.reduce((sum, app) => {
      const daysSinceAdded = Math.min(currentDays, getDaysSinceCreation(app.createdAt));
      const dailyKWh = (app.powerWatts * app.hoursPerDay) / 1000;
      return sum + (dailyKWh * daysSinceAdded);
    }, 0);
    return appliances.map(app => {
      const daysSinceAdded = Math.min(currentDays, getDaysSinceCreation(app.createdAt));
      const dailyKWh = (app.powerWatts * app.hoursPerDay) / 1000;
      const actualUnits = dailyKWh * daysSinceAdded;
      const projectedUnits = dailyKWh * daysInMonth;
      const actualCost = actualUnits * costPerKWh;
      const projectedCost = projectedUnits * costPerKWh;
      const percentage = totalUnits > 0 ? (actualUnits / totalUnits) * 100 : 0;
      return {
        deviceId: app.id,
        deviceName: app.name,
        deviceType: app.name as any,
        percentage,
        units: actualUnits,
        projectedUnits,
        cost: actualCost,
        projectedCost,
        dailyKWh,
        daysActive: daysSinceAdded,
        color: `hsl(${Math.random() * 360}, 70%, 50%)`
      };
    }).sort((a, b) => b.percentage - a.percentage);
  }, [appliances, currentDays, daysInMonth]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load all data in parallel
      const [
        allUsageData,
        todayData,
        weekData,
        monthData,
        predictionData,
        insightsData,
        carbonData,
        streakData
      ] = await Promise.all([
        usageApi.getUsageData('month'),
        usageApi.getAggregatedUsage('today'),
        usageApi.getAggregatedUsage('week'),
        usageApi.getAggregatedUsage('month'),
        insightsApi.getPrediction(),
        insightsApi.getLatestInsights(),
        insightsApi.getCarbonFootprint(),
        insightsApi.getSavingStreak()
      ]);

      // Calculate previous month (mock)
      const prevMonth: AggregatedUsage = {
        period: 'month',
        totalUnits: monthData.totalUnits * 1.125, // 12.5% more last month
        totalCost: monthData.totalCost * 1.125,
        avgDaily: monthData.avgDaily * 1.125,
        peakHour: monthData.peakHour,
        offPeakHour: monthData.offPeakHour
      };

  setUsageData(allUsageData);
  setMonthUsage(monthData);
  setPreviousMonthUsage(prevMonth);
  setPrediction(predictionData);
  setInsights(insightsData);
  setCarbonFootprint(carbonData);
  setSavingStreak(streakData);
    } catch (err) {
      setError('Failed to load dashboard data. Please try again.');
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkInsightAsRead = async (insightId: string) => {
    try {
      await insightsApi.markInsightAsRead(insightId);
      setInsights(insights.map(i => 
        i.id === insightId ? { ...i, read: true } : i
      ));
    } catch (error) {
      console.error('Failed to mark insight as read:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-96" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Track your electricity usage and get AI-powered insights
        </p>
      </div>

      {/* Tabs for different sections */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="overview" className="gap-2">
            <BarChart3 size={16} />
            Overview
          </TabsTrigger>
          <TabsTrigger value="appliances" className="gap-2">
            <Zap size={16} />
            My Appliances
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Usage Summary Cards */}
          {todayUsage && weekUsage && computedMonthUsage && (
            <UsageSummaryCards
              today={todayUsage}
              week={weekUsage}
              month={computedMonthUsage}
              currency={currency}
            />
          )}

          {/* Power Timeline Chart */}
          <PowerTimelineChart data={usageData} currency={currency} />

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* AI Insights */}
            <AIInsightsBox 
              insights={insights} 
              onMarkAsRead={handleMarkInsightAsRead}
            />

            {/* Saving Streak */}
            {savingStreak && <SavingStreakWidget streak={savingStreak} />}
          </div>

          {/* Prediction Chart */}
          {prediction && computedMonthUsage && (
            <PredictionChart
              prediction={prediction}
              currentMonthUsage={computedMonthUsage.totalUnits}
              currency={currency}
            />
          )}

          {/* Comparison and Device Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Month Comparison */}
            {computedMonthUsage && previousMonthUsage && (
              <ComparisonChart
                currentMonth={{ units: computedMonthUsage.totalUnits, cost: computedMonthUsage.totalCost }}
                previousMonth={{ units: previousMonthUsage.totalUnits, cost: previousMonthUsage.totalCost }}
                currency={currency}
              />
            )}

            {/* Device Breakdown */}
            <DeviceBreakdownChart devices={devices} currency={currency} />
          </div>

          {/* Carbon Footprint */}
          {carbonFootprint && <CarbonFootprintGauge footprint={carbonFootprint} />}
        </TabsContent>

        {/* Appliances Tab */}
        <TabsContent value="appliances">
          <ApplianceManagementSection currency={currency} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
