import React from "react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export default function TheraKpiCard({
  label,
  value,
  helper,
  icon: Icon,
  tone = "slate",
}: {
  label: string;
  value: string | number;
  helper?: string;
  icon: LucideIcon;
  tone?: "slate" | "teal" | "blue" | "amber";
}) {
  const toneMap = {
    slate: "bg-slate-100 text-slate-700",
    teal: "bg-emerald-50 text-emerald-700",
    blue: "bg-blue-50 text-blue-700",
    amber: "bg-amber-50 text-amber-700",
  } as const;

  return (
    <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-medium text-slate-500">{label}</div>
            <div className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{value}</div>
            {helper ? <div className="mt-1 text-xs text-slate-500">{helper}</div> : null}
          </div>
          <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", toneMap[tone])}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </div>
    </Card>
  );
}
