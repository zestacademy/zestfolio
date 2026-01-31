
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function PrivacyPolicy() {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 py-12 md:py-24">
                <div className="container px-4 md:px-6 mx-auto max-w-4xl">
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8">Privacy Policy</h1>

                    <div className="prose prose-gray dark:prose-invert max-w-none space-y-6 text-muted-foreground">
                        <p>Last updated: {new Date().toLocaleDateString()}</p>

                        <section>
                            <h2 className="text-xl font-semibold text-foreground mb-4">1. Information We Collect</h2>
                            <p>
                                We collect information you provide directly to us when you create an account, build a portfolio, or communicate with us.
                                This may include:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 mt-4">
                                <li>Personal information (name, email address).</li>
                                <li>Profile information (education, skills, projects, social links).</li>
                                <li>Usage data (how you interact with our website).</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-foreground mb-4">2. How We Use Your Information</h2>
                            <p>
                                We use the information we collect to:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 mt-4">
                                <li>Provide, maintain, and improve our services.</li>
                                <li>Display your portfolio to others as per your settings.</li>
                                <li>Send you technical notices, updates, and support messages.</li>
                                <li>Monitor and analyze trends and usage.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-foreground mb-4">3. Data Sharing</h2>
                            <p>
                                We do not sell your personal information. We may share your information with third-party service providers
                                who help us operate the service (e.g., hosting, analytics), subject to confidentiality agreements.
                                Your public portfolio data is, by nature, shared publicly.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-foreground mb-4">4. Data Security</h2>
                            <p>
                                We implement reasonable security measures to protect your information from unauthorized access, alteration,
                                or destruction. However, no method of transmission over the internet or electronic storage is 100% secure.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-foreground mb-4">5. Your Rights</h2>
                            <p>
                                You have the right to access, correct, or delete your personal information. You can manage your portfolio data
                                directly through your dashboard. For account deletion requests, please contact us.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-foreground mb-4">6. Cookies</h2>
                            <p>
                                We use cookies and similar technologies to enhance your experience, analyze usage, and remember your preferences.
                                You can control cookies through your browser settings.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-foreground mb-4">7. Contact Us</h2>
                            <p>
                                If you have any questions about this Privacy Policy, please contact us at support@zestacademy.tech.
                            </p>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
