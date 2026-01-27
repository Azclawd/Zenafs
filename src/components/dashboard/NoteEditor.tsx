"use client";

import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { useState } from "react";

interface NoteEditorProps {
    clientName: string;
    onSave: (note: any) => void;
}

export function NoteEditor({ clientName, onSave }: NoteEditorProps) {
    const [type, setType] = useState<"SOAP" | "DAP" | "General">("SOAP");
    const [visibility, setVisibility] = useState<"private" | "shared">("private");
    const [content, setContent] = useState({
        subjective: "",
        objective: "",
        assessment: "",
        plan: "",
        data: "", // For DAP
        general: "" // For General
    });

    const handleSave = () => {
        onSave({ type, visibility, content, timestamp: new Date() });
    };

    return (
        <Card className="border-none shadow-sm bg-white">
            <CardContent className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-zen-900">New Clinical Note</h3>
                    <div className="flex gap-2">
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value as any)}
                            className="h-9 rounded-md border border-zen-200 text-sm px-3 focus:outline-none focus:ring-2 focus:ring-zen-400"
                        >
                            <option value="SOAP">SOAP Note</option>
                            <option value="DAP">DAP Note</option>
                            <option value="General">General Note</option>
                        </select>
                        <select
                            value={visibility}
                            onChange={(e) => setVisibility(e.target.value as any)}
                            className="h-9 rounded-md border border-zen-200 text-sm px-3 focus:outline-none focus:ring-2 focus:ring-zen-400"
                        >
                            <option value="private">Private (Therapist Only)</option>
                            <option value="shared">Shared with Client</option>
                        </select>
                    </div>
                </div>

                {/* Templates */}
                <div className="space-y-4">
                    {type === "SOAP" && (
                        <>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zen-700">Subjective</label>
                                <textarea
                                    className="w-full min-h-[100px] p-3 rounded-xl border border-zen-200 focus:outline-none focus:ring-2 focus:ring-zen-400 text-sm"
                                    placeholder="Client's reported symptoms, feelings, and concerns..."
                                    value={content.subjective}
                                    onChange={(e) => setContent({ ...content, subjective: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zen-700">Objective</label>
                                <textarea
                                    className="w-full min-h-[100px] p-3 rounded-xl border border-zen-200 focus:outline-none focus:ring-2 focus:ring-zen-400 text-sm"
                                    placeholder="Observable data, appearance, behavior..."
                                    value={content.objective}
                                    onChange={(e) => setContent({ ...content, objective: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zen-700">Assessment</label>
                                <textarea
                                    className="w-full min-h-[100px] p-3 rounded-xl border border-zen-200 focus:outline-none focus:ring-2 focus:ring-zen-400 text-sm"
                                    placeholder="Clinical impression and diagnosis..."
                                    value={content.assessment}
                                    onChange={(e) => setContent({ ...content, assessment: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zen-700">Plan</label>
                                <textarea
                                    className="w-full min-h-[100px] p-3 rounded-xl border border-zen-200 focus:outline-none focus:ring-2 focus:ring-zen-400 text-sm"
                                    placeholder="Treatment plan, homework, next session..."
                                    value={content.plan}
                                    onChange={(e) => setContent({ ...content, plan: e.target.value })}
                                />
                            </div>
                        </>
                    )}

                    {type === "DAP" && (
                        <>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zen-700">Data</label>
                                <textarea
                                    className="w-full min-h-[150px] p-3 rounded-xl border border-zen-200 focus:outline-none focus:ring-2 focus:ring-zen-400 text-sm"
                                    placeholder="Subjective and objective data..."
                                    value={content.data}
                                    onChange={(e) => setContent({ ...content, data: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zen-700">Assessment</label>
                                <textarea
                                    className="w-full min-h-[100px] p-3 rounded-xl border border-zen-200 focus:outline-none focus:ring-2 focus:ring-zen-400 text-sm"
                                    placeholder="Clinical impression..."
                                    value={content.assessment}
                                    onChange={(e) => setContent({ ...content, assessment: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zen-700">Plan</label>
                                <textarea
                                    className="w-full min-h-[100px] p-3 rounded-xl border border-zen-200 focus:outline-none focus:ring-2 focus:ring-zen-400 text-sm"
                                    placeholder="Next steps..."
                                    value={content.plan}
                                    onChange={(e) => setContent({ ...content, plan: e.target.value })}
                                />
                            </div>
                        </>
                    )}

                    {type === "General" && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zen-700">Note Content</label>
                            <textarea
                                className="w-full min-h-[200px] p-3 rounded-xl border border-zen-200 focus:outline-none focus:ring-2 focus:ring-zen-400 text-sm"
                                placeholder="Write your note here..."
                                value={content.general}
                                onChange={(e) => setContent({ ...content, general: e.target.value })}
                            />
                        </div>
                    )}
                </div>

                <div className="flex justify-end pt-4 border-t border-zen-100">
                    <Button onClick={handleSave} className="bg-zen-900 text-white hover:bg-zen-800">
                        Save Note
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
