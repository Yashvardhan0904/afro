import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save, Upload, X, Image as ImageIcon } from "lucide-react";
import { useQuery, useMutation } from "@apollo/client/react";
import { GET_PRODUCT_BY_ID_QUERY, CREATE_PRODUCT_MUTATION, UPDATE_PRODUCT_MUTATION } from "@/graphql/products";
import { GET_CATEGORIES_QUERY } from "@/graphql/categories";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Layout from "@/components/Layout";

export default function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { token } = useAuth();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    mrp: "",
    stock: "",
    lowStockThreshold: "10",
    categoryId: "",
    metaTitle: "",
    metaDescription: "",
    isActive: true,
    isFeatured: false,
  });

  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  // Fetch product if editing
  const { data: productData } = useQuery(GET_PRODUCT_BY_ID_QUERY, {
    variables: { id },
    skip: !isEdit,
  });

  // Fetch categories
  const { data: categoriesData } = useQuery(GET_CATEGORIES_QUERY);

  const [createProduct, { loading: creating }] = useMutation(CREATE_PRODUCT_MUTATION);
  const [updateProduct, { loading: updating }] = useMutation(UPDATE_PRODUCT_MUTATION);

  const categories = (categoriesData as any)?.categories || [];

  // Populate form when editing
  useEffect(() => {
    if ((productData as any)?.product) {
      const p = (productData as any).product;
      setFormData({
        title: p.title,
        description: p.description,
        price: (p.price / 100).toString(),
        mrp: p.mrp ? (p.mrp / 100).toString() : "",
        stock: p.stock.toString(),
        lowStockThreshold: p.lowStockThreshold.toString(),
        categoryId: p.categoryId,
        metaTitle: p.metaTitle || "",
        metaDescription: p.metaDescription || "",
        isActive: p.isActive,
        isFeatured: p.isFeatured,
      });
      setImageUrls(p.images || []);
      setThumbnailUrl(p.thumbnail || "");
    }
  }, [productData]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append('images', file);
      });

      const graphqlUrl = import.meta.env.VITE_GRAPHQL_URL || 'https://brofr-production.up.railway.app/graphql';
      const baseUrl = graphqlUrl.replace('/graphql', '');

      const response = await fetch(`${baseUrl}/upload/images`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setImageUrls(prev => [...prev, ...data.urls]);

      // Set first image as thumbnail if not set
      if (!thumbnailUrl && data.urls.length > 0) {
        setThumbnailUrl(data.urls[0]);
      }

      toast({
        title: "Images uploaded",
        description: `${data.count} image(s) uploaded successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload images",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  const setAsThumbnail = (url: string) => {
    setThumbnailUrl(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (imageUrls.length === 0) {
      toast({
        title: "Images required",
        description: "Please upload at least one product image",
        variant: "destructive",
      });
      return;
    }

    try {
      const slug = formData.title
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

      const input = {
        title: formData.title,
        slug,
        description: formData.description,
        price: Math.round(parseFloat(formData.price) * 100), // Convert to paise
        mrp: formData.mrp ? Math.round(parseFloat(formData.mrp) * 100) : undefined,
        stock: parseInt(formData.stock),
        lowStockThreshold: parseInt(formData.lowStockThreshold),
        categoryId: formData.categoryId || undefined,
        images: imageUrls,
        thumbnail: thumbnailUrl || imageUrls[0],
        metaTitle: formData.metaTitle || undefined,
        metaDescription: formData.metaDescription || undefined,
        isActive: formData.isActive,
        isFeatured: formData.isFeatured,
      };

      if (isEdit) {
        await updateProduct({ variables: { id, input } });
        toast({
          title: "Product updated",
          description: "Product has been updated successfully",
        });
      } else {
        await createProduct({ variables: { input } });
        toast({
          title: "Product created",
          description: "Product has been created successfully",
        });
      }

      navigate("/admin/products");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save product",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <div className="pt-32 pb-24 luxury-container">
        <Link
          to="/admin/products"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Link>

        <h1 className="text-4xl font-serif mb-8">
          {isEdit ? "Edit Product" : "Add New Product"}
        </h1>

        <form onSubmit={handleSubmit} className="max-w-4xl space-y-8">
          {/* Basic Information */}
          <div className="glass-card rounded-3xl p-8">
            <h2 className="text-xl font-serif mb-6">Basic Information</h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Product Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="e.g., Celestial Silk Saree"
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={4}
                  placeholder="Detailed product description..."
                />
              </div>

              <div>
                <Label className="mb-4 block">Category {categories.length > 0 && "*"}</Label>
                {categories.length > 0 ? (
                  <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar -mx-2 px-2 mask-fade-edges">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, categoryId: "" })}
                      className={`px-6 py-2 rounded-full whitespace-nowrap text-sm border transition-all duration-300 ${formData.categoryId === ""
                        ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                        : "bg-background/50 border-border hover:border-primary/50 text-muted-foreground"
                        }`}
                    >
                      None
                    </button>
                    {categories.map((cat: any) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, categoryId: cat.id })}
                        className={`px-6 py-2 rounded-full whitespace-nowrap text-sm border transition-all duration-300 ${formData.categoryId === cat.id
                          ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                          : "bg-background/50 border-border hover:border-primary/50 text-muted-foreground"
                          }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-muted/30 border border-dashed border-border text-center text-sm text-muted-foreground">
                    No categories found. You can add them in Category Management.
                  </div>
                )}
                {/* Hidden input for HTML5 validation if categories exist */}
                {categories.length > 0 && (
                  <input
                    type="hidden"
                    value={formData.categoryId}
                    name="categoryId"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div className="glass-card rounded-3xl p-8">
            <h2 className="text-xl font-serif mb-6">Pricing & Inventory</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price (₹) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                  placeholder="299.99"
                />
              </div>

              <div>
                <Label htmlFor="mrp">MRP (₹)</Label>
                <Input
                  id="mrp"
                  type="number"
                  step="0.01"
                  value={formData.mrp}
                  onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
                  placeholder="399.99"
                />
              </div>

              <div>
                <Label htmlFor="stock">Stock Quantity *</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  required
                  placeholder="100"
                />
              </div>

              <div>
                <Label htmlFor="lowStock">Low Stock Alert</Label>
                <Input
                  id="lowStock"
                  type="number"
                  value={formData.lowStockThreshold}
                  onChange={(e) => setFormData({ ...formData, lowStockThreshold: e.target.value })}
                  placeholder="10"
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="glass-card rounded-3xl p-8">
            <h2 className="text-xl font-serif mb-6">Images</h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="images">Upload Images *</Label>
                <div className="mt-2">
                  <label
                    htmlFor="images"
                    className="flex items-center justify-center gap-2 w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors"
                  >
                    <Upload className="w-6 h-6 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {uploading ? "Uploading..." : "Click to upload images"}
                    </span>
                  </label>
                  <input
                    id="images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Upload up to 10 images. Max 5MB per image. Supported: JPG, PNG, GIF, WebP
                </p>
              </div>

              {/* Image Preview */}
              {imageUrls.length > 0 && (
                <div className="grid grid-cols-4 gap-4">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Product ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => setAsThumbnail(url)}
                          className="p-2 bg-primary rounded-full hover:bg-primary/80"
                          title="Set as thumbnail"
                        >
                          <ImageIcon className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="p-2 bg-destructive rounded-full hover:bg-destructive/80"
                          title="Remove image"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      {thumbnailUrl === url && (
                        <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                          Thumbnail
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* SEO */}
          <div className="glass-card rounded-3xl p-8">
            <h2 className="text-xl font-serif mb-6">SEO (Optional)</h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  value={formData.metaTitle}
                  onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                  placeholder="SEO title for search engines"
                />
              </div>

              <div>
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  value={formData.metaDescription}
                  onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                  rows={3}
                  placeholder="SEO description for search engines"
                />
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="glass-card rounded-3xl p-8">
            <h2 className="text-xl font-serif mb-6">Status</h2>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4"
                />
                <Label htmlFor="isActive" className="cursor-pointer">
                  Active (visible to customers)
                </Label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="w-4 h-4"
                />
                <Label htmlFor="isFeatured" className="cursor-pointer">
                  Featured (show on homepage)
                </Label>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={creating || updating || uploading}
              className="flex-1"
            >
              <Save className="w-4 h-4 mr-2" />
              {creating || updating ? "Saving..." : isEdit ? "Update Product" : "Create Product"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/products")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
