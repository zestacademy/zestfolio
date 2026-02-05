import SkillsForm from "@/components/forms/skills-form";
import { Zap, Sparkles } from "lucide-react";

export default function SkillsPage() {
    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-primary flex items-center gap-3">
                        <div className="p-2 rounded-2xl bg-primary/10 text-primary group-hover:rotate-6 transition-transform">
                            <Zap className="w-8 h-8" />
                        </div>
                        Arsenal of Skills
                    </h1>
                    <p className="text-muted-foreground mt-1 font-medium max-w-lg">
                        Weaponize your expertise. Add technical skills, soft skills, and professional certifications.
                    </p>
                </div>
                <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-2xl bg-blue-500/10 text-blue-600 border border-blue-500/20 text-[10px] font-black uppercase tracking-widest">
                    <Sparkles className="w-4 h-4" />
                    Portfolio Optimized
                </div>
            </div>

            <div className="rounded-[40px] border border-border/60 bg-card/50 backdrop-blur-md shadow-xl p-2 sm:p-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 fill-mode-both">
                <SkillsForm />
            </div>
        </div>
    );
}
