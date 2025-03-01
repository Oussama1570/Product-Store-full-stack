import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getBaseUrl from "../../../utils/baseURL";

const ordersApi = createApi({
  reducerPath: "ordersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${getBaseUrl().replace(/\/$/, "")}/api/orders`,
    credentials: "include",
  }),
  tagTypes: ["Orders"], // ✅ Ensures automatic refetching after updates
  endpoints: (builder) => ({
    // ✅ Create a new order
    createOrder: builder.mutation({
      query: (newOrder) => ({
        url: "/",
        method: "POST",
        body: newOrder,
        credentials: "include",
      }),
      invalidatesTags: ["Orders"], // Refresh orders after creation
    }),

    // ✅ Get orders by user email
    getOrderByEmail: builder.query({
      query: (email) => ({
        url: `/email/${email}`,
      }),
      providesTags: ["Orders"],
    }),

    // ✅ Get all orders (for Admin)
    getAllOrders: builder.query({
      query: () => "/",
      providesTags: ["Orders"],
    }),

    // ✅ Update order status (Paid, Delivered, and productCreationStatus)
    updateOrder: builder.mutation({
      query: ({ orderId, paid, delivered, productCreationStatus }) => {
        console.log(`Making PATCH request to update Order ID: ${orderId}, paid: ${paid}, delivered: ${delivered}, productCreationStatus: ${productCreationStatus}`);
        return {
          url: `/${orderId}`,
          method: "PATCH",
          body: { paid, delivered, productCreationStatus },
          credentials: "include",
        };
      },
      invalidatesTags: ["Orders"], // Forces refetch after update
    }),

    // ✅ Delete an order
    deleteOrder: builder.mutation({
      query: (orderId) => ({
        url: `/delete/${orderId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Orders"], // ✅ Refresh list after deletion
    }),

    // ✅ Get product details by ID (new endpoint)
    getProductById: builder.query({
      query: (id) => ({
        url: `/products/${id}`, // Use the correct product API endpoint
      }),
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrderByEmailQuery,
  useGetAllOrdersQuery,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
  useGetProductByIdQuery,  // Export the new query hook
} = ordersApi;

export default ordersApi;
