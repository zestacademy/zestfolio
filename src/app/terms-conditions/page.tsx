
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function TermsConditions() {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 py-12 md:py-24">
                <div className="container px-4 md:px-6 mx-auto max-w-4xl">
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8">Terms and Conditions</h1>

                    <div className="prose prose-gray dark:prose-invert max-w-none space-y-6 text-muted-foreground">
                        <p>Last updated: {new Date().toLocaleDateString()}</p>

                        <section>
                            <h2 className="text-xl font-semibold text-foreground mb-4">1. Introduction</h2>
                            <p>
                                Welcome to Zestfolio. These Terms and Conditions govern your use of our website and services.
                                By accessing or using Zestfolio, you agree to be bound by these terms. If you disagree with any part of these terms,
                                you may not access the service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-foreground mb-4">2. Use of Service</h2>
                            <p>
                                Zestfolio provides a platform for students and professionals to build and host portfolios. You are responsible for:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 mt-4">
                                <li>maintaining the confidentiality of your account credentials.</li>
                                <li>all activities that occur under your account.</li>
                                <li>ensuring that the content you upload does not violate any laws or third-party rights.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-foreground mb-4">3. User Content</h2>
                            <p>
                                You retain ownership of the content you create and upload to Zestfolio. By using our service, you grant us a license
                                to host, display, and distribute your content solely for the purpose of providing the service. We reserve the right
                                to remove content that violates our policies or is deemed inappropriate.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-foreground mb-4">4. Intellectual Property</h2>
                            <p>
                                The Zestfolio platform, including its design, code, and templates (excluding user content), is the property of
                                Zest Academy and is protected by copyright and other intellectual property laws. You may not copy, modify,
                                or distribute our proprietary materials without prior written consent.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-foreground mb-4">5. Limitation of Liability</h2>
                            <p>
                                Zestfolio is provided "as is" without warranties of any kind. We are not liable for any indirect, incidental,
                                or consequential damages arising from your use of the service, including data loss or service interruptions.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-foreground mb-4">6. Changes to Terms</h2>
                            <p>
                                We reserve the right to modify these terms at any time. We will notify users of any significant changes via email
                                or a prominent notice on our website. Your continued use of the service after such changes constitutes your acceptance
                                of the new terms.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-foreground mb-4">7. Contact Us</h2>
                            <p>
                                If you have any questions about these Terms and Conditions, please contact us at support@zestacademy.tech.
                            </p>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
