import EducationForm from "@/components/forms/education-form";
import { GraduationCap, Sparkles } from "lucide-react";

export default function EducationPage() {
    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-primary flex items-center gap-3">
                        <div className="p-2 rounded-2xl bg-primary/10 text-primary group-hover:rotate-6 transition-transform">
                            <GraduationCap className="w-8 h-8" />
                        </div>
                        Academic DNA
                    </h1>
                    <p className="text-muted-foreground mt-1 font-medium max-w-lg">
                        Catalog your scholastic journey. Degrees, internships, and educational milestones.
                    </p>
                </div>
                <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-2xl bg-indigo-500/10 text-indigo-600 border border-indigo-500/20 text-[10px] font-black uppercase tracking-widest">
                    <Sparkles className="w-4 h-4" />
                    Verified Records
                </div>
            </div>

            <div className="rounded-[40px] border border-border/60 bg-card/50 backdrop-blur-md shadow-xl p-2 sm:p-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 fill-mode-both">
                <EducationForm />
            </div>
        </div>
    );
}
