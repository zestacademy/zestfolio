import SkillsForm from "@/components/forms/skills-form";

export default function SkillsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Skills & Certifications</h1>
                <p className="text-muted-foreground">Highlight your expertise.</p>
            </div>
            <SkillsForm />
        </div>
    );
}
