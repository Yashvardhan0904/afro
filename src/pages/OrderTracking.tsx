import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client/react';
import { GET_ORDER_BY_ID_QUERY } from '../graphql/orders';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { ArrowLeft, Package, MapPin, Phone, Mail, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';

const statusConfig = {
  PENDING: { label: 'Pending', color: 'bg-yellow-500', icon: Clock },
  CONFIRMED: { label: 'Confirmed', color: 'bg-blue-500', icon: CheckCircle },
  PROCESSING: { label: 'Processing', color: 'bg-purple-500', icon: Package },
  SHIPPED: { label: 'Shipped', color: 'bg-indigo-500', icon: Truck },
  DELIVERED: { label: 'Delivered', color: 'bg-green-500', icon: CheckCircle },
  CANCELLED: { label: 'Cancelled', color: 'bg-red-500', icon: XCircle },
};

const statusOrder = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

export default function OrderTracking() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const { data, loading, error } = useQuery(GET_ORDER_BY_ID_QUERY, {
    variables: { id: orderId },
    pollInterval: 10000, // Poll every 10 seconds (less aggressive)
    fetchPolicy: 'cache-and-network', // Use cache first to prevent blinking
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data?.order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">Error loading order: {error?.message || 'Order not found'}</p>
            <Button onClick={() => navigate('/orders')} className="mt-4">
              Back to Orders
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const order = data.order;
  const config = statusConfig[order.status as keyof typeof statusConfig];
  const StatusIcon = config.icon;
  const currentStatusIndex = statusOrder.indexOf(order.status);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate('/orders')} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Orders
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Order #{order.orderNumber}</h1>
            <p className="text-gray-600">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
          <Badge className={`${config.color} text-white flex items-center gap-2 px-4 py-2 text-lg`}>
            <StatusIcon className="w-5 h-5" />
            {config.label}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Timeline */}
          {order.status !== 'CANCELLED' && (
            <Card>
              <CardHeader>
                <CardTitle>Order Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {statusOrder.map((status, index) => {
                    const isCompleted = index <= currentStatusIndex;
                    const isCurrent = index === currentStatusIndex;
                    const statusCfg = statusConfig[status as keyof typeof statusConfig];
                    const Icon = statusCfg.icon;

                    return (
                      <div key={status} className="flex items-start mb-8 last:mb-0">
                        {/* Timeline Line */}
                        {index < statusOrder.length - 1 && (
                          <div
                            className={`absolute left-5 top-12 w-0.5 h-16 ${
                              isCompleted ? 'bg-green-500' : 'bg-gray-300'
                            }`}
                          />
                        )}

                        {/* Icon */}
                        <div
                          className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full ${
                            isCompleted
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-200 text-gray-400'
                          } ${isCurrent ? 'ring-4 ring-green-200' : ''}`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>

                        {/* Content */}
                        <div className="ml-4 flex-1">
                          <p className={`font-semibold ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                            {statusCfg.label}
                          </p>
                          {isCompleted && order.trackingEvents && (
                            <div className="mt-1 text-sm text-gray-600">
                              {order.trackingEvents
                                .filter((event: any) => event.status === status)
                                .map((event: any) => (
                                  <div key={event.id} className="mb-1">
                                    <p className="text-xs text-gray-500">
                                      {new Date(event.createdAt).toLocaleString()}
                                    </p>
                                    {event.note && <p className="text-sm">{event.note}</p>}
                                  </div>
                                ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Cancelled Status */}
          {order.status === 'CANCELLED' && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-600 flex items-center gap-2">
                  <XCircle className="w-5 h-5" />
                  Order Cancelled
                </CardTitle>
              </CardHeader>
              <CardContent>
                {order.cancelReason && (
                  <p className="text-gray-700">
                    <span className="font-semibold">Reason:</span> {order.cancelReason}
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex items-center gap-4">
                    {item.productImage && (
                      <img
                        src={item.productImage}
                        alt={item.productTitle}
                        className="w-20 h-20 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-semibold">{item.productTitle}</p>
                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity} × ₹{(item.pricePerUnit / 100).toFixed(2)}
                      </p>
                    </div>
                    <p className="font-semibold">₹{(item.totalPrice / 100).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span>₹{(order.subtotal / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span>₹{(order.tax / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span>₹{(order.shippingCharge / 100).toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span>-₹{(order.discount / 100).toFixed(2)}</span>
                </div>
              )}
              <div className="border-t pt-2 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{(order.totalAmount / 100).toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="font-semibold">{order.shippingName}</p>
              <p className="text-gray-600">{order.shippingLine1}</p>
              {order.shippingLine2 && <p className="text-gray-600">{order.shippingLine2}</p>}
              <p className="text-gray-600">
                {order.shippingCity}, {order.shippingState} {order.shippingPincode}
              </p>
              <p className="text-gray-600">{order.shippingCountry}</p>
              <div className="pt-2 border-t">
                <p className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-4 h-4" />
                  {order.shippingPhone}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {order.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Order Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{order.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
