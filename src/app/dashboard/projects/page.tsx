import ProjectsForm from "@/components/forms/projects-form";

export default function ProjectsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
                <p className="text-muted-foreground">Manage your portfolio projects.</p>
            </div>
            <ProjectsForm />
        </div>
    );
}
