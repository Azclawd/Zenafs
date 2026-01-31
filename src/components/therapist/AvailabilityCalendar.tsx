"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronLeft,
    ChevronRight,
    Plus,
    X,
    Clock,
    Calendar,
    Check,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface TimeSlot {
    start: string; // HH:MM format
    end: string;
}

interface DayAvailability {
    enabled: boolean;
    slots: TimeSlot[];
}

interface WeeklyAvailability {
    monday: DayAvailability;
    tuesday: DayAvailability;
    wednesday: DayAvailability;
    thursday: DayAvailability;
    friday: DayAvailability;
    saturday: DayAvailability;
    sunday: DayAvailability;
}

interface AvailabilityCalendarProps {
    availability?: WeeklyAvailability;
    onChange?: (availability: WeeklyAvailability) => void;
    onSave?: (availability: WeeklyAvailability) => Promise<void>;
    timezone?: string;
}

const DAYS = [
    { key: "monday", label: "Monday", short: "Mon" },
    { key: "tuesday", label: "Tuesday", short: "Tue" },
    { key: "wednesday", label: "Wednesday", short: "Wed" },
    { key: "thursday", label: "Thursday", short: "Thu" },
    { key: "friday", label: "Friday", short: "Fri" },
    { key: "saturday", label: "Saturday", short: "Sat" },
    { key: "sunday", label: "Sunday", short: "Sun" },
] as const;

const TIME_OPTIONS = Array.from({ length: 28 }, (_, i) => {
    const hour = Math.floor(i / 2) + 7; // Start at 7 AM
    const minute = (i % 2) * 30;
    return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
});

const defaultAvailability: WeeklyAvailability = {
    monday: { enabled: true, slots: [{ start: "09:00", end: "17:00" }] },
    tuesday: { enabled: true, slots: [{ start: "09:00", end: "17:00" }] },
    wednesday: { enabled: true, slots: [{ start: "09:00", end: "17:00" }] },
    thursday: { enabled: true, slots: [{ start: "09:00", end: "17:00" }] },
    friday: { enabled: true, slots: [{ start: "09:00", end: "17:00" }] },
    saturday: { enabled: false, slots: [] },
    sunday: { enabled: false, slots: [] },
};

export default function AvailabilityCalendar({
    availability: initialAvailability,
    onChange,
    onSave,
    timezone = "Europe/London",
}: AvailabilityCalendarProps) {
    const [availability, setAvailability] = useState<WeeklyAvailability>(
        initialAvailability || defaultAvailability
    );
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const updateAvailability = (newAvailability: WeeklyAvailability) => {
        setAvailability(newAvailability);
        onChange?.(newAvailability);
        setSaved(false);
    };

    const toggleDay = (day: keyof WeeklyAvailability) => {
        const newAvailability = {
            ...availability,
            [day]: {
                ...availability[day],
                enabled: !availability[day].enabled,
                slots: !availability[day].enabled
                    ? [{ start: "09:00", end: "17:00" }]
                    : [],
            },
        };
        updateAvailability(newAvailability);
    };

    const addSlot = (day: keyof WeeklyAvailability) => {
        const lastSlot = availability[day].slots[availability[day].slots.length - 1];
        const newStart = lastSlot ? lastSlot.end : "09:00";
        const startHour = parseInt(newStart.split(":")[0]);
        const newEnd = `${Math.min(startHour + 2, 20).toString().padStart(2, "0")}:00`;

        const newAvailability = {
            ...availability,
            [day]: {
                ...availability[day],
                slots: [...availability[day].slots, { start: newStart, end: newEnd }],
            },
        };
        updateAvailability(newAvailability);
    };

    const removeSlot = (day: keyof WeeklyAvailability, index: number) => {
        const newAvailability = {
            ...availability,
            [day]: {
                ...availability[day],
                slots: availability[day].slots.filter((_, i) => i !== index),
            },
        };
        updateAvailability(newAvailability);
    };

    const updateSlot = (
        day: keyof WeeklyAvailability,
        index: number,
        field: "start" | "end",
        value: string
    ) => {
        const newSlots = [...availability[day].slots];
        newSlots[index] = { ...newSlots[index], [field]: value };
        const newAvailability = {
            ...availability,
            [day]: {
                ...availability[day],
                slots: newSlots,
            },
        };
        updateAvailability(newAvailability);
    };

    const handleSave = async () => {
        if (!onSave) return;
        setSaving(true);
        try {
            await onSave(availability);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (error) {
            console.error("Failed to save availability:", error);
        } finally {
            setSaving(false);
        }
    };

    // Calculate total hours per week
    const totalHours = useMemo(() => {
        let total = 0;
        Object.values(availability).forEach((day) => {
            if (day.enabled) {
                day.slots.forEach((slot: { start: string; end: string }) => {
                    const [startHour, startMin] = slot.start.split(":").map(Number);
                    const [endHour, endMin] = slot.end.split(":").map(Number);
                    total += (endHour + endMin / 60) - (startHour + startMin / 60);
                });
            }
        });
        return total;
    }, [availability]);

    return (
        <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Weekly Availability</h2>
                            <p className="text-blue-100 text-sm">
                                {totalHours.toFixed(1)} hours per week • {timezone}
                            </p>
                        </div>
                    </div>
                    {onSave && (
                        <Button
                            onClick={handleSave}
                            disabled={saving || saved}
                            className={`${
                                saved
                                    ? "bg-green-500 hover:bg-green-500"
                                    : "bg-white text-blue-600 hover:bg-blue-50"
                            } transition-all`}
                        >
                            {saving ? (
                                <span className="flex items-center gap-2">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"
                                    />
                                    Saving...
                                </span>
                            ) : saved ? (
                                <span className="flex items-center gap-2 text-white">
                                    <Check className="w-4 h-4" />
                                    Saved!
                                </span>
                            ) : (
                                "Save Changes"
                            )}
                        </Button>
                    )}
                </div>
            </div>

            {/* Days */}
            <div className="divide-y divide-gray-100">
                {DAYS.map((day, dayIndex) => {
                    const dayData = availability[day.key as keyof WeeklyAvailability];
                    return (
                        <motion.div
                            key={day.key}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: dayIndex * 0.05 }}
                            className={`px-6 py-4 ${dayData.enabled ? "bg-white" : "bg-gray-50"}`}
                        >
                            <div className="flex items-start gap-4">
                                {/* Day toggle */}
                                <button
                                    onClick={() => toggleDay(day.key as keyof WeeklyAvailability)}
                                    className={`flex-shrink-0 w-20 py-2 rounded-lg font-medium text-sm transition-all ${
                                        dayData.enabled
                                            ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md"
                                            : "bg-gray-200 text-gray-500 hover:bg-gray-300"
                                    }`}
                                >
                                    {day.short}
                                </button>

                                {/* Time slots */}
                                <div className="flex-1">
                                    <AnimatePresence mode="popLayout">
                                        {dayData.enabled ? (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="space-y-2"
                                            >
                                                {dayData.slots.map((slot, slotIndex) => (
                                                    <motion.div
                                                        key={slotIndex}
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: 20 }}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
                                                            <Clock className="w-4 h-4 text-gray-400" />
                                                            <select
                                                                value={slot.start}
                                                                onChange={(e) =>
                                                                    updateSlot(
                                                                        day.key as keyof WeeklyAvailability,
                                                                        slotIndex,
                                                                        "start",
                                                                        e.target.value
                                                                    )
                                                                }
                                                                className="bg-transparent text-sm font-medium text-gray-700 focus:outline-none cursor-pointer"
                                                            >
                                                                {TIME_OPTIONS.map((time) => (
                                                                    <option key={time} value={time}>
                                                                        {time}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                            <span className="text-gray-400">→</span>
                                                            <select
                                                                value={slot.end}
                                                                onChange={(e) =>
                                                                    updateSlot(
                                                                        day.key as keyof WeeklyAvailability,
                                                                        slotIndex,
                                                                        "end",
                                                                        e.target.value
                                                                    )
                                                                }
                                                                className="bg-transparent text-sm font-medium text-gray-700 focus:outline-none cursor-pointer"
                                                            >
                                                                {TIME_OPTIONS.map((time) => (
                                                                    <option key={time} value={time}>
                                                                        {time}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        {dayData.slots.length > 1 && (
                                                            <button
                                                                onClick={() =>
                                                                    removeSlot(
                                                                        day.key as keyof WeeklyAvailability,
                                                                        slotIndex
                                                                    )
                                                                }
                                                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </motion.div>
                                                ))}

                                                {/* Add slot button */}
                                                <button
                                                    onClick={() =>
                                                        addSlot(day.key as keyof WeeklyAvailability)
                                                    }
                                                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium mt-1"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                    Add time slot
                                                </button>
                                            </motion.div>
                                        ) : (
                                            <motion.p
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="text-sm text-gray-400 py-2"
                                            >
                                                Unavailable
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Footer tip */}
            <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-blue-100">
                <p className="text-sm text-blue-800">
                    <strong>Tip:</strong> Add multiple time slots per day for breaks (e.g., 9:00-12:00 and 14:00-17:00).
                    Clients will only see available times that fit your schedule.
                </p>
            </div>
        </div>
    );
}
