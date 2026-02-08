import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { Package, Truck, CheckCircle, XCircle, Clock, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";
import { UPDATE_ORDER_STATUS_MUTATION, GET_ALL_ORDERS_QUERY } from "@/graphql/orders";

const statusConfig = {
  PENDING: { 
    label: "Pending", 
    color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20", 
    icon: Clock,
    nextStatus: "PAID",
    nextLabel: "Mark as Paid"
  },
  PAID: { 
    label: "Paid", 
    color: "bg-blue-500/10 text-blue-600 border-blue-500/20", 
    icon: CheckCircle,
    nextStatus: "PROCESSING",
    nextLabel: "Start Processing"
  },
  PROCESSING: { 
    label: "Processing", 
    color: "bg-purple-500/10 text-purple-600 border-purple-500/20", 
    icon: Package,
    nextStatus: "SHIPPED",
    nextLabel: "Mark as Shipped"
  },
  SHIPPED: { 
    label: "Shipped", 
    color: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20", 
    icon: Truck,
    nextStatus: "DELIVERED",
    nextLabel: "Mark as Delivered"
  },
  DELIVERED: { 
    label: "Delivered", 
    color: "bg-green-500/10 text-green-600 border-green-500/20", 
    icon: CheckCircle,
    nextStatus: null,
    nextLabel: null
  },
  CANCELLED: { 
    label: "Cancelled", 
    color: "bg-red-500/10 text-red-600 border-red-500/20", 
    icon: XCircle,
    nextStatus: null,
    nextLabel: null
  },
  RETURNED: { 
    label: "Returned", 
    color: "bg-orange-500/10 text-orange-600 border-orange-500/20", 
    icon: XCircle,
    nextStatus: null,
    nextLabel: null
  },
  REFUNDED: { 
    label: "Refunded", 
    color: "bg-gray-500/10 text-gray-600 border-gray-500/20", 
    icon: XCircle,
    nextStatus: null,
    nextLabel: null
  },
};

export default function AdminOrders() {
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const { toast } = useToast();

  const { data, loading, error, refetch } = useQuery(GET_ALL_ORDERS_QUERY, {
    variables: {
      skip: 0,
      take: 100,
      status: selectedStatus !== "all" ? selectedStatus : undefined,
    },
  });

  const [updateOrderStatus, { loading: updating }] = useMutation(UPDATE_ORDER_STATUS_MUTATION);

  const orders = data?.allOrders?.orders || [];
  const total = data?.allOrders?.total || 0;

  const handleStatusUpdate = async (orderId: string, orderNumber: string, newStatus: string) => {
    try {
      await updateOrderStatus({
        variables: {
          id: orderId,
          input: { status: newStatus }
        }
      });

      toast({
        title: "Order updated",
        description: `Order #${orderNumber} status updated to ${statusConfig[newStatus as keyof typeof statusConfig]?.label}`,
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

  if (loading) {
    return (
      <Layout>
        <div className="pt-40 pb-20 text-center luxury-container">
          <p className="text-muted-foreground">Loading orders...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="pt-40 pb-20 text-center luxury-container">
          <p className="text-destructive">Error loading orders: {error.message}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="pt-32 pb-24 luxury-container">
        {/* Header with Navigation */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link
              to="/admin/products"
              className="glass-card px-6 py-3 rounded-full hover:bg-muted/50 transition-all"
            >
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                <span className="text-sm font-medium">Products</span>
              </div>
            </Link>
            <Link
              to="/admin/orders"
              className="glass-card px-6 py-3 rounded-full bg-primary/10 border-primary/20"
            >
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Orders</span>
              </div>
            </Link>
          </div>
          
          <h1 className="text-4xl font-serif mb-2">Order Management</h1>
          <p className="text-muted-foreground text-sm">
            {total} total order{total !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Status Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedStatus("all")}
            className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider transition-all whitespace-nowrap ${
              selectedStatus === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            All Orders
          </button>
          {Object.entries(statusConfig).map(([status, config]) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider transition-all whitespace-nowrap ${
                selectedStatus === status
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {config.label}
            </button>
          ))}
        </div>

        {/* Orders Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {orders.length === 0 ? (
            <div className="col-span-full glass-card rounded-3xl p-12 text-center">
              <p className="text-muted-foreground">No orders found</p>
            </div>
          ) : (
            orders.map((order: any) => {
              const StatusIcon = statusConfig[order.status as keyof typeof statusConfig]?.icon || Package;
              const statusStyle = statusConfig[order.status as keyof typeof statusConfig]?.color || "";
              const nextStatus = statusConfig[order.status as keyof typeof statusConfig]?.nextStatus;
              const nextLabel = statusConfig[order.status as keyof typeof statusConfig]?.nextLabel;

              return (
                <div key={order.id} className="glass-card rounded-3xl p-6 hover:shadow-lg transition-shadow">
                  {/* Order Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-serif mb-2">#{order.orderNumber}</h3>
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${statusStyle}`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusConfig[order.status as keyof typeof statusConfig]?.label}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-serif gold-text">₹{(order.totalAmount / 100).toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Customer */}
                  <div className="mb-4 p-3 bg-muted/20 rounded-xl">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Customer</p>
                    <p className="text-sm font-medium">{order.user?.name || 'Guest'}</p>
                    <p className="text-xs text-muted-foreground">{order.shippingPhone}</p>
                  </div>

                  {/* Shipping Address */}
                  <div className="mb-4 p-3 bg-muted/20 rounded-xl">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Delivery To</p>
                    <p className="text-sm">{order.shippingLine1}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.shippingCity}, {order.shippingState} {order.shippingPincode}
                    </p>
                  </div>

                  {/* Items Summary */}
                  <div className="mb-4">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                      {order.items.length} Item{order.items.length !== 1 ? 's' : ''}
                    </p>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {order.items.slice(0, 3).map((item: any) => (
                        <div key={item.id} className="flex-shrink-0">
                          {item.productImage && (
                            <img
                              src={item.productImage}
                              alt={item.productTitle}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                          )}
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="w-16 h-16 rounded-lg bg-muted/50 flex items-center justify-center text-xs text-muted-foreground">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  {nextStatus && nextLabel && (
                    <Button
                      onClick={() => handleStatusUpdate(order.id, order.orderNumber, nextStatus)}
                      disabled={updating}
                      className="w-full mt-4"
                    >
                      {nextLabel}
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                  
                  {order.status === 'DELIVERED' && (
                    <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-center">
                      <p className="text-sm text-green-600 font-medium">Order Completed</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </Layout>
  );
}
