import ProfileForm from "@/components/forms/profile-form";

export default function ProfilePage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
                <p className="text-muted-foreground">Manage your personal information and social links.</p>
            </div>
            <ProfileForm />
        </div>
    );
}
