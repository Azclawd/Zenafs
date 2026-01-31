import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { Calendar, Clock, User, ArrowRight } from "lucide-react";

type Appointment = {
  id: string;
  client_id: string;
  start_time: string;
  end_time: string;
  status: string;
  session_type?: string;
  notes?: string;
};

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return "Tomorrow";
  } else {
    return date.toLocaleDateString("en-GB", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getDuration(start: string, end: string) {
  const diff = new Date(end).getTime() - new Date(start).getTime();
  const minutes = Math.round(diff / 1000 / 60);
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  }
  return `${minutes}m`;
}

const statusPill = (status: string) => {
  const base =
    "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium";
  switch (status) {
    case "confirmed":
      return cn(base, "border-emerald-200 bg-emerald-50 text-emerald-700");
    case "pending":
      return cn(base, "border-amber-200 bg-amber-50 text-amber-700");
    case "cancelled":
      return cn(base, "border-rose-200 bg-rose-50 text-rose-700");
    default:
      return cn(base, "border-slate-200 bg-slate-50 text-slate-700");
  }
};

export default function TheraUpcomingTable({
  appointments,
  limit = 7,
}: {
  appointments: Appointment[];
  limit?: number;
}) {
  const upcoming = appointments
    .filter((apt) => new Date(apt.start_time) > new Date() && apt.status !== "cancelled")
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
    .slice(0, limit);

  if (upcoming.length === 0) {
    return (
      <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="p-6">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="h-9 w-9 rounded-xl bg-blue-100 flex items-center justify-center">
              <Calendar className="h-4 w-4 text-blue-700" />
            </div>
            <h2 className="text-base font-semibold text-slate-900">Upcoming sessions</h2>
          </div>

          <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center">
            <Calendar className="h-12 w-12 mx-auto text-slate-300" />
            <div className="mt-3 text-sm font-medium text-slate-900">No upcoming sessions</div>
            <div className="mt-1 text-xs text-slate-500">Your schedule is clear for now.</div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-blue-100 flex items-center justify-center">
              <Calendar className="h-4 w-4 text-blue-700" />
            </div>
            <h2 className="text-base font-semibold text-slate-900">Upcoming sessions</h2>
          </div>
          <Link
            href="/dashboard/therapist/appointments"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1 group"
          >
            View all
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="space-y-2.5">
          {upcoming.map((apt) => (
            <Link
              key={apt.id}
              href={`/dashboard/therapist/appointments`}
              className="block rounded-2xl border border-slate-200 bg-white p-4 hover:shadow-md hover:border-blue-300 transition-all group"
            >
              <div className="flex items-center justify-between gap-4">
                {/* Left: Date & Time */}
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-20 text-center">
                    <div className="text-xs font-medium text-slate-500 uppercase">
                      {formatDate(apt.start_time)}
                    </div>
                    <div className="mt-1 text-sm font-semibold text-slate-900">
                      {formatTime(apt.start_time)}
                    </div>
                  </div>

                  <div className="h-10 w-px bg-slate-200" />

                  {/* Client Info */}
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-700" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">
                        Client #{apt.client_id.substring(0, 8)}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        {getDuration(apt.start_time, apt.end_time)}
                        {apt.session_type && (
                          <>
                            <span className="text-slate-300">•</span>
                            <span className="capitalize">{apt.session_type}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Status */}
                <div className="flex items-center gap-3">
                  <span className={statusPill(apt.status)}>
                    {apt.status}
                  </span>
                  <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Card>
  );
}
