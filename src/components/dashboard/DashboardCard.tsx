
import React from 'react';
import { cn } from '@/lib/utils';

interface DashboardCardProps {
  children: React.ReactNode;
  className?: string;
}

const DashboardCard = ({ children, className }: DashboardCardProps) => {
  return (
    <div 
      className={cn(
        "bg-card text-card-foreground rounded-lg border border-border p-6 shadow-sm transition-all duration-200 hover:shadow-md animate-fade-in",
        className
      )}
    >
      {children}
    </div>
  );
};

export default DashboardCard;
