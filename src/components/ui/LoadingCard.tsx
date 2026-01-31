import React from "react";
import { cn } from "@/lib/utils";

export function LoadingCard({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-slate-200 bg-white shadow-sm p-6", className)}>
      <div className="animate-pulse space-y-4">
        {/* Header skeleton */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 bg-slate-200 rounded-xl" />
          <div className="h-5 bg-slate-200 rounded w-1/3" />
        </div>

        {/* Content skeleton */}
        <div className="space-y-3">
          <div className="h-4 bg-slate-100 rounded w-full" />
          <div className="h-4 bg-slate-100 rounded w-5/6" />
          <div className="h-4 bg-slate-100 rounded w-4/6" />
        </div>
      </div>
    </div>
  );
}

export function LoadingKpiGrid({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
          <div className="animate-pulse space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-4 bg-slate-200 rounded w-1/2" />
              <div className="h-10 w-10 bg-slate-200 rounded-xl" />
            </div>
            <div className="h-8 bg-slate-200 rounded w-1/3" />
            <div className="h-3 bg-slate-100 rounded w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function LoadingTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
      <div className="animate-pulse space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-slate-200 rounded-xl" />
            <div className="h-5 bg-slate-200 rounded w-32" />
          </div>
          <div className="h-4 bg-slate-200 rounded w-20" />
        </div>

        {/* Rows */}
        <div className="space-y-2.5">
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-slate-200 p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-slate-200 rounded-full" />
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-32" />
                    <div className="h-3 bg-slate-100 rounded w-24" />
                  </div>
                </div>
                <div className="h-6 bg-slate-200 rounded w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function LoadingDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-pulse space-y-2">
        <div className="h-4 bg-slate-200 rounded w-24" />
        <div className="h-8 bg-slate-200 rounded w-64" />
        <div className="h-3 bg-slate-100 rounded w-48" />
      </div>

      {/* KPIs */}
      <LoadingKpiGrid count={4} />

      {/* Cards */}
      <div className="space-y-6">
        <LoadingCard />
        <LoadingTable rows={5} />
      </div>
    </div>
  );
}
