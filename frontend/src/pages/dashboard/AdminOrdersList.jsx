import React, { useState, useEffect } from "react";
import {
  useGetAllOrdersQuery,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
} from "../../redux/features/orders/ordersApi";
import "./AdminOrdersList.css";
import PercentageSlider from './../../components/PercentageSlider.jsx';

const AdminOrdersList = () => {
  const { data: orders, error, isLoading, refetch } = useGetAllOrdersQuery();
  const [updateOrder] = useUpdateOrderMutation();
  const [deleteOrder] = useDeleteOrderMutation();
  const [localOrders, setLocalOrders] = useState([]);

  // Load orders from backend when available
  useEffect(() => {
    if (orders) {
      setLocalOrders([...orders]);
    }
  }, [orders]);

  if (isLoading) return <p>Loading orders...</p>;
  if (error) return <p>Error fetching orders: {error.message}</p>;

  const handleStatusChange = async (orderId, field, value) => {
    try {
      const updatedOrder = await updateOrder({
        orderId,
        [field]: value, // ✅ Ensures correct key-value pair in API request
      }).unwrap();

      // ✅ Update local state to prevent UI flicker
      setLocalOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, [field]: value } : order
        )
      );

      console.log(`Order ${orderId} ${field} updated to:`, value);
      refetch(); // ✅ Refreshes data to sync with backend
    } catch (err) {
      console.error(`Error updating order ${orderId} ${field}:`, err);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      await deleteOrder(orderId).unwrap();
      setLocalOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
    } catch (err) {
      console.error("Error deleting order:", err);
      alert("Failed to delete the order.");
    }
  };

  return (
    <div className="admin-orders-list">
      <h2>Orders List</h2>
      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Product IDs</th>
              <th>Street</th>
              <th>City</th>
              <th>State</th>
              <th>Zipcode</th>
              <th>Created At</th>
              <th>Total</th>
              <th>Paid</th>
              <th>Delivered</th>
              <th>Product Completion</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {localOrders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.name || "N/A"}</td>
                <td>{order.email || "N/A"}</td>
                <td>{order.phone || "N/A"}</td>
                <td>{order.productIds?.join(", ") || "N/A"}</td>
                <td>{order.address?.street || "N/A"}</td>
                <td>{order.address?.city || "N/A"}</td>
                <td>{order.address?.state || "N/A"}</td>
                <td>{order.address?.zipcode || "N/A"}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>${order.totalPrice}</td>
                <td>
                  <select
                    className="status-selector"
                    value={order.paid}
                    onChange={(e) =>
                      handleStatusChange(order._id, "paid", e.target.value)
                    }
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </td>
                <td>
                  <select
                    className="status-selector"
                    value={order.delivered}
                    onChange={(e) =>
                      handleStatusChange(order._id, "delivered", e.target.value)
                    }
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </td>
                <td><PercentageSlider /></td>
                <td>
                  <button className="delete-button" onClick={() => handleDeleteOrder(order._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrdersList;
