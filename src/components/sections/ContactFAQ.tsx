import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { Plus, Minus, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { submitContactForm } from "@/app/actions/contact";

const faqs = [
    {
        question: "How do I choose the right therapist?",
        answer: "We use a detailed matching process based on your needs, preferences, and goals to pair you with the most suitable professional.",
    },
    {
        question: "Is online therapy effective?",
        answer: "Yes, numerous studies have shown that online therapy is as effective as in-person therapy for a wide range of mental health conditions.",
    },
    {
        question: "Does insurance cover these sessions?",
        answer: "Many insurance providers cover online therapy. We recommend checking with your specific provider. We can provide invoices for reimbursement.",
    },
    {
        question: "Can I cancel or reschedule?",
        answer: "Absolutely. You can manage all your appointments directly from your dashboard with flexible cancellation policies.",
    },
];

export function ContactFAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError(null);
        setSuccess(false);

        const result = await submitContactForm(formData);

        setLoading(false);
        if (result.error) {
            setError(result.error);
        } else {
            setSuccess(true);
        }
    }

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4 md:px-6">
                <div className="max-w-3xl mx-auto">
                    {/* FAQ Section */}
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-serif font-bold text-zen-900 mb-4">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-zen-600">
                            Find answers to common questions about our therapy services.
                        </p>
                    </div>
                    <div className="space-y-4 mb-16">
                        {faqs.map((faq, index) => (
                            <div key={index} className="border-b border-zen-100 pb-4">
                                <button
                                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                    className="flex items-center justify-between w-full text-left py-4 group"
                                >
                                    <span className="text-lg font-medium text-zen-800 group-hover:text-zen-600 transition-colors">
                                        {faq.question}
                                    </span>
                                    <span className="text-zen-400 group-hover:text-zen-600 transition-colors">
                                        {openIndex === index ? <Minus className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                                    </span>
                                </button>
                                <AnimatePresence>
                                    {openIndex === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="overflow-hidden"
                                        >
                                            <p className="text-zen-600 pb-4 leading-relaxed">
                                                {faq.answer}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}
