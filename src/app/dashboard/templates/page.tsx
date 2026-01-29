'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Check, Loader2, Maximize2, CheckCircle2, X } from 'lucide-react';

// Rich Template Data (Same as Public Page)
const TEMPLATES = [
    {
        id: "template01",
        name: "Tech Systems",
        description: "Dark theme with neon green accents, perfect for systems engineers and tech professionals",
        features: ["Neon glow effects", "Dark cyberpunk theme", "Profile photo showcase"],
        color: "from-green-600 to-emerald-600",
        preview: "/api/templates/template01"
    },
    {
        id: "template02",
        name: "Professional Clean",
        description: "Clean, centered layout ideal for all professionals seeking a polished online presence",
        features: ["Centered design", "Stats cards", "Professional styling"],
        color: "from-teal-600 to-green-600",
        preview: "/api/templates/template02"
    },
    {
        id: "template03",
        name: "Data Analyst",
        description: "Modern data-focused design with blue accents for data scientists and analysts",
        features: ["Data visualization ready", "Modern blue theme", "Clean typography"],
        color: "from-blue-600 to-cyan-600",
        preview: "/api/templates/template03"
    },
    {
        id: "template04",
        name: "Modern Universal",
        description: "Light/dark mode support with flexible design suitable for any field",
        features: ["Dark mode toggle", "Adaptive colors", "Universal appeal"],
        color: "from-indigo-600 to-purple-600",
        preview: "/api/templates/template04"
    },
    {
        id: "template05",
        name: "Minimal Blue",
        description: "Simple, compact layout with blue accents for minimalist professionals",
        features: ["Minimal design", "Compact layout", "Blue color scheme"],
        color: "from-sky-600 to-blue-600",
        preview: "/api/templates/template05"
    },
    {
        id: "template06",
        name: "Hardware Engineer",
        description: "Retro-inspired design perfect for hardware engineers and tech enthusiasts",
        features: ["Retro aesthetic", "Technical vibe", "Engineering focus"],
        color: "from-orange-600 to-red-600",
        preview: "/api/templates/template06"
    },
    {
        id: "template07",
        name: "Creative Bold",
        description: "Bold, artistic layout designed for creative professionals and designers",
        features: ["Vibrant colors", "Artistic flair", "Creative expression"],
        color: "from-purple-600 to-pink-600",
        preview: "/api/templates/template07"
    },
    {
        id: "template08",
        name: "Architecture Pro",
        description: "Professional architecture theme showcasing projects and design work",
        features: ["Project gallery", "Professional layout", "Architecture focus"],
        color: "from-slate-600 to-gray-600",
        preview: "/api/templates/template08"
    },
    {
        id: "template09",
        name: "Research Scholar",
        description: "Academic/scholarly design ideal for researchers and academics",
        features: ["Publication lists", "Academic styling", "Research focus"],
        color: "from-blue-700 to-indigo-700",
        preview: "/api/templates/template09"
    }
];

export default function TemplatesPage() {
    const { user } = useAuth();
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null); // Currently ACTIVE template
    const [previewId, setPreviewId] = useState<string | null>(null); // Currently PREVIEWING (modal) template

    // Fetch current template selection
    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            try {
                const docRef = doc(db, 'portfolios', user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setSelectedId(data.templateId || 'template01');
                }
            } catch (error) {
                console.error('Error fetching template:', error);
            }
        };
        fetchData();
    }, [user]);

    const handleSelectTemplate = async (templateId: string) => {
        if (!user) return;
        setLoadingId(templateId);
        try {
            const docRef = doc(db, 'portfolios', user.uid);
            await setDoc(docRef, {
                templateId: templateId,
                updatedAt: new Date().toISOString()
            }, { merge: true });

            setSelectedId(templateId);
            setPreviewId(null); // Close modal if open
        } catch (error) {
            console.error('Error updating template:', error);
        } finally {
            setLoadingId(null);
        }
    };

    const currentPreviewTemplate = TEMPLATES.find(t => t.id === previewId);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Choose Your Template</h1>
                <p className="text-muted-foreground">Select a professional design for your portfolio. Switch anytime without losing content.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 pb-10">
                {TEMPLATES.map((template) => (
                    <div
                        key={template.id}
                        className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${selectedId === template.id ? 'ring-2 ring-primary border-primary' : 'border-border/50 bg-card'}`}
                    >
                        {/* Preview Area with Iframe - Clickable */}
                        <div
                            className="relative h-64 bg-slate-900 overflow-hidden group-hover:h-80 transition-all duration-300 cursor-pointer"
                            onClick={() => setPreviewId(template.id)}
                        >
                            <iframe
                                src={template.preview}
                                className="w-full h-full pointer-events-none scale-50 origin-top-left"
                                style={{ width: '200%', height: '200%' }}
                                title={`${template.name} Preview`}
                            />
                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <div className="text-white text-center">
                                    <Maximize2 className="w-12 h-12 mx-auto mb-2 opacity-80" />
                                    <p className="text-sm font-medium">Click to preview</p>
                                </div>
                            </div>

                            {/* Active Indicator */}
                            {selectedId === template.id && (
                                <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-2">
                                    <CheckCircle2 className="w-3 h-3" /> Active
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-4">
                            <div>
                                <h3 className="text-xl font-bold mb-2">{template.name}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {template.description}
                                </p>
                            </div>

                            {/* Features */}
                            <div className="space-y-2">
                                {template.features.slice(0, 2).map((feature, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-sm">
                                        <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                                        <span className="text-foreground/80">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Action Button */}
                            {selectedId === template.id ? (
                                <Button className="w-full bg-muted text-muted-foreground" disabled>
                                    <Check className="mr-2 h-4 w-4" /> Currently Active
                                </Button>
                            ) : (
                                <Button
                                    onClick={() => handleSelectTemplate(template.id)}
                                    disabled={loadingId === template.id}
                                    className={`w-full bg-gradient-to-r ${template.color} text-white hover:opacity-90 shadow-md`}
                                >
                                    {loadingId === template.id ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Applying...
                                        </>
                                    ) : (
                                        "Use This Template"
                                    )}
                                </Button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Full Screen Preview Modal */}
            {previewId && currentPreviewTemplate && (
                <div
                    className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={() => setPreviewId(null)}
                >
                    <div
                        className="relative w-full h-full max-w-7xl max-h-[90vh] bg-white rounded-xl overflow-hidden shadow-2xl flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="bg-slate-900 text-white p-4 flex items-center justify-between shrink-0">
                            <div>
                                <h3 className="text-lg font-bold">{currentPreviewTemplate.name}</h3>
                                <p className="text-sm text-white/70">{currentPreviewTemplate.description}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                {selectedId === currentPreviewTemplate.id ? (
                                    <Button variant="secondary" disabled className="gap-2">
                                        <Check className="w-4 h-4" /> Active Template
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={() => handleSelectTemplate(currentPreviewTemplate.id)}
                                        disabled={loadingId === currentPreviewTemplate.id}
                                        className={`bg-gradient-to-r ${currentPreviewTemplate.color} text-white border-0`}
                                    >
                                        {loadingId === currentPreviewTemplate.id ? "Applying..." : "Use This Template"}
                                    </Button>
                                )}
                                <button
                                    onClick={() => setPreviewId(null)}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        {/* Iframe Preview */}
                        <div className="flex-1 relative bg-white">
                            <iframe
                                src={currentPreviewTemplate.preview}
                                className="w-full h-full absolute inset-0"
                                title={`${currentPreviewTemplate.name} Full Preview`}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
