import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit, Trash2, Eye, EyeOff, Database } from "lucide-react";
import { useQuery, useMutation } from "@apollo/client/react";
import { GET_PRODUCTS_QUERY, DELETE_PRODUCT_MUTATION, UPDATE_PRODUCT_MUTATION } from "@/graphql/products";
import { GET_CATEGORIES_QUERY } from "@/graphql/categories";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";

export default function AdminProducts() {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Fetch products
  const { data: productsData, loading: productsLoading, refetch } = useQuery(GET_PRODUCTS_QUERY, {
    variables: {
      skip: 0,
      take: 100,
      filters: selectedCategory !== "all" ? { categorySlug: selectedCategory } : undefined
    }
  });

  // Fetch categories
  const { data: categoriesData } = useQuery(GET_CATEGORIES_QUERY);

  const [deleteProduct] = useMutation(DELETE_PRODUCT_MUTATION);
  const [updateProduct] = useMutation(UPDATE_PRODUCT_MUTATION);

  const products = (productsData as any)?.products?.products || [];
  const categories = (categoriesData as any)?.categories || [];

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      await deleteProduct({ variables: { id } });
      toast({
        title: "Product deleted",
        description: `${title} has been deleted successfully`,
      });
      refetch();
    } catch (error: any) {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean, title: string) => {
    try {
      await updateProduct({
        variables: {
          id,
          input: { isActive: !currentStatus }
        }
      });
      toast({
        title: currentStatus ? "Product deactivated" : "Product activated",
        description: `${title} is now ${!currentStatus ? 'active' : 'inactive'}`,
      });
      refetch();
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (productsLoading) {
    return (
      <Layout>
        <div className="pt-40 pb-20 text-center luxury-container">
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="pt-32 pb-24 luxury-container">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-serif mb-2">Product Management</h1>
            <p className="text-muted-foreground text-sm">Manage your product catalog</p>
          </div>
          <div className="flex gap-4">
            <Link to="/admin/categories">
              <Button variant="outline" className="flex items-center gap-2 border-primary/20">
                <Database className="w-4 h-4" />
                Manage Categories
              </Button>
            </Link>
            <Link to="/admin/products/new">
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Product
              </Button>
            </Link>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider transition-all ${selectedCategory === "all"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
          >
            All
          </button>
          {categories.map((cat: any) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider transition-all whitespace-nowrap ${selectedCategory === cat.slug
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Products Table */}
        <div className="glass-card rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border/10">
                <tr>
                  <th className="text-left p-4 text-xs uppercase tracking-wider text-muted-foreground font-medium">
                    Product
                  </th>
                  <th className="text-left p-4 text-xs uppercase tracking-wider text-muted-foreground font-medium">
                    Category
                  </th>
                  <th className="text-right p-4 text-xs uppercase tracking-wider text-muted-foreground font-medium">
                    Price
                  </th>
                  <th className="text-right p-4 text-xs uppercase tracking-wider text-muted-foreground font-medium">
                    Stock
                  </th>
                  <th className="text-center p-4 text-xs uppercase tracking-wider text-muted-foreground font-medium">
                    Status
                  </th>
                  <th className="text-right p-4 text-xs uppercase tracking-wider text-muted-foreground font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center p-12 text-muted-foreground">
                      No products found. Create your first product!
                    </td>
                  </tr>
                ) : (
                  products.map((product: any) => (
                    <tr key={product.id} className="border-b border-border/5 hover:bg-muted/20 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.thumbnail || product.images?.[0] || '/placeholder.svg'}
                            alt={product.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-medium">{product.title}</p>
                            <p className="text-xs text-muted-foreground">{product.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm">{product.category?.name || 'N/A'}</span>
                      </td>
                      <td className="p-4 text-right">
                        <span className="font-medium">₹{(product.price / 100).toFixed(2)}</span>
                      </td>
                      <td className="p-4 text-right">
                        <span className={product.stock < product.lowStockThreshold ? 'text-destructive font-medium' : ''}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleToggleActive(product.id, product.isActive, product.title)}
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${product.isActive
                            ? 'bg-green-500/10 text-green-600'
                            : 'bg-red-500/10 text-red-600'
                            }`}
                        >
                          {product.isActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          {product.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link to={`/admin/products/edit/${product.id}`}>
                            <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                              <Edit className="w-4 h-4" />
                            </button>
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id, product.title)}
                            className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
