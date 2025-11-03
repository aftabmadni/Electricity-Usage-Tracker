import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Plus, Trash2, Zap, ArrowRight, Lightbulb } from 'lucide-react';
import { useAppliances } from '../contexts/ApplianceContext';
import { toast } from 'sonner';

interface ApplianceFormData {
  name: string;
  powerWatts: string;
  hoursPerDay: string;
  daysPerMonth: string;
}

const defaultAppliance: ApplianceFormData = {
  name: '',
  powerWatts: '',
  hoursPerDay: '',
  daysPerMonth: '30'
};

export const OnboardingPage: React.FC = () => {
  const { addAppliance, completeOnboarding } = useAppliances();
  const [applianceList, setApplianceList] = useState<ApplianceFormData[]>([
    { ...defaultAppliance }
  ]);
  const [loading, setLoading] = useState(false);

  const handleAddRow = () => {
    setApplianceList([...applianceList, { ...defaultAppliance }]);
  };

  const handleRemoveRow = (index: number) => {
    if (applianceList.length === 1) {
      toast.error('You must have at least one appliance');
      return;
    }
    setApplianceList(applianceList.filter((_, i) => i !== index));
  };

  const handleInputChange = (index: number, field: keyof ApplianceFormData, value: string) => {
    const updated = [...applianceList];
    updated[index][field] = value;
    setApplianceList(updated);
  };

  const validateForm = (): boolean => {
    for (let i = 0; i < applianceList.length; i++) {
      const appliance = applianceList[i];
      
      if (!appliance.name.trim()) {
        toast.error(`Appliance #${i + 1}: Name is required`);
        return false;
      }
      
      const power = parseFloat(appliance.powerWatts);
      if (isNaN(power) || power <= 0) {
        toast.error(`Appliance #${i + 1}: Power must be a positive number`);
        return false;
      }
      
      const hours = parseFloat(appliance.hoursPerDay);
      if (isNaN(hours) || hours < 0 || hours > 24) {
        toast.error(`Appliance #${i + 1}: Hours per day must be between 0 and 24`);
        return false;
      }
      
      const days = parseFloat(appliance.daysPerMonth);
      if (isNaN(days) || days < 0 || days > 31) {
        toast.error(`Appliance #${i + 1}: Days per month must be between 0 and 31`);
        return false;
      }
    }
    
    return true;
  };

  const handleSaveAndContinue = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Add all appliances
      applianceList.forEach(appliance => {
        addAppliance({
          name: appliance.name.trim(),
          powerWatts: parseFloat(appliance.powerWatts),
          hoursPerDay: parseFloat(appliance.hoursPerDay),
          daysPerMonth: parseFloat(appliance.daysPerMonth)
        });
      });

      // Complete onboarding
      completeOnboarding();
      
      toast.success(`Successfully added ${applianceList.length} appliance(s)!`, {
        description: 'Taking you to your dashboard...'
      });

      // Small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      toast.error('Failed to save appliances. Please try again.');
      console.error('Onboarding error:', error);
    } finally {
      setLoading(false);
    }
  };

  const commonAppliances = [
    { name: 'Air Conditioner', watts: 1500, hours: 8 },
    { name: 'Refrigerator', watts: 150, hours: 24 },
    { name: 'LED TV (55")', watts: 100, hours: 6 },
    { name: 'Washing Machine', watts: 500, hours: 1 },
    { name: 'Water Heater', watts: 2000, hours: 2 },
    { name: 'LED Lights (10)', watts: 100, hours: 6 }
  ];

  const handleQuickAdd = (template: typeof commonAppliances[0]) => {
    const lastIndex = applianceList.length - 1;
    if (applianceList[lastIndex].name === '') {
      // Fill the empty last row
      handleInputChange(lastIndex, 'name', template.name);
      handleInputChange(lastIndex, 'powerWatts', template.watts.toString());
      handleInputChange(lastIndex, 'hoursPerDay', template.hours.toString());
      handleInputChange(lastIndex, 'daysPerMonth', '30');
    } else {
      // Add new row with template
      setApplianceList([
        ...applianceList,
        {
          name: template.name,
          powerWatts: template.watts.toString(),
          hoursPerDay: template.hours.toString(),
          daysPerMonth: '30'
        }
      ]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4">
            <Zap className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-semibold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Let's set up your appliances ⚡
          </h1>
          <p className="text-gray-600 text-lg">
            Add your household appliances to start tracking energy consumption
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-600" />
              Quick Add Common Appliances
            </CardTitle>
            <CardDescription>
              Click to quickly add typical household appliances
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {commonAppliances.map((appliance, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAdd(appliance)}
                  className="justify-start text-xs"
                >
                  <Plus size={14} className="mr-1" />
                  {appliance.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Appliance Form */}
        <Card>
          <CardHeader>
            <CardTitle>Your Appliances</CardTitle>
            <CardDescription>
              Enter details for each appliance you want to track
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {applianceList.map((appliance, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 rounded-lg bg-white space-y-3"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm text-gray-700">
                    Appliance #{index + 1}
                  </span>
                  {applianceList.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveRow(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="md:col-span-2">
                    <Label htmlFor={`name-${index}`}>Appliance Name</Label>
                    <Input
                      id={`name-${index}`}
                      placeholder="e.g., Air Conditioner"
                      value={appliance.name}
                      onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor={`power-${index}`}>Power (Watts)</Label>
                    <Input
                      id={`power-${index}`}
                      type="number"
                      placeholder="e.g., 1500"
                      value={appliance.powerWatts}
                      onChange={(e) => handleInputChange(index, 'powerWatts', e.target.value)}
                      min="0"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`hours-${index}`}>Hours per Day</Label>
                    <Input
                      id={`hours-${index}`}
                      type="number"
                      placeholder="e.g., 8"
                      value={appliance.hoursPerDay}
                      onChange={(e) => handleInputChange(index, 'hoursPerDay', e.target.value)}
                      min="0"
                      max="24"
                      step="0.5"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor={`days-${index}`}>Days per Month</Label>
                    <Input
                      id={`days-${index}`}
                      type="number"
                      placeholder="e.g., 30"
                      value={appliance.daysPerMonth}
                      onChange={(e) => handleInputChange(index, 'daysPerMonth', e.target.value)}
                      min="0"
                      max="31"
                    />
                  </div>
                </div>
              </div>
            ))}

            <Button
              variant="outline"
              onClick={handleAddRow}
              className="w-full gap-2"
            >
              <Plus size={16} />
              Add Another Appliance
            </Button>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-center">
          <Button
            onClick={handleSaveAndContinue}
            disabled={loading}
            size="lg"
            className="gap-2 px-8"
          >
            {loading ? 'Saving...' : 'Save & Continue to Dashboard'}
            <ArrowRight size={18} />
          </Button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          You can add or modify appliances later from the dashboard
        </p>
      </div>
    </div>
  );
};
