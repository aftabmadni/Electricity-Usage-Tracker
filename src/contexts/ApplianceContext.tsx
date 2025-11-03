import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appliance } from '../lib/applianceTypes';

interface ApplianceContextType {
  appliances: Appliance[];
  addAppliance: (appliance: Omit<Appliance, 'id' | 'createdAt'>) => void;
  updateAppliance: (id: string, appliance: Omit<Appliance, 'id' | 'createdAt'>) => void;
  deleteAppliance: (id: string) => void;
  hasCompletedOnboarding: boolean;
  completeOnboarding: () => void;
  loading: boolean;
}

const ApplianceContext = createContext<ApplianceContextType | undefined>(undefined);

const STORAGE_KEY = 'wattwise_appliances';
const ONBOARDING_KEY = 'wattwise_onboarding_complete';

export const useAppliances = () => {
  const context = useContext(ApplianceContext);
  if (!context) {
    throw new Error('useAppliances must be used within ApplianceProvider');
  }
  return context;
};

export const ApplianceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appliances, setAppliances] = useState<Appliance[]>([]);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load appliances from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const onboardingComplete = localStorage.getItem(ONBOARDING_KEY);
      
      if (stored) {
        const parsed = JSON.parse(stored);
        setAppliances(parsed);
      }
      
      if (onboardingComplete === 'true') {
        setHasCompletedOnboarding(true);
      }
    } catch (error) {
      console.error('Failed to load appliances from localStorage:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save appliances to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(appliances));
      } catch (error) {
        console.error('Failed to save appliances to localStorage:', error);
      }
    }
  }, [appliances, loading]);

  const addAppliance = (applianceData: Omit<Appliance, 'id' | 'createdAt'>) => {
    const newAppliance: Appliance = {
      ...applianceData,
      id: `appliance-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    };
    setAppliances(prev => [...prev, newAppliance]);
  };

  const updateAppliance = (id: string, applianceData: Omit<Appliance, 'id' | 'createdAt'>) => {
    setAppliances(prev => prev.map(appliance => 
      appliance.id === id 
        ? { ...appliance, ...applianceData }
        : appliance
    ));
  };

  const deleteAppliance = (id: string) => {
    setAppliances(prev => prev.filter(appliance => appliance.id !== id));
  };

  const completeOnboarding = () => {
    setHasCompletedOnboarding(true);
    localStorage.setItem(ONBOARDING_KEY, 'true');
  };

  const value: ApplianceContextType = {
    appliances,
    addAppliance,
    updateAppliance,
    deleteAppliance,
    hasCompletedOnboarding,
    completeOnboarding,
    loading
  };

  return (
    <ApplianceContext.Provider value={value}>
      {children}
    </ApplianceContext.Provider>
  );
};
