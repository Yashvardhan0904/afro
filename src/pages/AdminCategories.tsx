import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, Database, AlertCircle, Save } from "lucide-react";
import { useQuery, useMutation } from "@apollo/client/react";
import { GET_CATEGORIES_QUERY, CREATE_CATEGORY_MUTATION, DELETE_CATEGORY_MUTATION } from "@/graphql/categories";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Layout from "@/components/Layout";

const DEFAULT_CATEGORIES = [
    { name: "Statues", slug: "statues", description: "Beautiful handcrafted statues of deities and spiritual figures" },
    { name: "Sacred Jewelry", slug: "sacred-jewelry", description: "Handcrafted spiritual jewelry with sacred symbols" },
    { name: "Meditation Tools", slug: "meditation-tools", description: "Tools to enhance your meditation practice" },
    { name: "Incense & Aromatherapy", slug: "incense-aromatherapy", description: "Premium incense, essential oils and aromatherapy products" },
    { name: "Crystals & Gemstones", slug: "crystals-gemstones", description: "Natural healing crystals and precious gemstones" },
    { name: "Spiritual Textiles", slug: "spiritual-textiles", description: "Sacred textiles, tapestries and fabrics for spiritual practices" },
    { name: "Home Decor", slug: "home-decor", description: "Spiritual and luxury home decoration items" },
    { name: "Books & Journals", slug: "books-journals", description: "Spiritual books, guided journals and sacred texts" },
];

export default function AdminCategories() {
    const { toast } = useToast();
    const [newCat, setNewCat] = useState({ name: "", slug: "", description: "" });
    const [isSeeding, setIsSeeding] = useState(false);

    // Fetch categories
    const { data, loading, refetch } = useQuery(GET_CATEGORIES_QUERY);
    const categories = (data as any)?.categories || [];

    const [createCategory, { loading: creating }] = useMutation(CREATE_CATEGORY_MUTATION);
    const [deleteCategory] = useMutation(DELETE_CATEGORY_MUTATION);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createCategory({
                variables: {
                    input: {
                        ...newCat
                    }
                }
            });
            toast({
                title: "Category Created",
                description: `${newCat.name} has been added to the temple archives.`,
            });
            setNewCat({ name: "", slug: "", description: "" });
            refetch();
        } catch (error: any) {
            toast({
                title: "Creation Failed",
                description: error.message,
                variant: "destructive",
            });
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete "${name}"? This may affect products in this category.`)) return;

        try {
            await deleteCategory({ variables: { id } });
            toast({
                title: "Category Removed",
                description: `${name} has been removed from the archives.`,
            });
            refetch();
        } catch (error: any) {
            toast({
                title: "Deletion Failed",
                description: error.message,
                variant: "destructive",
            });
        }
    };

    const handleQuickSeed = async () => {
        setIsSeeding(true);
        let successCount = 0;

        for (const cat of DEFAULT_CATEGORIES) {
            // Check if already exists to avoid duplicates
            if (categories.some((existing: any) => existing.slug === cat.slug)) continue;

            try {
                await createCategory({
                    variables: {
                        input: {
                            ...cat
                        }
                    }
                });
                successCount++;
            } catch (err) {
                console.error(`Failed to seed ${cat.name}:`, err);
            }
        }

        setIsSeeding(false);
        toast({
            title: "Seeding Complete",
            description: `${successCount} new categories initialized successfully.`,
        });
        refetch();
    };

    return (
        <Layout>
            <div className="pt-32 pb-24 luxury-container max-w-5xl">
                <Link to="/admin/products" className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-muted-foreground hover:text-primary mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Products
                </Link>

                <div className="flex justify-between items-start mb-12">
                    <div>
                        <h1 className="text-4xl font-serif mb-2 gold-text">Category Archives</h1>
                        <p className="text-muted-foreground text-sm uppercase tracking-widest font-sans">Organize your sacred masterpieces</p>
                    </div>

                    <Button
                        onClick={handleQuickSeed}
                        disabled={isSeeding}
                        variant="outline"
                        className="flex items-center gap-2 border-primary/20 hover:bg-primary/5 rounded-full px-6"
                    >
                        <Database className="w-4 h-4" />
                        {isSeeding ? "Seeding..." : "Quick Seed Defaults"}
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* List Section */}
                    <div className="lg:col-span-7 space-y-6">
                        <h2 className="text-[10px] tracking-futuristic uppercase text-muted-foreground mb-4">Existing Categories</h2>

                        {loading ? (
                            <p className="text-muted-foreground animate-pulse uppercase tracking-widest text-xs">Summoning categories...</p>
                        ) : categories.length === 0 ? (
                            <div className="glass-card p-12 text-center rounded-3xl border border-dashed border-primary/10">
                                <AlertCircle className="w-8 h-8 text-primary/40 mx-auto mb-4" />
                                <p className="text-muted-foreground font-sans italic">The archives are empty. Initialize with defaults or create one.</p>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {categories.map((cat: any) => (
                                    <div key={cat.id} className="glass-card p-6 rounded-2xl flex justify-between items-center group hover:border-primary/20 transition-all">
                                        <div>
                                            <h3 className="font-serif text-lg">{cat.name}</h3>
                                            <p className="text-[10px] tracking-widest text-muted-foreground uppercase">{cat.slug}</p>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(cat.id, cat.name)}
                                            className="p-3 text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Creation Section */}
                    <div className="lg:col-span-5">
                        <div className="glass-card p-8 rounded-3xl sticky top-32 border-primary/5 shadow-2xl">
                            <h2 className="text-xl font-serif mb-8 flex items-center gap-2">
                                <Plus className="w-5 h-5 gold-text" />
                                Add New Category
                            </h2>

                            <form onSubmit={handleCreate} className="space-y-6">
                                <div>
                                    <Label htmlFor="name" className="text-[10px] tracking-widest uppercase mb-2 block">Name *</Label>
                                    <Input
                                        id="name"
                                        value={newCat.name}
                                        onChange={(e) => {
                                            const name = e.target.value;
                                            const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                                            setNewCat({ ...newCat, name, slug });
                                        }}
                                        required
                                        placeholder="e.g., Sacred Crafts"
                                        className="bg-background/20 rounded-xl"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="slug" className="text-[10px] tracking-widest uppercase mb-2 block">Slug *</Label>
                                    <Input
                                        id="slug"
                                        value={newCat.slug}
                                        onChange={(e) => setNewCat({ ...newCat, slug: e.target.value })}
                                        required
                                        placeholder="sacred-crafts"
                                        className="bg-background/20 rounded-xl"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="desc" className="text-[10px] tracking-widest uppercase mb-2 block">Description</Label>
                                    <Textarea
                                        id="desc"
                                        value={newCat.description}
                                        onChange={(e) => setNewCat({ ...newCat, description: e.target.value })}
                                        rows={4}
                                        placeholder="Describe the essence of this category..."
                                        className="bg-background/20 rounded-xl resize-none"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={creating}
                                    className="w-full rounded-xl h-12 gold-bg text-[10px] tracking-futuristic uppercase flex items-center justify-center gap-2"
                                >
                                    <Save className="w-4 h-4" />
                                    {creating ? "Creating..." : "Save to Archive"}
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
