import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Calendar, Users, FileText } from "lucide-react";

export default function TheraRightRail({
  nextSession,
}: {
  nextSession?: { start: string; clientLabel: string; href?: string } | null;
}) {
  return (
    <div className="space-y-6">
      <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="p-5">
          <div className="text-xs font-medium text-slate-500">Up next</div>
          {nextSession ? (
            <>
              <div className="mt-2 text-base font-semibold text-slate-900">{nextSession.clientLabel}</div>
              <div className="mt-1 text-sm text-slate-600">
                {new Date(nextSession.start).toLocaleString("en-GB", {
                  weekday: "short",
                  day: "2-digit",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
              {nextSession.href ? (
                <div className="mt-4">
                  <Button asChild className="w-full">
                    <Link href={nextSession.href}>Open session</Link>
                  </Button>
                </div>
              ) : null}
            </>
          ) : (
            <div className="mt-2 text-sm text-slate-600">No upcoming sessions.</div>
          )}
        </div>
      </Card>

      <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="p-5">
          <div className="text-sm font-semibold text-slate-900">Quick actions</div>
          <div className="mt-4 space-y-2">
            <Button variant="outline" className="w-full justify-start rounded-xl" asChild>
              <Link href="/dashboard/therapist/appointments">
                <Calendar className="mr-2 h-4 w-4" /> Appointments
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start rounded-xl" asChild>
              <Link href="/dashboard/therapist/clients">
                <Users className="mr-2 h-4 w-4" /> Clients
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start rounded-xl" asChild>
              <Link href="/dashboard/sessions">
                <FileText className="mr-2 h-4 w-4" /> Session notes
              </Link>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
