import EducationForm from "@/components/forms/education-form";

export default function EducationPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Education</h1>
                <p className="text-muted-foreground">Add your educational background.</p>
            </div>
            <EducationForm />
        </div>
    );
}
