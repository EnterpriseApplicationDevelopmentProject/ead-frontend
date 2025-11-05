"use client";

import React from 'react';

interface StatItem {
  value: string | number;
  label: string;
}

interface EmployeeStatsCardProps {
  stats?: StatItem[];
}

export default function EmployeeStatsCard({ stats }: EmployeeStatsCardProps) {
  const defaultStats: StatItem[] = [
    { value: 156, label: 'Services Completed' },
    { value: 4.8, label: 'Average Rating' },
    { value: 2.5, label: 'Years of Service' },
  ];

  const displayStats = stats || defaultStats;

  return (
    <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-md p-6 text-white">
      <h3 className="text-lg font-bold mb-4">Quick Stats</h3>
      <div className="grid grid-cols-3 gap-4">
        {displayStats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="text-3xl font-bold mb-1">{stat.value}</div>
            <div className="text-sm text-blue-100">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
