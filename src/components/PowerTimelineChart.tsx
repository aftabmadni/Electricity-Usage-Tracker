import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { UsageData } from '../lib/types';
import { formatUnits, formatCurrency, formatDate } from '../lib/formatters';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface PowerTimelineChartProps {
  data: UsageData[];
  currency: 'INR' | 'USD' | 'EUR';
}

export const PowerTimelineChart: React.FC<PowerTimelineChartProps> = ({ data, currency }) => {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');

  // Aggregate data based on time range
  const aggregateData = () => {
    const now = new Date();
    let filteredData = [...data];
    let groupBy: 'hour' | 'day' = 'day';

    switch (timeRange) {
      case 'day':
        // Last 24 hours, group by hour
        const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        filteredData = data.filter(d => new Date(d.timestamp) >= yesterday);
        groupBy = 'hour';
        break;
      case 'week':
        // Last 7 days, group by day
        const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filteredData = data.filter(d => new Date(d.timestamp) >= lastWeek);
        groupBy = 'day';
        break;
      case 'month':
        // Last 30 days, group by day
        const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        filteredData = data.filter(d => new Date(d.timestamp) >= lastMonth);
        groupBy = 'day';
        break;
    }

    // Group data
    const grouped = new Map<string, { units: number; cost: number; count: number }>();

    filteredData.forEach(d => {
      const date = new Date(d.timestamp);
      let key: string;

      if (groupBy === 'hour') {
        key = `${date.getMonth()+1}/${date.getDate()} ${date.getHours()}:00`;
      } else {
        key = `${date.getMonth()+1}/${date.getDate()}`;
      }

      const existing = grouped.get(key) || { units: 0, cost: 0, count: 0 };
      grouped.set(key, {
        units: existing.units + d.unitsConsumed,
        cost: existing.cost + (d.cost || 0),
        count: existing.count + 1
      });
    });

    return Array.from(grouped.entries()).map(([time, values]) => ({
      time,
      units: parseFloat(values.units.toFixed(2)),
      cost: parseFloat(values.cost.toFixed(2))
    }));
  };

  const chartData = aggregateData();

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-medium text-sm mb-1">{payload[0].payload.time}</p>
          <p className="text-sm text-blue-600">
            {formatUnits(payload[0].value)}
          </p>
          <p className="text-sm text-purple-600">
            {formatCurrency(payload[1].value, currency)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Power Timeline</CardTitle>
            <CardDescription>
              Historical electricity usage and cost over time
            </CardDescription>
          </div>
          <Select value={timeRange} onValueChange={(v) => setTimeRange(v as any)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Last 24h</SelectItem>
              <SelectItem value="week">Last 7 days</SelectItem>
              <SelectItem value="month">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart 
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorUnits" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="time" 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="top" 
                height={36}
                iconType="circle"
              />
              <Area 
                type="monotone" 
                dataKey="units" 
                stroke="#3b82f6" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorUnits)"
                name="Usage (kWh)"
              />
              <Area 
                type="monotone" 
                dataKey="cost" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorCost)"
                name="Cost (₹)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
