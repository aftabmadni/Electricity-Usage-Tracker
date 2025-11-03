import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useAppliances } from '../contexts/ApplianceContext';
import { toast } from 'sonner';

interface EditApplianceModalProps {
  applianceId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const EditApplianceModal: React.FC<EditApplianceModalProps> = ({ 
  applianceId, 
  isOpen, 
  onClose 
}) => {
  const { appliances, updateAppliance } = useAppliances();
  const [name, setName] = useState('');
  const [powerWatts, setPowerWatts] = useState('');
  const [hoursPerDay, setHoursPerDay] = useState('');
  const [daysPerMonth, setDaysPerMonth] = useState('');
  const [loading, setLoading] = useState(false);

  // Load appliance data
  useEffect(() => {
    const appliance = appliances.find(a => a.id === applianceId);
    if (appliance) {
      setName(appliance.name);
      setPowerWatts(appliance.powerWatts.toString());
      setHoursPerDay(appliance.hoursPerDay.toString());
      setDaysPerMonth(appliance.daysPerMonth.toString());
    }
  }, [applianceId, appliances]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!name.trim()) {
      toast.error('Please enter an appliance name');
      return;
    }

    const power = parseFloat(powerWatts);
    if (isNaN(power) || power <= 0) {
      toast.error('Power must be a positive number');
      return;
    }

    const hours = parseFloat(hoursPerDay);
    if (isNaN(hours) || hours < 0 || hours > 24) {
      toast.error('Hours per day must be between 0 and 24');
      return;
    }

    const days = parseFloat(daysPerMonth);
    if (isNaN(days) || days < 0 || days > 31) {
      toast.error('Days per month must be between 0 and 31');
      return;
    }

    setLoading(true);

    try {
      updateAppliance(applianceId, {
        name: name.trim(),
        powerWatts: power,
        hoursPerDay: hours,
        daysPerMonth: days
      });

      toast.success('Appliance updated successfully!');
      onClose();
    } catch (error) {
      toast.error('Failed to update appliance');
      console.error('Update appliance error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Appliance</DialogTitle>
          <DialogDescription>
            Update the details of your appliance
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Appliance Name</Label>
            <Input
              id="edit-name"
              placeholder="e.g., Air Conditioner"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-power">Power Consumption (Watts)</Label>
            <Input
              id="edit-power"
              type="number"
              placeholder="e.g., 1500"
              value={powerWatts}
              onChange={(e) => setPowerWatts(e.target.value)}
              min="0"
              step="1"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-hours">Hours per Day</Label>
              <Input
                id="edit-hours"
                type="number"
                placeholder="e.g., 8"
                value={hoursPerDay}
                onChange={(e) => setHoursPerDay(e.target.value)}
                min="0"
                max="24"
                step="0.5"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-days">Days per Month</Label>
              <Input
                id="edit-days"
                type="number"
                placeholder="e.g., 30"
                value={daysPerMonth}
                onChange={(e) => setDaysPerMonth(e.target.value)}
                min="0"
                max="31"
                step="1"
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Appliance'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
