import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ExternalLink, Github, Linkedin, Mail, Star, TrendingUp } from "lucide-react";

export default function Examples() {
    const examples = [
        {
            name: "Priya Sharma",
            role: "Computer Science Student",
            university: "IIT Delhi",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
            portfolio: "priya-sharma",
            description: "Full-stack developer specializing in React and Node.js with multiple hackathon wins.",
            stats: { projects: 12, skills: 15, views: "2.3k" },
            tags: ["Web Development", "AI/ML", "Open Source"],
            gradient: "from-blue-500 to-cyan-500"
        },
        {
            name: "Rahul Verma",
            role: "Data Science Enthusiast",
            university: "BITS Pilani",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul",
            portfolio: "rahul-verma",
            description: "Passionate about machine learning and data visualization. Published 3 research papers.",
            stats: { projects: 8, skills: 12, views: "1.8k" },
            tags: ["Data Science", "Python", "Research"],
            gradient: "from-purple-500 to-pink-500"
        },
        {
            name: "Ananya Reddy",
            role: "UI/UX Designer",
            university: "NID Ahmedabad",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya",
            portfolio: "ananya-reddy",
            description: "Creating delightful user experiences. Interned at 2 startups and freelancing actively.",
            stats: { projects: 18, skills: 10, views: "3.1k" },
            tags: ["UI/UX", "Figma", "Design Systems"],
            gradient: "from-rose-500 to-orange-500"
        },
        {
            name: "Arjun Patel",
            role: "Cybersecurity Student",
            university: "Anna University",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun",
            portfolio: "arjun-patel",
            description: "Ethical hacker and security researcher. CTF champion and bug bounty hunter.",
            stats: { projects: 10, skills: 14, views: "2.7k" },
            tags: ["Security", "Networking", "Linux"],
            gradient: "from-green-500 to-emerald-500"
        },
        {
            name: "Diya Gupta",
            role: "Business Analytics",
            university: "IIM Bangalore",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Diya",
            portfolio: "diya-gupta",
            description: "Combining business acumen with data analytics. Led 3 consulting projects.",
            stats: { projects: 6, skills: 9, views: "1.5k" },
            tags: ["Analytics", "Business", "SQL"],
            gradient: "from-indigo-500 to-blue-500"
        },
        {
            name: "Kabir Mehta",
            role: "Mobile App Developer",
            university: "IIIT Hyderabad",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kabir",
            portfolio: "kabir-mehta",
            description: "Flutter expert building cross-platform apps. Published 2 apps with 10k+ downloads.",
            stats: { projects: 14, skills: 11, views: "2.9k" },
            tags: ["Flutter", "Mobile Dev", "Firebase"],
            gradient: "from-amber-500 to-yellow-500"
        }
    ];

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-br from-accent/10 via-background to-primary/5 relative overflow-hidden">
                    <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                    <div className="container px-4 md:px-6 mx-auto relative">
                        <div className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent-foreground text-sm font-medium border border-accent/30">
                                <Star className="w-4 h-4 fill-current" />
                                Student Portfolios
                            </div>
                            <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none">
                                See What Students Are <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary">Building</span>
                            </h1>
                            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
                                Get inspired by real portfolios created by students from top universities.
                                See what's possible with Zestfolio.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Stats Bar */}
                <section className="w-full py-8 border-y bg-muted/20">
                    <div className="container px-4 md:px-6 mx-auto">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            <div>
                                <div className="text-3xl md:text-4xl font-bold text-primary mb-1">5,000+</div>
                                <div className="text-sm text-muted-foreground">Student Portfolios</div>
                            </div>
                            <div>
                                <div className="text-3xl md:text-4xl font-bold text-accent mb-1">50+</div>
                                <div className="text-sm text-muted-foreground">Universities</div>
                            </div>
                            <div>
                                <div className="text-3xl md:text-4xl font-bold text-primary mb-1">100k+</div>
                                <div className="text-sm text-muted-foreground">Profile Views</div>
                            </div>
                            <div>
                                <div className="text-3xl md:text-4xl font-bold text-accent mb-1">95%</div>
                                <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Examples Grid */}
                <section className="w-full py-16 md:py-24">
                    <div className="container px-4 md:px-6 mx-auto">
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {examples.map((example, index) => (
                                <div
                                    key={index}
                                    className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
                                >
                                    {/* Header with gradient */}
                                    <div className={`relative h-32 bg-gradient-to-br ${example.gradient} overflow-hidden`}>
                                        <div className="absolute inset-0 bg-black/10"></div>
                                        <div className="absolute top-4 right-4 flex gap-2">
                                            <div className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors cursor-pointer">
                                                <Github className="w-4 h-4 text-white" />
                                            </div>
                                            <div className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors cursor-pointer">
                                                <Linkedin className="w-4 h-4 text-white" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Avatar */}
                                    <div className="relative px-6 -mt-12">
                                        <div className="w-24 h-24 rounded-full border-4 border-background bg-background overflow-hidden">
                                            <img src={example.image} alt={example.name} className="w-full h-full object-cover" />
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 pt-4 space-y-4">
                                        <div>
                                            <h3 className="text-xl font-bold mb-1">{example.name}</h3>
                                            <p className="text-sm text-primary font-medium">{example.role}</p>
                                            <p className="text-xs text-muted-foreground">{example.university}</p>
                                        </div>

                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            {example.description}
                                        </p>

                                        {/* Stats */}
                                        <div className="flex items-center justify-between text-xs border-t border-b py-3">
                                            <div className="text-center">
                                                <div className="font-bold text-foreground">{example.stats.projects}</div>
                                                <div className="text-muted-foreground">Projects</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="font-bold text-foreground">{example.stats.skills}</div>
                                                <div className="text-muted-foreground">Skills</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="font-bold text-foreground flex items-center gap-1">
                                                    <TrendingUp className="w-3 h-3" />
                                                    {example.stats.views}
                                                </div>
                                                <div className="text-muted-foreground">Views</div>
                                            </div>
                                        </div>

                                        {/* Tags */}
                                        <div className="flex flex-wrap gap-2">
                                            {example.tags.map((tag, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-2 py-1 rounded-md bg-accent/10 text-accent-foreground text-xs font-medium"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Action Button */}
                                        <Link
                                            href={`/u/${example.portfolio}`}
                                            className={`w-full inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-gradient-to-r ${example.gradient} text-white font-medium shadow-md hover:shadow-lg transition-all group-hover:gap-2 gap-1`}
                                        >
                                            View Portfolio
                                            <ExternalLink className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Testimonial Section */}
                <section className="w-full py-16 md:py-24 bg-gradient-to-br from-primary/5 to-accent/5">
                    <div className="container px-4 md:px-6 mx-auto">
                        <div className="max-w-3xl mx-auto text-center space-y-8">
                            <div className="flex justify-center mb-6">
                                <div className="flex gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                            </div>
                            <blockquote className="text-xl md:text-2xl font-medium italic text-foreground">
                                "Creating my portfolio with Zestfolio helped me land my dream internship.
                                The recruiter specifically mentioned how professional my portfolio looked!"
                            </blockquote>
                            <div>
                                <div className="font-semibold">Neha Krishnan</div>
                                <div className="text-sm text-muted-foreground">Software Engineering Intern at Google</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="w-full py-16 md:py-24">
                    <div className="container px-4 md:px-6 mx-auto">
                        <div className="flex flex-col items-center text-center space-y-6 max-w-2xl mx-auto">
                            <h2 className="text-3xl md:text-4xl font-bold">
                                Your Portfolio Could Be Next
                            </h2>
                            <p className="text-lg text-muted-foreground">
                                Join these amazing students and create your own professional portfolio today.
                            </p>
                            <Link
                                href="/dashboard"
                                className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-base font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30"
                            >
                                Create Your Portfolio
                                <ExternalLink className="ml-2 h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
