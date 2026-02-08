import { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_MY_ORDERS_QUERY } from '../graphql/orders';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Package, Clock, CheckCircle, XCircle, Truck } from 'lucide-react';

const statusConfig = {
  PENDING: { label: 'Pending', color: 'bg-yellow-500', icon: Clock },
  CONFIRMED: { label: 'Confirmed', color: 'bg-blue-500', icon: CheckCircle },
  PROCESSING: { label: 'Processing', color: 'bg-purple-500', icon: Package },
  SHIPPED: { label: 'Shipped', color: 'bg-indigo-500', icon: Truck },
  DELIVERED: { label: 'Delivered', color: 'bg-green-500', icon: CheckCircle },
  CANCELLED: { label: 'Cancelled', color: 'bg-red-500', icon: XCircle },
};

export default function MyOrders() {
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const { data, loading, error, refetch } = useQuery(GET_MY_ORDERS_QUERY, {
    variables: {
      skip: 0,
      take: 50,
      status: selectedStatus,
    },
    pollInterval: 10000, // Poll every 10 seconds (less aggressive)
    fetchPolicy: 'cache-and-network', // Use cache first to prevent blinking
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">Error loading orders: {error.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const orders = data?.myOrders?.orders || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Orders</h1>
        <p className="text-gray-600">Track and manage your orders</p>
      </div>

      {/* Status Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <Button
          variant={selectedStatus === null ? 'default' : 'outline'}
          onClick={() => setSelectedStatus(null)}
          size="sm"
        >
          All Orders
        </Button>
        {Object.entries(statusConfig).map(([status, config]) => (
          <Button
            key={status}
            variant={selectedStatus === status ? 'default' : 'outline'}
            onClick={() => setSelectedStatus(status)}
            size="sm"
          >
            {config.label}
          </Button>
        ))}
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 mb-4">No orders found</p>
            <Button onClick={() => navigate('/collections')}>Start Shopping</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => {
            const config = statusConfig[order.status as keyof typeof statusConfig];
            const StatusIcon = config.icon;

            return (
              <Card key={order.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Order #{order.orderNumber}</CardTitle>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <Badge className={`${config.color} text-white flex items-center gap-1`}>
                      <StatusIcon className="w-4 h-4" />
                      {config.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Order Items */}
                    <div className="space-y-2">
                      {order.items.map((item: any) => (
                        <div key={item.id} className="flex items-center gap-4 text-sm">
                          <div className="flex-1">
                            <p className="font-medium">{item.productTitle}</p>
                            <p className="text-gray-500">
                              Qty: {item.quantity} × ₹{(item.pricePerUnit / 100).toFixed(2)}
                            </p>
                          </div>
                          <p className="font-semibold">₹{(item.totalPrice / 100).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>

                    {/* Total */}
                    <div className="border-t pt-4 flex items-center justify-between">
                      <p className="font-semibold">Total Amount</p>
                      <p className="text-xl font-bold">₹{(order.totalAmount / 100).toFixed(2)}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => navigate(`/orders/${order.id}`)}
                      >
                        View Details & Track
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
