import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { DeviceUsage } from '../lib/types';
import { formatUnits, formatCurrency, formatPercentage } from '../lib/formatters';
import { Badge } from './ui/badge';

interface DeviceBreakdownChartProps {
  devices: DeviceUsage[];
  currency: 'INR' | 'USD' | 'EUR';
}

export const DeviceBreakdownChart: React.FC<DeviceBreakdownChartProps> = ({
  devices,
  currency
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const device = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-medium text-sm mb-2">{device.deviceName}</p>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="text-gray-600">Usage: </span>
              <span className="font-medium">{formatUnits(device.units)}</span>
            </p>
            <p className="text-sm">
              <span className="text-gray-600">Cost: </span>
              <span className="font-medium">{formatCurrency(device.cost, currency)}</span>
            </p>
            <p className="text-sm">
              <span className="text-gray-600">Share: </span>
              <span className="font-medium">{formatPercentage(device.percentage)}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderLabel = (entry: any) => {
    return `${entry.percentage}%`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Device-Level Breakdown</CardTitle>
        <CardDescription>
          Simulated appliance usage distribution
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={devices}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderLabel}
                  outerRadius={100}
                  innerRadius={60}
                  fill="#8884d8"
                  dataKey="percentage"
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  {devices.map((device, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={device.color}
                      opacity={activeIndex === null || activeIndex === index ? 1 : 0.5}
                      style={{ 
                        transition: 'opacity 0.3s ease',
                        cursor: 'pointer'
                      }}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Device List */}
          <div className="space-y-3">
            {devices.map((device, index) => (
              <div
                key={device.deviceId}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${
                  activeIndex === index
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div
                      className="w-4 h-4 rounded-full mt-1 flex-shrink-0"
                      style={{ backgroundColor: device.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{device.deviceName}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {formatUnits(device.units)} • {formatCurrency(device.cost, currency)}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="flex-shrink-0">
                    {formatPercentage(device.percentage)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
          <div className="text-center">
            <p className="text-xs text-gray-600 mb-1">Top Consumer</p>
            <p className="font-medium text-sm">{devices[0]?.deviceName}</p>
            <p className="text-xs text-gray-500">{formatPercentage(devices[0]?.percentage)}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-600 mb-1">Total Devices</p>
            <p className="font-medium text-sm">{devices.length}</p>
            <p className="text-xs text-gray-500">Monitored</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-600 mb-1">Avg per Device</p>
            <p className="font-medium text-sm">
              {formatUnits(devices.reduce((sum, d) => sum + d.units, 0) / devices.length)}
            </p>
            <p className="text-xs text-gray-500">Usage</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
