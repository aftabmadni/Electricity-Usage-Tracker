import React from "react";
import { useAppliances } from "../contexts/ApplianceContext";
import { formatCurrency, formatUnits } from "../lib/formatters";
import { Appliance, calculateApplianceUsage } from "../lib/applianceTypes";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "./ui/sidebar";
import { Zap, DollarSign, Calendar, BarChart2 } from "lucide-react";

const getDaysInCurrentMonth = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
};

const getCurrentMonthDay = () => {
  return new Date().getDate();
};

export const UsageSummarySidebar: React.FC = () => {
  const { appliances } = useAppliances();
  const currentDay = getCurrentMonthDay();
  const daysInMonth = getDaysInCurrentMonth();

  // Utility functions for calculations
  const getDaysSinceCreation = (createdAt: string) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffTime = Math.abs(now.getTime() - created.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Calculate current usage and projections
  const usageStats = React.useMemo(() => {
    const costPerKWh = 8; // ₹8 per kWh

    const stats = appliances.reduce(
      (acc, app) => {
        const daysSinceAdded = Math.min(
          currentDay,
          getDaysSinceCreation(app.createdAt)
        );
        const dailyKWh = (app.powerWatts * app.hoursPerDay) / 1000;

        acc.currentUsage += dailyKWh * daysSinceAdded;
        acc.projectedMonthly += dailyKWh * daysInMonth;
        acc.dailyAverage += dailyKWh;
        return acc;
      },
      {
        currentUsage: 0,
        projectedMonthly: 0,
        dailyAverage: 0,
        currentCost: 0,
        projectedCost: 0,
        dailyCost: 0,
      } as any
    );

    stats.currentCost = stats.currentUsage * costPerKWh;
    stats.projectedCost = stats.projectedMonthly * costPerKWh;
    stats.dailyCost = stats.dailyAverage * costPerKWh;

    return stats as {
      currentUsage: number;
      projectedMonthly: number;
      dailyAverage: number;
      currentCost: number;
      projectedCost: number;
      dailyCost: number;
    };
  }, [appliances, currentDay, daysInMonth]);

  const usageItems = [
    {
      icon: <Zap className="w-4 h-4" />,
      label: "Current Month",
      value: formatUnits(usageStats.currentUsage),
      subValue: formatCurrency(usageStats.currentCost, "INR"),
      subLabel: `${currentDay} days`,
    },
    {
      icon: <Calendar className="w-4 h-4" />,
      label: "Projected Month",
      value: formatUnits(usageStats.projectedMonthly),
      subValue: formatCurrency(usageStats.projectedCost, "INR"),
      subLabel: "Full Month",
    },
    {
      icon: <BarChart2 className="w-4 h-4" />,
      label: "Daily Total",
      value: formatUnits(usageStats.dailyAverage),
      subValue: formatCurrency(usageStats.dailyCost, "INR"),
      subLabel: "All Devices",
    },
  ];

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Usage Summary (Day {currentDay})</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {usageItems.map((item, index) => (
            <SidebarMenuItem key={index}>
              <SidebarMenuButton className="flex-col items-start h-auto py-3">
                <div className="flex items-center gap-2 w-full mb-1">
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                  <span className="ml-auto text-xs text-gray-500">
                    {item.subLabel}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-semibold">{item.value}</span>
                  <span className="text-sm text-gray-500">{item.subValue}</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
