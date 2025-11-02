import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { formatUnits, formatCurrency, getCurrentMonth, getPreviousMonth } from '../lib/formatters';
import { TrendingDown, TrendingUp } from 'lucide-react';

interface ComparisonChartProps {
  currentMonth: { units: number; cost: number };
  previousMonth: { units: number; cost: number };
  currency: 'INR' | 'USD' | 'EUR';
}

export const ComparisonChart: React.FC<ComparisonChartProps> = ({
  currentMonth,
  previousMonth,
  currency
}) => {
  const data = [
    {
      month: getPreviousMonth(),
      units: previousMonth.units,
      cost: previousMonth.cost,
      color: '#94a3b8'
    },
    {
      month: getCurrentMonth(),
      units: currentMonth.units,
      cost: currentMonth.cost,
      color: '#3b82f6'
    }
  ];

  const unitsDiff = currentMonth.units - previousMonth.units;
  const unitsPercentChange = ((unitsDiff / previousMonth.units) * 100).toFixed(1);
  const isImprovement = unitsDiff < 0;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-medium text-sm mb-2">{data.month}</p>
          <p className="text-sm text-blue-600">
            {formatUnits(data.units)}
          </p>
          <p className="text-sm text-purple-600">
            {formatCurrency(data.cost, currency)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Month-over-Month Comparison</CardTitle>
        <CardDescription>
          Current month vs previous month usage and cost
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Usage Change</p>
              <p className={`text-2xl font-semibold flex items-center gap-2 ${
                isImprovement ? 'text-green-600' : 'text-red-600'
              }`}>
                {isImprovement ? <TrendingDown size={24} /> : <TrendingUp size={24} />}
                {Math.abs(parseFloat(unitsPercentChange))}%
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">
                {isImprovement ? 'Saved' : 'Increased by'}
              </p>
              <p className="text-xl font-semibold">
                {formatUnits(Math.abs(unitsDiff))}
              </p>
              <p className="text-sm text-gray-600">
                {formatCurrency(Math.abs(currentMonth.cost - previousMonth.cost), currency)}
              </p>
            </div>
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="month" 
                stroke="#6b7280"
                style={{ fontSize: '14px' }}
              />
              <YAxis 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
                label={{ value: 'Usage (kWh)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="units" 
                radius={[8, 8, 0, 0]}
                name="Usage (kWh)"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="p-3 border border-gray-200 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">{getPreviousMonth()}</p>
            <p className="text-lg font-semibold">{formatUnits(previousMonth.units)}</p>
            <p className="text-sm text-gray-600">{formatCurrency(previousMonth.cost, currency)}</p>
          </div>
          <div className="p-3 border border-blue-200 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-700 mb-1">{getCurrentMonth()}</p>
            <p className="text-lg font-semibold text-blue-900">{formatUnits(currentMonth.units)}</p>
            <p className="text-sm text-blue-700">{formatCurrency(currentMonth.cost, currency)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
