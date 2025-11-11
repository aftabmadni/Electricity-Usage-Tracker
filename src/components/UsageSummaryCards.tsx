import React from "react";
import { Zap, TrendingUp, TrendingDown, Calendar } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { formatCurrency, formatUnits } from "../lib/formatters";
import { AggregatedUsage } from "../lib/types";

interface UsageSummaryCardsProps {
  today: AggregatedUsage;
  week: AggregatedUsage;
  month: AggregatedUsage;
  currency: "INR" | "USD" | "EUR";
}

export const UsageSummaryCards: React.FC<UsageSummaryCardsProps> = ({
  today,
  week,
  month,
  currency,
}) => {
  const cards = [
    {
      title: "Today",
      units: today.totalUnits,
      cost: today.totalCost,
      change: +8.2,
      icon: Zap,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "This Week",
      units: week.totalUnits,
      cost: week.totalCost,
      change: -5.1,
      icon: TrendingDown,
      gradient: "from-purple-500 to-pink-500",
    },
    {
      title: "This Month",
      units: month.totalUnits,
      cost: month.totalCost,
      change: -12.5,
      icon: Calendar,
      gradient: "from-orange-500 to-red-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        const isPositive = card.change > 0;
        const TrendIcon = isPositive ? TrendingUp : TrendingDown;

        return (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">{card.title}</p>
                  <div className="space-y-1">
                    <div className="flex items-baseline gap-2">
                      <p className="text-3xl font-semibold">
                        {formatUnits(card.units)}
                      </p>
                      <span className="text-base text-gray-500">kWh</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <p className="text-lg text-gray-700">
                        {formatCurrency(card.cost, currency)}
                      </p>
                      <span className="text-base text-gray-500">@ ₹8/kWh</span>
                    </div>
                  </div>
                  <div
                    className={`flex items-center gap-1 mt-2 text-sm ${
                      isPositive ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    <TrendIcon size={16} />
                    <span>{Math.abs(card.change)}%</span>
                    <span className="text-gray-500">vs last period</span>
                  </div>
                </div>
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-br ${card.gradient} flex items-center justify-center`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
