
import React from 'react';
import { CalendarIcon, UserCheck, Bell, GraduationCap, ClipboardEdit } from 'lucide-react';
import { RecentActivity as ActivityType } from '@/types';
import DashboardCard from './DashboardCard';

interface RecentActivityProps {
  activities: ActivityType[];
}

const RecentActivity = ({ activities }: RecentActivityProps) => {
  const getActivityIcon = (type: ActivityType['type']) => {
    switch (type) {
      case 'enrollment':
        return <UserCheck className="h-4 w-4" />;
      case 'attendance':
        return <ClipboardEdit className="h-4 w-4" />;
      case 'exam':
        return <GraduationCap className="h-4 w-4" />;
      case 'event':
      case 'notice':
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <DashboardCard className="h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Recent Activity</h3>
      </div>
      <div className="space-y-4 overflow-auto max-h-[400px] pr-2 -mr-2">
        {activities.map((activity) => (
          <div 
            key={activity.id} 
            className="flex gap-3 p-3 rounded-md hover:bg-accent/50 transition-colors animate-slide-in"
          >
            <div className="rounded-full bg-primary/10 p-2 h-8 w-8 flex items-center justify-center text-primary shrink-0">
              {getActivityIcon(activity.type)}
            </div>
            <div className="space-y-1 flex-1 min-w-0">
              <p className="font-medium text-sm">{activity.title}</p>
              <p className="text-xs text-muted-foreground line-clamp-2">{activity.description}</p>
              <div className="flex items-center text-xs text-muted-foreground">
                <CalendarIcon className="mr-1 h-3 w-3" />
                <span>
                  {activity.date} • {activity.time}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
};

export default RecentActivity;
