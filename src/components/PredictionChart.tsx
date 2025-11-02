import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, Legend } from 'recharts';
import { Prediction } from '../lib/types';
import { formatUnits, formatCurrency } from '../lib/formatters';
import { TrendingUp, Brain } from 'lucide-react';
import { Badge } from './ui/badge';

interface PredictionChartProps {
  prediction: Prediction;
  currentMonthUsage: number;
  currency: 'INR' | 'USD' | 'EUR';
}

export const PredictionChart: React.FC<PredictionChartProps> = ({
  prediction,
  currentMonthUsage,
  currency
}) => {
  // Generate data for the chart showing current month progress and prediction
  const generateChartData = () => {
    const data = [];
    const daysInMonth = 30;
    const today = new Date().getDate();
    
    // Historical data (up to today)
    for (let day = 1; day <= today; day++) {
      const progressRatio = day / today;
      data.push({
        day: `Day ${day}`,
        actual: parseFloat((currentMonthUsage * progressRatio).toFixed(2)),
        predicted: null,
        lower: null,
        upper: null
      });
    }
    
    // Predicted data (from today to end of month)
    const remainingDays = daysInMonth - today;
    const remainingUsage = prediction.predictedUnits - currentMonthUsage;
    
    for (let i = 0; i <= remainingDays; i++) {
      const day = today + i;
      const progressRatio = i / remainingDays;
      
      data.push({
        day: `Day ${day}`,
        actual: i === 0 ? currentMonthUsage : null,
        predicted: currentMonthUsage + (remainingUsage * progressRatio),
        lower: currentMonthUsage + ((prediction.confidenceInterval.lower - currentMonthUsage) * progressRatio),
        upper: currentMonthUsage + ((prediction.confidenceInterval.upper - currentMonthUsage) * progressRatio)
      });
    }
    
    return data;
  };

  const chartData = generateChartData();

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-medium text-sm mb-2">{data.day}</p>
          {data.actual !== null && (
            <p className="text-sm text-blue-600">
              Actual: {formatUnits(data.actual)}
            </p>
          )}
          {data.predicted !== null && (
            <>
              <p className="text-sm text-purple-600">
                Predicted: {formatUnits(data.predicted)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Range: {formatUnits(data.lower)} - {formatUnits(data.upper)}
              </p>
            </>
          )}
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
            <div className="flex items-center gap-2 mb-1">
              <CardTitle>AI-Powered Prediction</CardTitle>
              <Badge variant="secondary" className="gap-1">
                <Brain size={12} />
                {(prediction.accuracy * 100).toFixed(0)}% Accurate
              </Badge>
            </div>
            <CardDescription>
              Next month forecast with confidence intervals
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
            <p className="text-sm text-blue-700 mb-1">Current Month Progress</p>
            <p className="text-2xl font-semibold text-blue-900">
              {formatUnits(currentMonthUsage)}
            </p>
            <p className="text-sm text-blue-600 mt-1">
              {formatCurrency(currentMonthUsage * 8, currency)}
            </p>
          </div>
          
          <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
            <p className="text-sm text-purple-700 mb-1">Predicted Next Month</p>
            <p className="text-2xl font-semibold text-purple-900">
              {formatUnits(prediction.predictedUnits)}
            </p>
            <p className="text-sm text-purple-600 mt-1">
              {formatCurrency(prediction.predictedCost, currency)}
            </p>
          </div>
          
          <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
            <p className="text-sm text-green-700 mb-1">Expected Savings</p>
            <p className="text-2xl font-semibold text-green-900 flex items-center gap-1">
              <TrendingUp size={20} />
              12.5%
            </p>
            <p className="text-sm text-green-600 mt-1">
              vs last month
            </p>
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart 
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorConfidence" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#c084fc" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#c084fc" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="day" 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
                interval="preserveStartEnd"
              />
              <YAxis 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
                label={{ value: 'Usage (kWh)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="top" 
                height={36}
                iconType="circle"
              />
              
              {/* Confidence interval area */}
              <Area
                type="monotone"
                dataKey="upper"
                stroke="none"
                fill="url(#colorConfidence)"
                fillOpacity={1}
                name="Confidence Range"
              />
              <Area
                type="monotone"
                dataKey="lower"
                stroke="none"
                fill="#ffffff"
                fillOpacity={1}
              />
              
              {/* Actual usage line */}
              <Line 
                type="monotone" 
                dataKey="actual" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={false}
                name="Actual Usage"
                connectNulls={false}
              />
              
              {/* Predicted usage line */}
              <Line 
                type="monotone" 
                dataKey="predicted" 
                stroke="#8b5cf6" 
                strokeWidth={3}
                strokeDasharray="5 5"
                dot={false}
                name="Predicted Usage"
                connectNulls={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
