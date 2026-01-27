'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Plus, Trash2, Github, ExternalLink } from 'lucide-react';
import { Project } from '@/types';

export default function ProjectsForm() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [projects, setProjects] = useState<Project[]>([]);
    const [newProject, setNewProject] = useState<Project>({
        title: '',
        description: '',
        technologies: [],
        link: '',
        repoLink: '',
    });
    const [techInput, setTechInput] = useState('');

    useEffect(() => {
        const fetchProjects = async () => {
            if (!user) return;
            try {
                const docRef = doc(db, 'portfolios', user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setProjects(data.projects || []);
                }
            } catch (error) {
                console.error("Error fetching projects:", error);
            }
        };
        fetchProjects();
    }, [user]);

    const handleAddTech = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && techInput.trim()) {
            e.preventDefault();
            if (!newProject.technologies.includes(techInput.trim())) {
                setNewProject(prev => ({ ...prev, technologies: [...prev.technologies, techInput.trim()] }));
            }
            setTechInput('');
        }
    };

    const removeTech = (tech: string) => {
        setNewProject(prev => ({ ...prev, technologies: prev.technologies.filter(t => t !== tech) }));
    };

    const handleAddProject = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setLoading(true);
        try {
            const projectToAdd = { ...newProject };
            await updateDoc(doc(db, 'portfolios', user.uid), {
                projects: arrayUnion(projectToAdd)
            });
            setProjects(prev => [...prev, projectToAdd]);
            setNewProject({
                title: '',
                description: '',
                technologies: [],
                link: '',
                repoLink: '',
            });
        } catch (error) {
            console.error("Error adding project:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (project: Project) => {
        if (!user) return;
        try {
            await updateDoc(doc(db, 'portfolios', user.uid), {
                projects: arrayRemove(project)
            });
            setProjects(prev => prev.filter(item => item !== project));
        } catch (error) {
            console.error("Error deleting project:", error);
        }
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Add New Project</CardTitle>
                    <CardDescription>Showcase your best work.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAddProject} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Project Title</Label>
                            <Input id="title" value={newProject.title} onChange={(e) => setNewProject({ ...newProject, title: e.target.value })} placeholder="e.g. E-Commerce App" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <textarea
                                id="description"
                                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[80px]"
                                value={newProject.description}
                                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                placeholder="What does this project do?"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="tech">Technologies (Press Enter to add)</Label>
                            <Input
                                id="tech"
                                value={techInput}
                                onChange={(e) => setTechInput(e.target.value)}
                                onKeyDown={handleAddTech}
                                placeholder="e.g. React, Node.js"
                            />
                            <div className="flex flex-wrap gap-2 mt-2">
                                {newProject.technologies.map(tech => (
                                    <span key={tech} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs flex items-center gap-1">
                                        {tech}
                                        <button type="button" onClick={() => removeTech(tech)} className="hover:text-destructive">&times;</button>
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="link">Live Demo URL</Label>
                                <Input id="link" value={newProject.link} onChange={(e) => setNewProject({ ...newProject, link: e.target.value })} placeholder="https://..." />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="repoLink">GitHub Repo URL</Label>
                                <Input id="repoLink" value={newProject.repoLink} onChange={(e) => setNewProject({ ...newProject, repoLink: e.target.value })} placeholder="https://github.com/..." />
                            </div>
                        </div>
                        <Button type="submit" disabled={loading} className="w-full">
                            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                            Add Project
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
                {projects.map((project, index) => (
                    <Card key={index} className="flex flex-col">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-lg">{project.title}</CardTitle>
                                <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(project)}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                            <CardDescription className="line-clamp-2">{project.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <div className="flex flex-wrap gap-2 mb-4">
                                {project.technologies.map(t => (
                                    <span key={t} className="bg-muted px-2 py-1 rounded-md text-xs text-muted-foreground">{t}</span>
                                ))}
                            </div>
                            <div className="flex gap-4 text-sm">
                                {project.link && <a href={project.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline"><ExternalLink className="w-3 h-3" /> Demo</a>}
                                {project.repoLink && <a href={project.repoLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline"><Github className="w-3 h-3" /> Code</a>}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
