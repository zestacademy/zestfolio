'use client';

import { useState, useEffect } from 'react';
import { PORTFOLIO_TEMPLATES, Template } from '@/lib/templates';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Eye, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

export default function TemplatesPage() {
    const { user } = useAuth();
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    // Fetch current template selection
    useEffect(() => {
        const fetchCurrentTemplate = async () => {
            if (!user) return;
            try {
                const docRef = doc(db, 'portfolios', user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setSelectedId(data.templateId || null);
                }
            } catch (error) {
                console.error('Error fetching current template:', error);
            }
        };
        fetchCurrentTemplate();
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
        } catch (error) {
            console.error('Error updating template:', error);
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className="space-y-6 pb-10">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Templates</h1>
                <p className="text-muted-foreground">Choose a professional design for your portfolio. Switch anytime.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {PORTFOLIO_TEMPLATES.map((template) => (
                    <Card key={template.id} className={`overflow-hidden flex flex-col transition-all duration-200 hover:ring-2 hover:ring-primary/20 ${selectedId === template.id ? 'ring-2 ring-primary' : ''}`}>
                        <div className="aspect-video w-full overflow-hidden bg-muted relative group">
                            <img
                                src={template.thumbnail}
                                alt={template.name}
                                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="secondary" size="sm" className="gap-2">
                                            <Eye className="w-4 h-4" /> Preview
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-4xl w-[90vw] h-[80vh] flex flex-col p-6">
                                        <DialogHeader>
                                            <DialogTitle>{template.name}</DialogTitle>
                                            <DialogDescription>{template.description}</DialogDescription>
                                        </DialogHeader>
                                        <div className="flex-1 overflow-auto mt-4 rounded-md border text-center relative bg-muted/20">
                                            <img
                                                src={template.thumbnail}
                                                alt={`Preview of ${template.name}`}
                                                className="w-full h-auto object-contain block mx-auto"
                                            />
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>

                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-lg">{template.name}</CardTitle>
                                {selectedId === template.id && <Badge variant="default" className="bg-green-600"><Check className="w-3 h-3 mr-1" /> Active</Badge>}
                            </div>
                            <CardDescription>{template.description}</CardDescription>
                        </CardHeader>

                        <CardContent className="flex-1 pb-3">
                            <div className="flex flex-wrap gap-2">
                                {template.features.map((feature, i) => (
                                    <Badge key={i} variant="outline" className="text-xs font-normal">
                                        {feature}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>

                        <CardFooter className="pt-3 border-t bg-muted/20">
                            <Button
                                className="w-full"
                                variant={selectedId === template.id ? "outline" : "default"}
                                onClick={() => handleSelectTemplate(template.id)}
                                disabled={loadingId === template.id || selectedId === template.id}
                            >
                                {loadingId === template.id ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Applying...
                                    </>
                                ) : selectedId === template.id ? (
                                    "Selected"
                                ) : (
                                    "Use This Template"
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
