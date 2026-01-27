import { PortfolioData } from "@/types";
import { GraduationCap, Github, Linkedin, ExternalLink, Mail, Twitter, Globe } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MinimalTemplate({ data }: { data: PortfolioData }) {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-accent/20">
            <main className="max-w-2xl mx-auto px-6 py-20 space-y-16">

                {/* Header */}
                <section className="space-y-6">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-bold tracking-tight text-primary">{data.fullName}</h1>
                        <p className="text-xl text-muted-foreground font-medium">{data.professionalTitle}</p>
                    </div>
                    <p className="text-foreground/80 leading-relaxed text-lg max-w-lg">
                        {data.aboutMe}
                    </p>

                    <div className="flex gap-4">
                        {data.socialLinks?.github && (
                            <a href={data.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                <Github className="w-5 h-5" />
                            </a>
                        )}
                        {data.socialLinks?.linkedin && (
                            <a href={data.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </a>
                        )}
                        {data.socialLinks?.twitter && (
                            <a href={data.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                        )}
                        {data.socialLinks?.website && (
                            <a href={data.socialLinks.website} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                <Globe className="w-5 h-5" />
                            </a>
                        )}
                        {data.publicEmail && (
                            <a href={`mailto:${data.publicEmail}`} className="text-muted-foreground hover:text-primary transition-colors">
                                <Mail className="w-5 h-5" />
                            </a>
                        )}
                    </div>
                </section>

                {/* Experience / Projects */}
                {data.projects && data.projects.length > 0 && (
                    <section>
                        <h2 className="text-sm font-bold text-accent uppercase tracking-wider mb-8">Selected Projects</h2>
                        <div className="space-y-10">
                            {data.projects.map((project, i) => (
                                <div key={i} className="group">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                                            {project.link ? (
                                                <a href={project.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                                    {project.title} <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </a>
                                            ) : project.title}
                                        </h3>
                                        {project.repoLink && (
                                            <a href={project.repoLink} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground text-xs flex items-center gap-1">
                                                <Github className="w-3 h-3" /> Code
                                            </a>
                                        )}
                                    </div>
                                    <p className="text-foreground/70 mb-3 leading-relaxed">{project.description}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {(project.technologies || []).map(t => (
                                            <span key={t} className="px-2 py-0.5 bg-secondary text-secondary-foreground text-xs rounded-full font-medium">
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
                        <h2 className="text-sm font-bold text-accent uppercase tracking-wider mb-8">Education</h2>
                        <div className="space-y-8">
                            {data.education.map((edu, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="mt-1 text-muted-foreground">
                                        <GraduationCap className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">{edu.institution}</h3>
                                        <p className="text-foreground/80 text-sm">{edu.degree} in {edu.fieldOfStudy}</p>
                                        <p className="text-muted-foreground/80 text-xs mt-1">{edu.startDate} — {edu.endDate || 'Present'}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Skills */}
                {data.skills && data.skills.length > 0 && (
                    <section>
                        <h2 className="text-sm font-bold text-accent uppercase tracking-wider mb-6">Skills</h2>
                        <div className="flex flex-wrap gap-x-2 gap-y-2 text-foreground/80">
                            {data.skills.map((skill, i) => (
                                <span key={i} className="border-b border-border pb-0.5">{skill}</span>
                            ))}
                        </div>
                    </section>
                )}

            </main>
        </div>
    );
}
