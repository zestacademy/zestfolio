'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Plus, Trash2, Github, ExternalLink, Pencil, SaveIcon, Link as LinkIcon, X, Rocket, Sparkles, Terminal, Code2, Target } from 'lucide-react';
import { Project } from '@/types';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function ProjectsForm() {
    const { user, profile } = useAuth();
    const [loading, setLoading] = useState(false);
    const [projects, setProjects] = useState<Project[]>([]);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [newProject, setNewProject] = useState<Project>({
        title: '',
        description: '',
        technologies: [],
        link: '',
        repoLink: '',
        imageUrl: '',
    });
    const [techInput, setTechInput] = useState('');
    const [imageUrlInput, setImageUrlInput] = useState('');

    useEffect(() => {
        const fetchProjects = async () => {
            if (!user || !profile?.zestId) return;
            try {
                const docRef = doc(db, 'portfolios', profile.zestId);
                let docSnap = await getDoc(docRef);

                if (!docSnap.exists()) {
                    // Fallback to UID for migration
                    const oldDocRef = doc(db, 'portfolios', user.uid);
                    docSnap = await getDoc(oldDocRef);
                }

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setProjects(data.projects || []);
                }
            } catch (error) {
                console.error("Error fetching projects:", error);
            }
        };
        fetchProjects();
    }, [user, profile]);

    const handleAddImageUrl = () => {
        if (imageUrlInput.trim()) {
            setNewProject(prev => ({ ...prev, imageUrl: imageUrlInput.trim() }));
            setImageUrlInput('');
        }
    };

    const removeImage = () => {
        setNewProject(prev => ({ ...prev, imageUrl: '' }));
        setImageUrlInput('');
    };

    const handleAddTech = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && techInput.trim()) {
            e.preventDefault();
            if (!newProject.technologies.includes(techInput.trim().toUpperCase())) {
                setNewProject(prev => ({ ...prev, technologies: [...prev.technologies, techInput.trim().toUpperCase()] }));
            }
            setTechInput('');
        }
    };

    const removeTech = (tech: string) => {
        setNewProject(prev => ({ ...prev, technologies: prev.technologies.filter(t => t !== tech) }));
    };

    const handleAddProject = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !profile?.zestId) return;
        setLoading(true);
        try {
            if (editingIndex !== null) {
                const updatedProjects = [...projects];
                updatedProjects[editingIndex] = newProject;
                await updateDoc(doc(db, 'portfolios', profile.zestId), {
                    projects: updatedProjects
                });
                setProjects(updatedProjects);
                setEditingIndex(null);
            } else {
                const projectToAdd = { ...newProject };
                await updateDoc(doc(db, 'portfolios', profile.zestId), {
                    projects: arrayUnion(projectToAdd)
                });
                setProjects(prev => [...prev, projectToAdd]);
            }

            setNewProject({
                title: '',
                description: '',
                technologies: [],
                link: '',
                repoLink: '',
                imageUrl: '',
            });
            setImageUrlInput('');
        } catch (error) {
            console.error("Error saving project:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (project: Project) => {
        if (!user || !profile?.zestId) return;
        if (confirm('Are you sure you want to delete this project?')) {
            try {
                await updateDoc(doc(db, 'portfolios', profile.zestId), {
                    projects: arrayRemove(project)
                });
                setProjects(prev => prev.filter(item => item !== project));
                if (editingIndex !== null) setEditingIndex(null);
            } catch (error) {
                console.error("Error deleting project:", error);
            }
        }
    }

    const handleEdit = (project: Project, index: number) => {
        setNewProject(project);
        setEditingIndex(index);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingIndex(null);
        setNewProject({
            title: '',
            description: '',
            technologies: [],
            link: '',
            repoLink: '',
            imageUrl: '',
        });
        setImageUrlInput('');
    };

    return (
        <div className="space-y-12">
            {/* Entry Form Card */}
            <Card className={cn(
                "rounded-[40px] border-border/40 bg-card/30 overflow-hidden transition-all duration-500",
                editingIndex !== null ? "border-primary/40 shadow-[0_0_50px_rgba(var(--primary-rgb),0.1)]" : ""
            )}>
                <CardHeader className="p-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={cn("p-2 rounded-xl transition-colors", editingIndex !== null ? "bg-primary text-white" : "bg-primary/10 text-primary")}>
                                {editingIndex !== null ? <Pencil className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                            </div>
                            <div>
                                <CardTitle className="text-2xl font-black uppercase italic tracking-tight italic">
                                    {editingIndex !== null ? 'Modify Invention' : 'New Invention Record'}
                                </CardTitle>
                                <CardDescription className="text-xs font-bold uppercase tracking-widest opacity-60">
                                    {editingIndex !== null ? `Refining prototype entry #${editingIndex + 1}` : 'Document your latest architectural feat'}
                                </CardDescription>
                            </div>
                        </div>
                        {editingIndex !== null && (
                            <Button variant="ghost" size="sm" onClick={handleCancelEdit} className="rounded-xl hover:bg-destructive/10 text-destructive font-black text-[10px] uppercase tracking-widest">
                                <X className="w-4 h-4 mr-2" /> ABORT EDIT
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="p-8 pt-0">
                    <form onSubmit={handleAddProject} className="space-y-8">
                        {/* Image Logic */}
                        <div className="space-y-4">
                            <Label className="text-[11px] font-black uppercase tracking-wider ml-1">Visual Evidence (Image URL)</Label>
                            {newProject.imageUrl ? (
                                <div className="relative group/img overflow-hidden rounded-[32px] border-4 border-background shadow-2xl h-64">
                                    <Image src={newProject.imageUrl} alt="Project preview" fill className="object-cover transition-transform duration-700 group-hover/img:scale-110" unoptimized />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity">
                                        <Button type="button" variant="destructive" size="icon" className="rounded-2xl scale-75 group-hover/img:scale-100 transition-transform" onClick={removeImage}>
                                            <X className="w-6 h-6" />
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="border-2 border-dashed border-border/60 rounded-[32px] p-10 bg-muted/20 group hover:border-primary/40 transition-colors">
                                    <div className="flex flex-col items-center gap-6">
                                        <div className="flex gap-4 w-full max-w-2xl">
                                            <Input value={imageUrlInput} onChange={(e) => setImageUrlInput(e.target.value)} placeholder="PASTE PROJECT PREVIEW LINK (IMGUR, USPLASH, ETC.)" className="h-14 rounded-2xl bg-background border-border/40 text-[11px] font-black tracking-widest uppercase" />
                                            <Button type="button" onClick={handleAddImageUrl} className="h-14 px-8 rounded-2xl bg-foreground text-background hover:bg-primary hover:text-white transition-all">
                                                <LinkIcon className="w-4 h-4 mr-2" /> ATTACH
                                            </Button>
                                        </div>
                                        <div className="flex flex-wrap justify-center gap-6 opacity-40">
                                            {['IMGUR', 'UNSPLASH', 'GITHUB', 'POSTIMAGES'].map(lib => (
                                                <span key={lib} className="text-[10px] font-black tracking-widest">{lib}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3 font-bold">
                                <Label className="text-[11px] font-black uppercase tracking-wider ml-1">Invention Title</Label>
                                <Input value={newProject.title} onChange={(e) => setNewProject({ ...newProject, title: e.target.value })} placeholder="e.g. NEURAL SYNESTHESIA" className="h-14 rounded-2xl bg-muted/40 border-border/40 text-base font-black italic tracking-tight uppercase" required />
                            </div>
                            <div className="space-y-3 font-bold">
                                <Label className="text-[11px] font-black uppercase tracking-wider ml-1">Core Tech Stack (Press Enter)</Label>
                                <div className="relative">
                                    <Input value={techInput} onChange={(e) => setTechInput(e.target.value)} onKeyDown={handleAddTech} placeholder="e.g. TYPESCRIPT, FIREBASE" className="h-14 rounded-2xl bg-muted/40 border-border/40 text-xs font-black tracking-widest uppercase pl-12" />
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40">
                                        <Code2 className="w-4 h-4" />
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2 pt-1">
                                    {newProject.technologies.map(tech => (
                                        <span key={tech} className="px-3 py-1 rounded-lg bg-primary/5 text-primary text-[10px] font-black tracking-widest border border-primary/20 flex items-center gap-2">
                                            {tech}
                                            <button type="button" onClick={() => removeTech(tech)} className="hover:text-destructive transition-colors"><X className="w-3 h-3" /></button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 font-bold">
                            <Label className="text-[11px] font-black uppercase tracking-wider ml-1">Project Specification</Label>
                            <textarea
                                value={newProject.description}
                                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                className="flex w-full rounded-[32px] border border-border/40 bg-muted/30 px-6 py-5 text-base font-medium ring-offset-background placeholder:text-muted-foreground/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 min-h-[140px] resize-none"
                                placeholder="Detail the technical architecture and problems solved..."
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3 font-bold group/link">
                                <Label className="text-[11px] font-black uppercase tracking-wider ml-1 flex items-center gap-2">
                                    <ExternalLink className="w-3.5 h-3.5" /> Deployment URL
                                </Label>
                                <Input value={newProject.link} onChange={(e) => setNewProject({ ...newProject, link: e.target.value })} placeholder="https://live-deploy.com" className="h-14 rounded-2xl bg-muted/40 border-border/40 text-sm font-black" />
                            </div>
                            <div className="space-y-3 font-bold group/link">
                                <Label className="text-[11px] font-black uppercase tracking-wider ml-1 flex items-center gap-2">
                                    <Github className="w-3.5 h-3.5" /> Source Control
                                </Label>
                                <Input value={newProject.repoLink} onChange={(e) => setNewProject({ ...newProject, repoLink: e.target.value })} placeholder="https://github.com/..." className="h-14 rounded-2xl bg-muted/40 border-border/40 text-sm font-black" />
                            </div>
                        </div>

                        <Button type="submit" disabled={loading} className="w-full h-16 rounded-3xl bg-foreground text-background font-black text-lg uppercase tracking-widest hover:bg-primary hover:text-white transition-all active:scale-[0.98] shadow-2xl">
                            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (editingIndex !== null ? <SaveIcon className="w-6 h-6 mr-3" /> : <Rocket className="w-6 h-6 mr-3" />)}
                            {editingIndex !== null ? 'SYNC ARCHIVE UPDATE' : 'DEPLOY TO PORTFOLIO'}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* List Section */}
            <div className="space-y-8">
                <div className="flex items-center gap-4 px-2">
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground/50">Stored Engineering Records</h3>
                    <div className="flex-1 h-[1px] bg-border/40" />
                </div>

                {projects.length === 0 ? (
                    <div className="py-24 flex flex-col items-center justify-center text-center space-y-6 rounded-[40px] border border-dashed border-border/40 bg-muted/10 opacity-30">
                        <Terminal className="w-20 h-20 text-primary/20" />
                        <div className="space-y-2">
                            <p className="text-xl font-black uppercase italic tracking-tighter">Laboratory Is Empty</p>
                            <p className="text-xs font-bold uppercase tracking-widest">No innovations documented in the vault yet.</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-8">
                        {projects.map((project, index) => (
                            <div
                                key={index}
                                className={cn(
                                    "group relative flex flex-col rounded-[48px] border bg-card/60 transition-all duration-700 hover:shadow-2xl overflow-hidden",
                                    editingIndex === index ? "border-primary/60 bg-primary/5 ring-4 ring-primary/5" : "border-border/40"
                                )}
                            >
                                {/* Project Visual */}
                                <div className="relative h-56 overflow-hidden">
                                    {project.imageUrl ? (
                                        <Image src={project.imageUrl} alt={project.title} fill className="object-cover transition-transform duration-1000 group-hover:scale-110" unoptimized />
                                    ) : (
                                        <div className="w-full h-full bg-muted/40 flex items-center justify-center">
                                            <Code2 className="w-16 h-16 text-primary/10" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                                    <div className="absolute bottom-6 left-8 right-8 flex items-center justify-between">
                                        <div className="flex gap-2">
                                            {project.technologies.slice(0, 3).map(t => (
                                                <span key={t} className="px-2 py-0.5 rounded-lg bg-white/10 backdrop-blur-md text-[8px] font-black text-white border border-white/20 uppercase tracking-widest">{t}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="absolute top-4 right-4 flex gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                        <Button variant="ghost" size="icon" onClick={() => handleEdit(project, index)} className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md text-white hover:bg-primary transition-all">
                                            <Pencil className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(project)} className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md text-white hover:bg-destructive transition-all">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="p-8 space-y-4">
                                    <h4 className="text-2xl font-black italic uppercase tracking-tight group-hover:text-primary transition-colors">{project.title}</h4>
                                    <p className="text-sm text-muted-foreground font-medium line-clamp-3 leading-relaxed">
                                        {project.description}
                                    </p>
                                    <div className="pt-4 flex items-center justify-between">
                                        <div className="flex gap-4">
                                            {project.link && (
                                                <a href={project.link} target="_blank" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:scale-105 transition-transform">
                                                    <ExternalLink className="w-3.5 h-3.5" /> LIVE SYSTEM
                                                </a>
                                            )}
                                            {project.repoLink && (
                                                <a href={project.repoLink} target="_blank" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground hover:scale-105 transition-transform">
                                                    <Github className="w-3.5 h-3.5" /> SOURCE
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}


