/**
 * BESPOKE COMPONENT: TheraSidePanel
 * Right sidebar for therapist dashboard
 * Based on TheraDash design + THERAPIST-RESEARCH.md specifications
 */

import React from 'react';
import { motion } from 'framer-motion';
import { 
  TheraCard, 
  TheraCardHeader, 
  TheraCardSection 
} from '../core/TheraCard';
import { TheraStatCard } from '../domain/TheraStatCard';
import { TheraAvatarWithText } from '../avatars/TheraAvatar';
import { TheraButton } from '../core/TheraButton';
import { TheraBadge } from '../core/TheraBadge';
import tokens from '@/styles/tokens';
import {
  Calendar,
  DollarSign,
  Bell,
  Plus,
  FileText,
  Mail,
  CreditCard,
  Settings,
  Clock,
  TrendingUp,
} from 'lucide-react';

export interface TheraSidePanelProps {
  /** Therapist profile data */
  therapist: {
    id: string;
    name: string;
    email: string;
    specialties?: string[];
  };
  
  /** Today's schedule data */
  todaySchedule?: {
    total: number;
    completed: number;
    upcoming: number;
    nextSession?: {
      clientName: string;
      time: string;
      duration: number;
    };
  };
  
  /** Revenue data */
  revenue?: {
    today: number;
    week: number;
    month: number;
    trend?: number; // percentage change
  };
  
  /** Notifications */
  notifications?: Array<{
    id: string;
    type: 'payment' | 'session' | 'message' | 'alert';
    message: string;
    time: string;
    read: boolean;
  }>;
  
  /** Quick action handlers */
  onNewNote?: () => void;
  onScheduleAppointment?: () => void;
  onMessageClient?: () => void;
  onGenerateInvoice?: () => void;
  
  /** Additional className */
  className?: string;
}

export function TheraSidePanel({
  therapist,
  todaySchedule = { total: 0, completed: 0, upcoming: 0 },
  revenue = { today: 0, week: 0, month: 0 },
  notifications = [],
  onNewNote,
  onScheduleAppointment,
  onMessageClient,
  onGenerateInvoice,
  className = '',
}: TheraSidePanelProps) {
  const unreadNotifications = notifications.filter(n => !n.read).length;
  
  return (
    <motion.aside
      className={`w-full lg:w-80 space-y-6 ${className}`}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <TheraCard padding="default">
          <div className="flex items-center justify-between mb-4">
            <TheraAvatarWithText
              userId={therapist.id}
              name={therapist.name}
              subtitle={therapist.email}
              variant="therapist"
              size={56}
              isOnline={true}
            />
            <TheraButton
              variant="ghost"
              size="small"
              icon={Settings}
              onClick={() => window.location.href = '/dashboard/therapist/settings'}
              aria-label="Settings"
            />
          </div>
          
          {therapist.specialties && therapist.specialties.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {therapist.specialties.slice(0, 3).map((specialty, i) => (
                <TheraBadge key={i} variant="primary" size="small">
                  {specialty}
                </TheraBadge>
              ))}
            </div>
          )}
        </TheraCard>
      </motion.div>

      {/* Today's Schedule */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <TheraCard padding="default">
          <TheraCardHeader
            title="Today's Schedule"
            icon={Calendar}
            iconColor="primary"
            action={
              <TheraBadge variant="neutral" size="small">
                {todaySchedule.total} sessions
              </TheraBadge>
            }
          />
          
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span style={{ color: tokens.colors.text.secondary }}>Completed</span>
              <span style={{ color: tokens.colors.text.primary, fontWeight: 600 }}>
                {todaySchedule.completed}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span style={{ color: tokens.colors.text.secondary }}>Upcoming</span>
              <span style={{ color: tokens.colors.text.primary, fontWeight: 600 }}>
                {todaySchedule.upcoming}
              </span>
            </div>
          </div>
          
          {todaySchedule.nextSession && (
            <TheraCardSection>
              <div className="flex items-start gap-3">
                <div
                  className="flex-shrink-0 flex items-center justify-center rounded-lg"
                  style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: `${tokens.colors.primary.DEFAULT}1A`,
                  }}
                >
                  <Clock
                    className="w-4 h-4"
                    style={{ color: tokens.colors.primary.DEFAULT }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs" style={{ color: tokens.colors.text.muted }}>
                    Next Session
                  </div>
                  <div className="font-semibold text-sm" style={{ color: tokens.colors.text.primary }}>
                    {todaySchedule.nextSession.clientName}
                  </div>
                  <div className="text-xs" style={{ color: tokens.colors.text.secondary }}>
                    {todaySchedule.nextSession.time} · {todaySchedule.nextSession.duration} min
                  </div>
                </div>
              </div>
            </TheraCardSection>
          )}
          
          <div className="mt-4">
            <TheraButton
              variant="ghost"
              size="small"
              fullWidth
              onClick={() => window.location.href = '/dashboard/therapist/schedule'}
            >
              View Full Schedule →
            </TheraButton>
          </div>
        </TheraCard>
      </motion.div>

      {/* Revenue Snapshot */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <TheraStatCard
          label="Earnings"
          value={`£${revenue.today.toLocaleString()}`}
          helper="Today"
          icon={DollarSign}
          tone="success"
          trend={revenue.trend ? {
            value: revenue.trend,
            isPositive: revenue.trend > 0,
          } : undefined}
        />
        
        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between text-sm px-6">
            <span style={{ color: tokens.colors.text.secondary }}>This Week</span>
            <span style={{ color: tokens.colors.text.primary, fontWeight: 600 }}>
              £{revenue.week.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm px-6">
            <span style={{ color: tokens.colors.text.secondary }}>This Month</span>
            <span style={{ color: tokens.colors.text.primary, fontWeight: 600 }}>
              £{revenue.month.toLocaleString()}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <TheraCard padding="default">
          <TheraCardHeader
            title="Quick Actions"
            icon={Plus}
            iconColor="primary"
          />
          
          <div className="mt-4 space-y-2">
            <TheraButton
              variant="outline"
              size="small"
              fullWidth
              icon={FileText}
              onClick={onNewNote}
            >
              New Session Note
            </TheraButton>
            <TheraButton
              variant="outline"
              size="small"
              fullWidth
              icon={Calendar}
              onClick={onScheduleAppointment}
            >
              Schedule Appointment
            </TheraButton>
            <TheraButton
              variant="outline"
              size="small"
              fullWidth
              icon={Mail}
              onClick={onMessageClient}
            >
              Message Client
            </TheraButton>
            <TheraButton
              variant="outline"
              size="small"
              fullWidth
              icon={CreditCard}
              onClick={onGenerateInvoice}
            >
              Generate Invoice
            </TheraButton>
          </div>
        </TheraCard>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <TheraCard padding="default">
          <TheraCardHeader
            title="Notifications"
            icon={Bell}
            iconColor="coral"
            action={
              unreadNotifications > 0 ? (
                <TheraBadge variant="error" size="small">
                  {unreadNotifications}
                </TheraBadge>
              ) : null
            }
          />
          
          <div className="mt-4 space-y-3 max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="text-center py-6">
                <div className="text-sm" style={{ color: tokens.colors.text.muted }}>
                  No new notifications
                </div>
              </div>
            ) : (
              notifications.slice(0, 5).map((notif) => (
                <div
                  key={notif.id}
                  className={`p-3 rounded-lg ${
                    !notif.read ? 'bg-blue-50' : 'bg-slate-50'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {getNotificationIcon(notif.type)}
                    <div className="min-w-0 flex-1">
                      <div
                        className="text-xs font-medium"
                        style={{ color: tokens.colors.text.primary }}
                      >
                        {notif.message}
                      </div>
                      <div
                        className="text-xs mt-1"
                        style={{ color: tokens.colors.text.muted }}
                      >
                        {notif.time}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {notifications.length > 5 && (
            <div className="mt-4">
              <TheraButton
                variant="ghost"
                size="small"
                fullWidth
                onClick={() => window.location.href = '/dashboard/therapist/notifications'}
              >
                View All →
              </TheraButton>
            </div>
          )}
        </TheraCard>
      </motion.div>

      {/* This Week Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <TheraCard padding="default">
          <TheraCardHeader
            title="This Week"
            icon={TrendingUp}
            iconColor="success"
          />
          
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: tokens.colors.text.secondary }}>
                Sessions
              </span>
              <span className="text-sm font-semibold" style={{ color: tokens.colors.text.primary }}>
                18 / 20
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div
                className="h-2 rounded-full"
                style={{
                  width: '90%',
                  backgroundColor: tokens.colors.status.success,
                }}
              />
            </div>
            <div className="text-xs" style={{ color: tokens.colors.text.muted }}>
              Utilization: 90%
            </div>
          </div>
        </TheraCard>
      </motion.div>
    </motion.aside>
  );
}

// Helper function for notification icons
function getNotificationIcon(type: 'payment' | 'session' | 'message' | 'alert') {
  const iconProps = {
    className: 'w-4 h-4 flex-shrink-0',
    style: { color: tokens.colors.primary.DEFAULT },
  };
  
  switch (type) {
    case 'payment':
      return <DollarSign {...iconProps} style={{ color: tokens.colors.status.success }} />;
    case 'session':
      return <Calendar {...iconProps} />;
    case 'message':
      return <Mail {...iconProps} style={{ color: tokens.colors.secondary.purple }} />;
    case 'alert':
      return <Bell {...iconProps} style={{ color: tokens.colors.status.warning }} />;
    default:
      return <Bell {...iconProps} />;
  }
}

export default TheraSidePanel;
