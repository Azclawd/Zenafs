"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Search, MoreHorizontal, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ClientsPage() {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-stone-900">My Clients</h1>
                    <p className="text-stone-600">Manage your caseload and patient records.</p>
                </div>
                <Button>Add New Client</Button>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                    <Input placeholder="Search clients..." className="pl-10" />
                </div>
            </div>

            <Card>
                <CardContent className="p-0">
                    <table className="w-full">
                        <thead className="bg-stone-50 border-b border-stone-100">
                            <tr>
                                <th className="text-left p-4 font-medium text-stone-500 text-sm">Name</th>
                                <th className="text-left p-4 font-medium text-stone-500 text-sm">Status</th>
                                <th className="text-left p-4 font-medium text-stone-500 text-sm">Next Session</th>
                                <th className="text-left p-4 font-medium text-stone-500 text-sm">Last Note</th>
                                <th className="text-right p-4 font-medium text-stone-500 text-sm">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { name: "Alex Johnson", status: "Active", next: "Today, 2:00 PM", last: "Oct 24, 2024" },
                                { name: "Sarah Williams", status: "Active", next: "Nov 2, 10:00 AM", last: "Oct 20, 2024" },
                                { name: "Michael Brown", status: "On Hold", next: "-", last: "Sep 15, 2024" },
                            ].map((client, i) => (
                                <tr key={i} className="border-b border-stone-100 hover:bg-stone-50/50 transition-colors">
                                    <td className="p-4 font-medium text-stone-900">{client.name}</td>
                                    <td className="p-4">
                                        <span className={cn(
                                            "px-2 py-1 rounded-full text-xs font-medium",
                                            client.status === "Active" ? "bg-green-100 text-green-700" : "bg-stone-100 text-stone-700"
                                        )}>
                                            {client.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-stone-600">{client.next}</td>
                                    <td className="p-4 text-stone-600">{client.last}</td>
                                    <td className="p-4 text-right">
                                        <Button variant="ghost" size="icon">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </div>
    );
}
