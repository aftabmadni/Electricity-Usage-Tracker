import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { SavingStreak } from '../lib/types';
import { Trophy, Target, TrendingDown, Flame } from 'lucide-react';
import { Progress } from './ui/progress';
import { formatUnits } from '../lib/formatters';

interface SavingStreakWidgetProps {
  streak: SavingStreak;
}

export const SavingStreakWidget: React.FC<SavingStreakWidgetProps> = ({ streak }) => {
  const savedUnits = streak.targetUnits - streak.actualUnits;
  const savedPercentage = ((savedUnits / streak.targetUnits) * 100).toFixed(1);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-600" />
          Saving Streak & Goals
        </CardTitle>
        <CardDescription>
          Track your progress towards energy efficiency
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Streak Display */}
        <div className="mb-6 p-6 bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 rounded-xl border border-yellow-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Current Streak</p>
              <div className="flex items-center gap-2">
                <Flame className="w-8 h-8 text-orange-500" />
                <span className="text-4xl font-bold text-gray-900">
                  {streak.currentStreak}
                </span>
                <span className="text-lg text-gray-600">days</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">Personal Best</p>
              <div className="flex items-center gap-1">
                <Trophy className="w-5 h-5 text-yellow-600" />
                <span className="text-2xl font-semibold text-gray-900">
                  {streak.longestStreak}
                </span>
                <span className="text-sm text-gray-600">days</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-700">
            <TrendingDown className="w-4 h-4 text-green-600" />
            <span>
              Keep staying under your daily target to maintain your streak!
            </span>
          </div>
        </div>

        {/* Goal Progress */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              <span className="font-medium">Monthly Goal Progress</span>
            </div>
            <span className="text-sm font-semibold text-blue-600">
              {streak.goalProgress}%
            </span>
          </div>

          <Progress value={streak.goalProgress} className="h-3" />

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Target</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatUnits(streak.targetUnits)}
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-700 mb-1">Actual</p>
              <p className="text-lg font-semibold text-blue-900">
                {formatUnits(streak.actualUnits)}
              </p>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
          <p className="font-medium text-sm mb-3 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-purple-600" />
            Recent Achievements
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                🔥
              </div>
              <div>
                <p className="font-medium text-gray-900">Week Warrior</p>
                <p className="text-xs text-gray-600">7-day saving streak achieved</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                🎯
              </div>
              <div>
                <p className="font-medium text-gray-900">Goal Getter</p>
                <p className="text-xs text-gray-600">Hit monthly target 3 months in a row</p>
              </div>
            </div>
          </div>
        </div>

        {/* Motivation */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-700">
            You're saving{' '}
            <span className="font-semibold text-green-600">
              {formatUnits(savedUnits)}
            </span>
            {' '}({savedPercentage}%) this month! 🎉
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
