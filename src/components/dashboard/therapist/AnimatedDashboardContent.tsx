"use client";

import React from "react";
import { FadeInGrid, FadeIn } from "@/components/ui/FadeIn";
import TheraKpiCard from "@/components/dashboard/therapist/TheraKpiCard";
import TheraScheduleCard from "@/components/dashboard/therapist/TheraScheduleCard";
import TheraUpcomingTable from "@/components/dashboard/therapist/TheraUpcomingTable";
import { Calendar, Users, TrendingUp, AlertCircle } from "lucide-react";

interface AnimatedDashboardContentProps {
  clientsCount: number;
  todayCount: number;
  pendingCount: number;
  weekCount: number;
  todayAppointments: any[];
  upcomingAppointments: any[];
}

export default function AnimatedDashboardContent({
  clientsCount,
  todayCount,
  pendingCount,
  weekCount,
  todayAppointments,
  upcomingAppointments,
}: AnimatedDashboardContentProps) {
  return (
    <>
      <FadeInGrid cols={4} staggerDelay={80} className="!grid-cols-1 !sm:grid-cols-2 !xl:grid-cols-4">
        <TheraKpiCard
          label="Active clients"
          value={clientsCount}
          helper="Under your care"
          icon={Users}
          tone="blue"
        />
        <TheraKpiCard
          label="Today"
          value={todayCount}
          helper="Sessions scheduled"
          icon={Calendar}
          tone="teal"
        />
        <TheraKpiCard
          label="Pending"
          value={pendingCount}
          helper="Awaiting confirmation"
          icon={AlertCircle}
          tone="amber"
        />
        <TheraKpiCard
          label="This week"
          value={weekCount}
          helper="Upcoming sessions"
          icon={TrendingUp}
          tone="slate"
        />
      </FadeInGrid>

      <FadeIn delay={400}>
        <TheraScheduleCard
          viewAllHref="/dashboard/therapist/appointments"
          items={todayAppointments}
        />
      </FadeIn>

      <FadeIn delay={500}>
        <TheraUpcomingTable appointments={upcomingAppointments} limit={7} />
      </FadeIn>
    </>
  );
}
