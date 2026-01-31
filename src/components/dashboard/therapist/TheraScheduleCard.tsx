import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

type Apt = {
  id: string;
  client_id: string;
  start_time: string;
  end_time: string;
  status: string;
};

function formatTimeRange(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  const fmt = (d: Date) =>
    d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  return `${fmt(s)}–${fmt(e)}`;
}

const statusPill = (status: string) => {
  const base = "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium";
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

export default function TheraScheduleCard({
  title = "Today's schedule",
  viewAllHref,
  items,
}: {
  title?: string;
  viewAllHref?: string;
  items: Apt[];
}) {
  return (
    <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-slate-100 flex items-center justify-center">
              <Clock className="h-4 w-4 text-slate-700" />
            </div>
            <div className="text-base font-semibold text-slate-900">{title}</div>
          </div>
          {viewAllHref ? (
            <Link className="text-sm font-medium text-slate-600 hover:text-slate-900" href={viewAllHref}>
              View all →
            </Link>
          ) : null}
        </div>

        <div className="mt-4 space-y-3">
          {items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center">
              <div className="text-sm font-medium text-slate-900">No sessions today</div>
              <div className="mt-1 text-xs text-slate-500">Your day is clear.</div>
            </div>
          ) : (
            items.slice(0, 5).map((apt) => (
              <div
                key={apt.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900 truncate">
                      Client #{apt.client_id.substring(0, 8)}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      {formatTimeRange(apt.start_time, apt.end_time)}
                    </div>
                  </div>
                  <span className={statusPill(apt.status)}>{apt.status}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Card>
  );
}
