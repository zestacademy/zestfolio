'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Plus, Trash2, Github, ExternalLink, Pencil, SaveIcon, Link as LinkIcon, X } from 'lucide-react';
import { Project } from '@/types';
import Image from 'next/image';

export default function ProjectsForm() {
    const { user } = useAuth();
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
            if (editingIndex !== null) {
                // Update existing
                const updatedProjects = [...projects];
                updatedProjects[editingIndex] = newProject;

                await updateDoc(doc(db, 'portfolios', user.uid), {
                    projects: updatedProjects
                });
                setProjects(updatedProjects);
                setEditingIndex(null);
            } else {
                // Add new
                const projectToAdd = { ...newProject };
                await updateDoc(doc(db, 'portfolios', user.uid), {
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
        if (!user) return;
        if (confirm('Are you sure you want to delete this project?')) {
            try {
                await updateDoc(doc(db, 'portfolios', user.uid), {
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
        <div className="space-y-6">
            <Card className={editingIndex !== null ? "border-primary" : ""}>
                <CardHeader>
                    <CardTitle>{editingIndex !== null ? 'Edit Project' : 'Add New Project'}</CardTitle>
                    <CardDescription>Showcase your best work with images from external sources.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAddProject} className="space-y-4">
                        {/* Project Image URL Input */}
                        <div className="space-y-2">
                            <Label>Project Image (Optional)</Label>
                            {newProject.imageUrl ? (
                                <div className="space-y-2">
                                    <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                                        <Image
                                            src={newProject.imageUrl}
                                            alt="Project preview"
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-2 right-2"
                                            onClick={removeImage}
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Current: {newProject.imageUrl.substring(0, 50)}...
                                    </p>
                                </div>
                            ) : (
                                <div className="border-2 border-dashed rounded-lg p-6">
                                    <div className="space-y-3">
                                        <div className="flex gap-2">
                                            <Input
                                                value={imageUrlInput}
                                                onChange={(e) => setImageUrlInput(e.target.value)}
                                                placeholder="Paste image URL (e.g., from Imgur, Unsplash, etc.)"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        handleAddImageUrl();
                                                    }
                                                }}
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={handleAddImageUrl}
                                            >
                                                <LinkIcon className="w-4 h-4 mr-2" />
                                                Add
                                            </Button>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-xs text-muted-foreground font-medium">
                                                📸 Free Image Hosting Options:
                                            </p>
                                            <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                                                <li>• <a href="https://imgur.com" target="_blank" className="text-primary hover:underline">Imgur.com</a> - Upload & copy direct link</li>
                                                <li>• <a href="https://postimages.org" target="_blank" className="text-primary hover:underline">PostImages.org</a> - No account needed</li>
                                                <li>• <a href="https://imgbb.com" target="_blank" className="text-primary hover:underline">ImgBB.com</a> - Free image hosting</li>
                                                <li>• <a href="https://unsplash.com" target="_blank" className="text-primary hover:underline">Unsplash.com</a> - Free stock photos</li>
                                                <li>• GitHub - Upload to your repo & use raw URL</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

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
                        <div className="flex gap-2">
                            <Button type="submit" disabled={loading} className="flex-1">
                                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : (editingIndex !== null ? <SaveIcon className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />)}
                                {editingIndex !== null ? 'Update Project' : 'Add Project'}
                            </Button>
                            {editingIndex !== null && (
                                <Button type="button" variant="outline" onClick={handleCancelEdit}>
                                    Cancel
                                </Button>
                            )}
                        </div>
                    </form>
                </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
                {projects.map((project, index) => (
                    <Card key={index} className={`flex flex-col ${editingIndex === index ? 'ring-2 ring-primary' : ''}`}>
                        {project.imageUrl && (
                            <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                                <Image
                                    src={project.imageUrl}
                                    alt={project.title}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                            </div>
                        )}
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-lg">{project.title}</CardTitle>
                                <div className="flex gap-1">
                                    <Button variant="ghost" size="icon" onClick={() => handleEdit(project, index)}>
                                        <Pencil className="w-4 h-4 text-primary" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(project)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
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
