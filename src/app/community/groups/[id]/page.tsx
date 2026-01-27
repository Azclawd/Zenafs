"use client";

import { Feed } from "@/components/community/Feed";
import { useParams } from "next/navigation";

const groupInfo: Record<string, { title: string; desc: string }> = {
    mothers: { title: "Mothers Support", desc: "A supportive space for moms to share the joys and challenges of motherhood." },
    fitness: { title: "Fitness & Health", desc: "Motivation, tips, and celebration of movement." },
    anxiety: { title: "Anxiety Circle", desc: "Safe space to share feelings and coping strategies." },
};

export default function GroupPage() {
    const params = useParams();
    const groupId = params.id as string;
    const info = groupInfo[groupId] || { title: "Community Group", desc: "Welcome to the group." };

    return (
        <div className="space-y-6">
            <div className="mb-8">
                <h1 className="text-3xl font-serif font-medium text-zen-900">{info.title}</h1>
                <p className="text-zen-600 mt-2">{info.desc}</p>
            </div>
            <Feed groupId={groupId} />
        </div>
    );
}
