import { PortfolioData } from "@/types";
import { Github, Linkedin, ExternalLink, Mail, Twitter, Globe } from "lucide-react";

export default function ModernTemplate({ data }: { data: PortfolioData }) {
    return (
        <div className="min-h-screen bg-foreground text-background font-sans selection:bg-primary/30">
            {/* Hero */}
            <header className="py-20 px-6 border-b border-white/10 bg-foreground/50">
                <div className="max-w-4xl mx-auto grid md:grid-cols-[1fr_200px] gap-8 items-center">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <p className="text-primary font-medium tracking-wide">Hello, I'm</p>
                            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white">{data.fullName}</h1>
                            <h2 className="text-2xl text-white/60">{data.professionalTitle}</h2>
                        </div>
                        <p className="text-white/80 text-lg leading-relaxed max-w-xl">
                            {data.aboutMe}
                        </p>
                        <div className="flex gap-4">
                            {data.socialLinks?.github && (
                                <a href={data.socialLinks.github} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded-full hover:bg-white/10 hover:text-white text-white/60 transition-all">
                                    <Github className="w-5 h-5" />
                                </a>
                            )}
                            {data.socialLinks?.linkedin && (
                                <a href={data.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded-full hover:bg-primary/20 hover:text-primary text-white/60 transition-all">
                                    <Linkedin className="w-5 h-5" />
                                </a>
                            )}
                            {data.publicEmail && (
                                <a href={`mailto:${data.publicEmail}`} className="p-2 bg-white/5 rounded-full hover:bg-primary/20 hover:text-primary text-white/60 transition-all">
                                    <Mail className="w-5 h-5" />
                                </a>
                            )}
                        </div>
                    </div>
                    {/* Avatar Placeholder */}
                    <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-gradient-to-tr from-primary to-accent mx-auto md:ml-auto opacity-80 blur-[2px] hover:blur-none transition-all duration-700"></div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-16 space-y-20">
                {/* Skills */}
                {data.skills && data.skills.length > 0 && (
                    <section>
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <span className="w-8 h-1 bg-primary rounded-full"></span>
                            Skills
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            {data.skills.map((skill, i) => (
                                <span key={i} className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white/80 hover:border-primary/50 hover:text-primary transition-colors">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </section>
                )}

                {/* Projects */}
                {data.projects && data.projects.length > 0 && (
                    <section>
                        <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                            <span className="w-8 h-1 bg-accent rounded-full"></span>
                            Featured Projects
                        </h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            {data.projects.map((project, i) => (
                                <div key={i} className="group p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-primary/30 transition-all">
                                    <div className="flex justify-between items-start mb-4">
                                        <h4 className="text-xl font-bold text-white/90 group-hover:text-white">{project.title}</h4>
                                        <div className="flex gap-2">
                                            {project.repoLink && <a href={project.repoLink} className="text-white/40 hover:text-white"><Github className="w-4 h-4" /></a>}
                                            {project.link && <a href={project.link} className="text-white/40 hover:text-white"><ExternalLink className="w-4 h-4" /></a>}
                                        </div>
                                    </div>
                                    <p className="text-white/60 mb-6 text-sm leading-relaxed">{project.description}</p>
                                    <div className="flex flex-wrap gap-2 mt-auto">
                                        {(project.technologies || []).slice(0, 4).map(t => (
                                            <span key={t} className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded">
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Education */}
                {data.education && data.education.length > 0 && (
                    <section>
                        <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                            <span className="w-8 h-1 bg-secondary rounded-full"></span>
                            Education
                        </h3>
                        <div className="space-y-6 border-l-2 border-white/10 pl-6 ml-2">
                            {data.education.map((edu, i) => (
                                <div key={i} className="relative">
                                    <span className="absolute -left-[31px] top-2 w-4 h-4 rounded-full bg-foreground border-4 border-white/10"></span>
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                                        <h4 className="text-lg font-bold text-white/90">{edu.institution}</h4>
                                        <span className="text-sm font-mono text-white/40">{edu.startDate} - {edu.endDate || 'Present'}</span>
                                    </div>
                                    <p className="text-white/60">{edu.degree}</p>
                                    <p className="text-white/40 text-sm">{edu.fieldOfStudy}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </main>

            <footer className="py-8 text-center text-white/40 text-sm border-t border-white/10 mt-20">
                <p>Designed with Zestfolio</p>
            </footer>
        </div>
    );
}
