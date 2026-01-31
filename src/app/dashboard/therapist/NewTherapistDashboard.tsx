import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProfile, getTherapistClients, getTherapistAppointments } from "@/lib/database/queries";
import {
  Calendar,
  Users,
  TrendingUp,
  AlertCircle,
  Clock,
  Activity,
  Heart,
  MessageCircle,
} from "lucide-react";

import { TheraBento, TheraCard, TheraCardHeader } from "@/components/dashboard/bespoke/TheraBento";
import TheraKpiCard from "@/components/dashboard/bespoke/TheraKpiCard";
import MiniCalendar from "@/components/dashboard/bespoke/MiniCalendar";

export default async function NewTherapistDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const profile = await getProfile(user.id);

  if (!profile || profile.role !== "therapist") {
    redirect("/dashboard");
  }

  const clients = await getTherapistClients(user.id);
  const appointments = await getTherapistAppointments(user.id);

  const now = new Date();
  const upcomingAppointments = appointments.filter(
    (apt) => new Date(apt.start_time) > now && apt.status !== "cancelled"
  );

  const todayAppointments = upcomingAppointments.filter((apt) => {
    const aptDate = new Date(apt.start_time);
    return aptDate.toDateString() === now.toDateString();
  });

  const thisWeekAppointments = upcomingAppointments.filter((apt) => {
    const aptDate = new Date(apt.start_time);
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return aptDate <= weekFromNow;
  });

  const pendingAppointments = appointments.filter((apt) => apt.status === "pending");

  // Mock data for demonstration
  const weeklyStats = {
    sessionsCompleted: 18,
    avgSessionDuration: "52 min",
    clientSatisfaction: 4.8,
    revenue: "$2,340",
  };

  return (
    <div className="p-6 bg-gradient-dashboard min-h-screen">
      <TheraBento>
        {/* Header */}
        <TheraCard span={12} noPadding>
          <div className="mb-6">
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Therapist Portal
            </div>
            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              Welcome back, Dr. {profile?.full_name || "Therapist"}
            </h1>
            <p className="mt-1 text-sm text-slate-600">Your practice dashboard</p>
          </div>
        </TheraCard>

        {/* Stats Row */}
        <TheraCard span={3}>
          <TheraKpiCard
            title="Active Clients"
            value={clients.length}
            subtitle="Under your care"
            icon={Users}
            iconColor="teal"
            statusDot="confirmed"
          />
        </TheraCard>

        <TheraCard span={3}>
          <TheraKpiCard
            title="Today's Sessions"
            value={todayAppointments.length}
            subtitle="Scheduled for today"
            icon={Calendar}
            iconColor="coral"
            statusDot="confirmed"
          />
        </TheraCard>

        <TheraCard span={3}>
          <TheraKpiCard
            title="Pending"
            value={pendingAppointments.length}
            subtitle="Awaiting confirmation"
            icon={AlertCircle}
            iconColor="purple"
            statusDot="pending"
          />
        </TheraCard>

        <TheraCard span={3}>
          <TheraKpiCard
            title="This Week"
            value={thisWeekAppointments.length}
            subtitle="Upcoming sessions"
            icon={TrendingUp}
            iconColor="green"
            statusDot="confirmed"
          />
        </TheraCard>

        {/* Main Content Area (8 cols) + Right Sidebar (4 cols) */}
        <TheraCard span={8}>
          <TheraCardHeader
            title="Today's Schedule"
            badge="Live"
            badgeColor="teal"
            icon={
              <div className="icon-circle icon-circle-teal">
                <Clock className="w-5 h-5 text-white" />
              </div>
            }
          />

          {todayAppointments.length === 0 ? (
            <div className="py-12 text-center rounded-2xl border-2 border-dashed border-slate-200">
              <Calendar className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              <p className="text-sm font-medium text-slate-900">No sessions scheduled today</p>
              <p className="text-xs text-slate-500 mt-1">Enjoy your day off!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todayAppointments.slice(0, 5).map((apt) => {
                const startTime = new Date(apt.start_time).toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                });
                const endTime = new Date(apt.end_time).toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <div
                    key={apt.id}
                    className="flex items-center gap-4 p-4 rounded-2xl border border-slate-200 bg-white hover:shadow-md transition-all group"
                  >
                    <div className="flex-shrink-0 w-16 text-center">
                      <div className="text-xs text-slate-500 font-medium">{startTime}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{endTime}</div>
                    </div>

                    <div className="w-px h-12 bg-slate-200" />

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-100 to-cyan-200 flex items-center justify-center">
                          <span className="text-xs font-semibold text-cyan-700">
                            {apt.client_id.substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-900">
                            Client #{apt.client_id.substring(0, 8)}
                          </div>
                          <div className="text-xs text-slate-500">Initial consultation</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      <span
                        className={`status-pill status-pill-${
                          apt.status === "confirmed"
                            ? "confirmed"
                            : apt.status === "pending"
                            ? "pending"
                            : "cancelled"
                        }`}
                      >
                        {apt.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </TheraCard>

        {/* Right Sidebar */}
        <TheraCard span={4}>
          <MiniCalendar
            highlightedDates={upcomingAppointments.map((apt) => new Date(apt.start_time))}
          />
        </TheraCard>

        {/* Upcoming Sessions (Full Width) */}
        <TheraCard span={8}>
          <TheraCardHeader
            title="Upcoming Sessions"
            badge={`${upcomingAppointments.length} total`}
            badgeColor="coral"
            icon={
              <div className="icon-circle icon-circle-coral">
                <Activity className="w-5 h-5 text-white" />
              </div>
            }
          />

          {upcomingAppointments.length === 0 ? (
            <div className="py-12 text-center rounded-2xl border-2 border-dashed border-slate-200">
              <Calendar className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              <p className="text-sm font-medium text-slate-900">No upcoming sessions</p>
              <p className="text-xs text-slate-500 mt-1">Your schedule is clear</p>
            </div>
          ) : (
            <div className="space-y-2">
              {upcomingAppointments.slice(0, 7).map((apt) => {
                const date = new Date(apt.start_time);
                const today = new Date();
                const tomorrow = new Date(today);
                tomorrow.setDate(tomorrow.getDate() + 1);

                let dateLabel = "";
                if (date.toDateString() === today.toDateString()) {
                  dateLabel = "Today";
                } else if (date.toDateString() === tomorrow.toDateString()) {
                  dateLabel = "Tomorrow";
                } else {
                  dateLabel = date.toLocaleDateString("en-GB", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  });
                }

                const timeLabel = date.toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <div
                    key={apt.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white hover:border-cyan-300 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-14 text-center">
                        <div className="text-xs font-medium text-slate-500 uppercase">
                          {dateLabel}
                        </div>
                        <div className="text-sm font-semibold text-slate-900 mt-0.5">
                          {timeLabel}
                        </div>
                      </div>

                      <div className="w-px h-8 bg-slate-200" />

                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                        <span className="text-xs font-semibold text-purple-700">
                          {apt.client_id.substring(0, 2).toUpperCase()}
                        </span>
                      </div>

                      <div>
                        <div className="text-sm font-semibold text-slate-900">
                          Client #{apt.client_id.substring(0, 8)}
                        </div>
                        <div className="text-xs text-slate-500">50 min session</div>
                      </div>
                    </div>

                    <span
                      className={`status-pill status-pill-${
                        apt.status === "confirmed"
                          ? "confirmed"
                          : apt.status === "pending"
                          ? "pending"
                          : "cancelled"
                      }`}
                    >
                      {apt.status}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </TheraCard>

        {/* Quick Actions */}
        <TheraCard span={4}>
          <TheraCardHeader title="Quick Actions" badgeColor="purple" />
          <div className="space-y-2">
            <button className="w-full p-3 rounded-xl bg-gradient-to-br from-cyan-50 to-cyan-100 hover:from-cyan-100 hover:to-cyan-200 transition-all text-left group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-cyan-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">Schedule Session</div>
                  <div className="text-xs text-slate-600">Book new appointment</div>
                </div>
              </div>
            </button>

            <button className="w-full p-3 rounded-xl bg-gradient-to-br from-rose-50 to-rose-100 hover:from-rose-100 hover:to-rose-200 transition-all text-left group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-rose-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">Client Notes</div>
                  <div className="text-xs text-slate-600">View session notes</div>
                </div>
              </div>
            </button>

            <button className="w-full p-3 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 transition-all text-left group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                  <Heart className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">Wellness Check</div>
                  <div className="text-xs text-slate-600">Review client progress</div>
                </div>
              </div>
            </button>
          </div>
        </TheraCard>
      </TheraBento>
    </div>
  );
}
