import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { CarbonFootprint } from '../lib/types';
import { Leaf, TreeDeciduous, Car } from 'lucide-react';
import { Progress } from './ui/progress';

interface CarbonFootprintGaugeProps {
  footprint: CarbonFootprint;
}

export const CarbonFootprintGauge: React.FC<CarbonFootprintGaugeProps> = ({
  footprint
}) => {
  // Calculate gauge percentage (assuming max of 500kg for visualization)
  const maxCO2 = 500;
  const percentage = Math.min((footprint.co2Kg / maxCO2) * 100, 100);
  
  // Determine color based on footprint level
  const getColorScheme = () => {
    if (percentage < 30) return { 
      color: 'text-green-600', 
      bg: 'bg-green-100', 
      progress: 'bg-green-500',
      label: 'Excellent' 
    };
    if (percentage < 60) return { 
      color: 'text-yellow-600', 
      bg: 'bg-yellow-100', 
      progress: 'bg-yellow-500',
      label: 'Good' 
    };
    return { 
      color: 'text-red-600', 
      bg: 'bg-red-100', 
      progress: 'bg-red-500',
      label: 'High' 
    };
  };

  const colorScheme = getColorScheme();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-green-600" />
              Carbon Footprint
            </CardTitle>
            <CardDescription>
              Environmental impact of your electricity usage
            </CardDescription>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm ${colorScheme.bg} ${colorScheme.color}`}>
            {colorScheme.label}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Main CO2 Display */}
        <div className="text-center mb-6">
          <div className="inline-block p-8 bg-gradient-to-br from-green-50 to-blue-50 rounded-full mb-4">
            <div className="text-4xl font-bold text-gray-900">
              {footprint.co2Kg}
              <span className="text-2xl text-gray-600"> kg</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">CO₂ Emissions</p>
          </div>

          <div className="max-w-md mx-auto">
            <Progress value={percentage} className="h-3 mb-2" />
            <p className="text-xs text-gray-500">
              This month's carbon emissions
            </p>
          </div>
        </div>

        {/* Equivalents */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`p-4 rounded-lg border ${colorScheme.bg} border-green-200`}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                <TreeDeciduous className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-gray-900">
                  {footprint.treesEquivalent.toFixed(1)}
                </p>
                <p className="text-sm text-gray-600">Trees needed to offset</p>
                <p className="text-xs text-gray-500">(for one year)</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg border bg-blue-50 border-blue-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                <Car className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-gray-900">
                  {(footprint.co2Kg / 0.411).toFixed(0)}
                </p>
                <p className="text-sm text-gray-600">Kilometers by car</p>
                <p className="text-xs text-gray-500">(equivalent driving)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
          <p className="text-sm font-medium text-gray-900 mb-2">💡 Ways to reduce your carbon footprint:</p>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Switch to LED bulbs to cut lighting emissions by 75%</li>
            <li>• Unplug devices when not in use to prevent phantom load</li>
            <li>• Use natural ventilation instead of AC when possible</li>
            <li>• Run full loads in washing machines and dishwashers</li>
          </ul>
        </div>

        {/* Comparison */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            {footprint.comparisonText}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
