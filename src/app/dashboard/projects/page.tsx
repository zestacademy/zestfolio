import ProjectsForm from "@/components/forms/projects-form";
import { Folder, Sparkles } from "lucide-react";

export default function ProjectsPage() {
    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-primary flex items-center gap-3">
                        <div className="p-2 rounded-2xl bg-primary/10 text-primary group-hover:rotate-6 transition-transform">
                            <Folder className="w-8 h-8" />
                        </div>
                        Innovation Lab
                    </h1>
                    <p className="text-muted-foreground mt-1 font-medium max-w-lg">
                        Showcase your engineering marvels. Add screenshots, tech stacks, and live links to your creations.
                    </p>
                </div>
                <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[10px] font-black uppercase tracking-widest">
                    <Sparkles className="w-4 h-4" />
                    Project Gallery
                </div>
            </div>

            <div className="rounded-[40px] border border-border/60 bg-card/50 backdrop-blur-md shadow-xl p-2 sm:p-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 fill-mode-both">
                <ProjectsForm />
            </div>
        </div>
    );
}
