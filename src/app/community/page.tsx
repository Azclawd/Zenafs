"use client";

import { Feed } from "@/components/community/Feed";

export default function CommunityPage() {
    return (
        <div className="space-y-6">
            <div className="mb-8">
                <h1 className="text-3xl font-serif font-medium text-zen-900">General Wellness</h1>
                <p className="text-zen-600 mt-2">A space for everyone to share, connect, and grow.</p>
            </div>
            <Feed />
        </div>
    );
}
