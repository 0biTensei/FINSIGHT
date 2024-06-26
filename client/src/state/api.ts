import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  GetKpisResponse,
  GetProductsResponse,
  GetTransactionsResponse,
  GetUsersResponse,
} from './types';

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BASE_URL }),
  reducerPath: 'main',
  tagTypes: ['Kpis', 'Products', 'Transactions', 'Users', 'Uploads'],
  endpoints: (build) => ({
    getKpis: build.query<Array<GetKpisResponse>, void>({
      query: () => 'kpi/kpis/',
      providesTags: ['Kpis'],
    }),
    createKpi: build.mutation<void, Partial<GetKpisResponse>>({
      query: (body) => ({
        url: 'kpi/kpis/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Kpis'],
    }),
    updateKpi: build.mutation<void, Partial<GetKpisResponse>>({
      query: ({ id, ...patch }) => ({
        url: `kpi/kpis/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: ['Kpis'],
    }),
    deleteKpi: build.mutation<void, string>({
      query: (id) => ({
        url: `kpi/kpis/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Kpis'],
    }),
    getProducts: build.query<Array<GetProductsResponse>, void>({
      query: () => 'product/products/',
      providesTags: ['Products'],
    }),
    createProduct: build.mutation<void, Partial<GetProductsResponse>>({
      query: (body) => ({
        url: 'product/products/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Products'],
    }),
    updateProduct: build.mutation<void, Partial<GetProductsResponse>>({
      query: ({ _id, ...patch }) => ({
        url: `product/products/${_id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: ['Products'],
    }),
    deleteProduct: build.mutation<void, string>({
      query: (id) => ({
        url: `product/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Products'],
    }),
    getTransactions: build.query<Array<GetTransactionsResponse>, void>({
      query: () => 'transaction/transactions/',
      providesTags: ['Transactions'],
    }),
    createTransaction: build.mutation<void, Partial<GetTransactionsResponse>>({
      query: (body) => ({
        url: 'transaction/transactions/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Transactions'],
    }),
    updateTransaction: build.mutation<void, Partial<GetTransactionsResponse>>({
      query: ({ id, ...patch }) => ({
        url: `transaction/transactions/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: ['Transactions'],
    }),
    deleteTransaction: build.mutation<void, string>({
      query: (id) => ({
        url: `transaction/transactions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Transactions'],
    }),
    getUsers: build.query<Array<GetUsersResponse>, void>({
      query: () => 'user/users/',
      providesTags: ['Users'],
    }),
    createUser: build.mutation<void, Partial<GetUsersResponse>>({
      query: (body) => ({
        url: 'user/users/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Users'],
    }),
    updateUser: build.mutation<void, Partial<GetUsersResponse>>({
      query: ({ _id, ...patch }) => ({
        url: `user/users/${_id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: ['Users'],
    }),
    deleteUser: build.mutation<void, string>({
      query: (id) => ({
        url: `user/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Users'],
    }),
    uploadFile: build.mutation<void, File>({
      query: (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        return {
          url: 'upload',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['Uploads'],
    }),
  }),
});

export const {
  useGetKpisQuery,
  useCreateKpiMutation,
  useUpdateKpiMutation,
  useDeleteKpiMutation,
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetTransactionsQuery,
  useCreateTransactionMutation,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useUploadFileMutation,
} = api;
