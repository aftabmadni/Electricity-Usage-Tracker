import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useAppliances } from '../contexts/ApplianceContext';
import { toast } from 'sonner';

interface AddApplianceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddApplianceModal: React.FC<AddApplianceModalProps> = ({ isOpen, onClose }) => {
  const { addAppliance } = useAppliances();
  const [name, setName] = useState('');
  const [powerWatts, setPowerWatts] = useState('');
  const [hoursPerDay, setHoursPerDay] = useState('');
  const [daysPerMonth, setDaysPerMonth] = useState('30');
  const [loading, setLoading] = useState(false);

  const handleReset = () => {
    setName('');
    setPowerWatts('');
    setHoursPerDay('');
    setDaysPerMonth('30');
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

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
      addAppliance({
        name: name.trim(),
        powerWatts: power,
        hoursPerDay: hours,
        daysPerMonth: days
      });

      toast.success('Appliance added successfully!');
      handleClose();
    } catch (error) {
      toast.error('Failed to add appliance');
      console.error('Add appliance error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Appliance</DialogTitle>
          <DialogDescription>
            Enter the details of the appliance you want to track
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Appliance Name</Label>
            <Input
              id="name"
              placeholder="e.g., Air Conditioner"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="power">Power Consumption (Watts)</Label>
            <Input
              id="power"
              type="number"
              placeholder="e.g., 1500"
              value={powerWatts}
              onChange={(e) => setPowerWatts(e.target.value)}
              min="0"
              step="1"
              required
            />
            <p className="text-xs text-gray-500">
              Check the appliance label or manual for power rating
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hours">Hours per Day</Label>
              <Input
                id="hours"
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
              <Label htmlFor="days">Days per Month</Label>
              <Input
                id="days"
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
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Appliance'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
