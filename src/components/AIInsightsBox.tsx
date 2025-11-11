import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { AIInsight } from "../lib/types";
import {
  Brain,
  AlertTriangle,
  Lightbulb,
  Trophy,
  AlertCircle,
  ChevronRight,
  X,
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { formatRelativeTime } from "../lib/formatters";

interface AIInsightsBoxProps {
  insights: AIInsight[];
  onMarkAsRead: (insightId: string) => void;
}

export const AIInsightsBox: React.FC<AIInsightsBoxProps> = ({
  insights,
  onMarkAsRead,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getIcon = (type: AIInsight["type"]) => {
    switch (type) {
      case "warning":
        return AlertTriangle;
      case "tip":
        return Lightbulb;
      case "achievement":
        return Trophy;
      case "anomaly":
        return AlertCircle;
    }
  };

  const getColorScheme = (type: AIInsight["type"]) => {
    switch (type) {
      case "warning":
        return {
          bg: "bg-red-50",
          border: "border-red-200",
          icon: "text-red-600",
          badge: "bg-red-100 text-red-700",
        };
      case "tip":
        return {
          bg: "bg-blue-50",
          border: "border-blue-200",
          icon: "text-blue-600",
          badge: "bg-blue-100 text-blue-700",
        };
      case "achievement":
        return {
          bg: "bg-green-50",
          border: "border-green-200",
          icon: "text-green-600",
          badge: "bg-green-100 text-green-700",
        };
      case "anomaly":
        return {
          bg: "bg-orange-50",
          border: "border-orange-200",
          icon: "text-orange-600",
          badge: "bg-orange-100 text-orange-700",
        };
    }
  };

  const getPriorityBadge = (priority: AIInsight["priority"]) => {
    const variants = {
      high: "destructive",
      medium: "default",
      low: "secondary",
    };
    return variants[priority] as any;
  };

  // Show only unread insights, top 3
  const displayInsights = insights
    .filter((i) =>
      !i.read && i.title !== "7-Day Saving Streak!" && i.type !== "achievement"
    )
    .map((insight) => {
      // Fix expanded washing machine insight to show correct info
      if (
        insight.title === "Washing Machine Usage Timing" && insight.actionable
      ) {
        return {
          ...insight,
          action: "View washing machine schedule suggestions",
        };
      }
      return insight;
    })
    .slice(0, 3);

  return (
  <Card className="w-full" style={{ width: '100%' }}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-600" />
              AI-Powered Insights
            </CardTitle>
            <CardDescription>
              Personalized recommendations based on your usage patterns
            </CardDescription>
          </div>
          <Badge variant="outline" className="gap-1">
            <span className="w-2 h-2 bg-purple-600 rounded-full animate-pulse" />
            Live
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {displayInsights.length === 0 ? (
          <div className="text-center py-8">
            <Brain className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-600">
              No new insights at the moment. Keep using WattWise to get
              personalized recommendations!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayInsights.map((insight) => {
              const Icon = getIcon(insight.type);
              const colors = getColorScheme(insight.type);
              const isExpanded = expandedId === insight.id;

              return (
                <div
                  key={insight.id}
                  className={`p-4 rounded-lg border ${colors.bg} ${colors.border} transition-all`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 ${colors.icon} flex-shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="font-medium text-sm text-gray-900">
                          {insight.title}
                        </p>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Badge
                            variant={getPriorityBadge(insight.priority)}
                            className="text-xs"
                          >
                            {insight.priority}
                          </Badge>
                          <button
                            onClick={() => onMarkAsRead(insight.id)}
                            className="p-1 hover:bg-white rounded transition-colors"
                            aria-label="Dismiss"
                          >
                            <X size={14} className="text-gray-500" />
                          </button>
                        </div>
                      </div>

                      <p
                        className={`text-sm text-gray-700 ${
                          !isExpanded && "line-clamp-2"
                        }`}
                      >
                        {insight.message}
                      </p>

                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-gray-500">
                          {formatRelativeTime(insight.createdAt)}
                        </p>
                        {insight.actionable && insight.action && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs gap-1"
                            onClick={() =>
                              setExpandedId(isExpanded ? null : insight.id)
                            }
                          >
                            {insight.action}
                            <ChevronRight size={14} />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {isExpanded && insight.actionable && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-sm text-gray-700 mb-2">
                        <strong>What you can do:</strong>
                      </p>
                      <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                        {insight.title === "Washing Machine Usage Timing" ? (
                          <>
                            <li>Review your washing machine usage schedule</li>
                            <li>Try to run cycles during off-peak hours (10 AM - 4 PM)</li>
                            <li>Use eco-mode or quick wash settings to save energy</li>
                          </>
                        ) : (
                          <>
                            <li>Consider adjusting temperature settings</li>
                            <li>Enable smart scheduling features</li>
                          </>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Removed View All Insights button */}

        {/* WattWise Tracker Info */}
        <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
          <div className="flex items-start gap-2">
            <Brain className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-gray-700">
              <strong>About WattWise Tracker:</strong> WattWise helps you monitor and optimize your household electricity usage. Get appliance-level insights, cost-saving tips, and track your progress towards energy efficiency. Stay informed and make smarter energy choices with WattWise.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
