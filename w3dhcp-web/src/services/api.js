import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import authHeader from './auth-header'

const API_URL = 'http://localhost:8082/api/v1/'

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers) => {
      // The authHeader returns the token string, e.g. 'xxxx'
      const token = authHeader()
      if (token) {
        headers.set('auth-token', token)
      }
      headers.set('Accept', 'application/json')
      headers.set('Content-Type', 'application/json')
      return headers
    },
  }),
  tagTypes: ['WebApp', 'IpAddress', 'Registry', 'Customer', 'Reseller', 'DomainZone', 'Domain', 'DnsZone', 'DnsRecord'],
  endpoints: (builder) => ({
    getWebApps: builder.query({
      query: (params) => ({ url: 'web_apps', params }),
      providesTags: ['WebAppLIST'],
    }),
    addWebApp: builder.mutation({
      query: (body) => ({
        url: 'web_apps',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['WebAppLIST'],
    }),
    updateWebApp: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `web_apps/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['WebAppLIST'],
    }),
    deleteWebApp: builder.mutation({
      query: (id) => ({
        url: `web_apps/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['WebAppLIST'],
    }),
    startWebApp: builder.mutation({
      query: (id) => ({
        url: `web_apps/${id}/start`,
        method: 'POST',
      }),
      invalidatesTags: ['WebAppLIST'],
    }),
    stopWebApp: builder.mutation({
      query: (id) => ({
        url: `web_apps/${id}/stop`,
        method: 'POST',
      }),
      invalidatesTags: ['WebAppLIST'],
    }),
    restartWebApp: builder.mutation({
      query: (id) => ({
        url: `web_apps/${id}/restart`,
        method: 'POST',
      }),
      invalidatesTags: ['WebAppLIST'],
    }),
    blockWebApp: builder.mutation({
      query: (id) => ({
        url: `web_apps/${id}/block`,
        method: 'POST',
      }),
      invalidatesTags: ['WebAppLIST'],
    }),
    unblockWebApp: builder.mutation({
      query: (id) => ({
        url: `web_apps/${id}/unblock`,
        method: 'POST',
      }),
      invalidatesTags: ['WebAppLIST'],
    }),
    getIpAddresses: builder.query({
      query: () => 'ip_addresses',
      providesTags: ['IpAddressLIST'],
    }),
    addIpAddress: builder.mutation({
      query: (body) => ({
        url: 'ip_addresses',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['IpAddressLIST'],
    }),
    updateIpAddress: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `ip_addresses/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['IpAddressLIST'],
    }),
    deleteIpAddress: builder.mutation({
      query: (id) => ({
        url: `ip_addresses/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['IpAddressLIST'],
    }),
    getRegistries: builder.query({
      query: () => 'registries',
      providesTags: ['RegistryLIST'],
    }),
    addRegistry: builder.mutation({
      query: (body) => ({
        url: 'registries',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['RegistryLIST'],
    }),
    updateRegistry: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `registries/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['RegistryLIST'],
    }),
    deleteRegistry: builder.mutation({
      query: (id) => ({
        url: `registries/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['RegistryLIST'],
    }),
    getCustomers: builder.query({
      query: (params) => ({ url: 'customers', params }),
      providesTags: ['CustomerLIST'],
    }),
    addCustomer: builder.mutation({
      query: (body) => ({
        url: 'customers',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['CustomerLIST'],
    }),
    updateCustomer: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `customers/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['CustomerLIST'],
    }),
    deleteCustomer: builder.mutation({
      query: (id) => ({
        url: `customers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['CustomerLIST'],
    }),
    getResellers: builder.query({
      query: () => 'resellers',
      providesTags: ['ResellerLIST'],
    }),
    addReseller: builder.mutation({
      query: (body) => ({
        url: 'resellers',
        method: 'POST',
        body: { reseller: body },
      }),
      invalidatesTags: ['ResellerLIST'],
    }),
    updateReseller: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `resellers/${id}`,
        method: 'PUT',
        body: { reseller: body },
      }),
      invalidatesTags: ['ResellerLIST'],
    }),
    deleteReseller: builder.mutation({
      query: (id) => ({
        url: `resellers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ResellerLIST'],
    }),
    getContacts: builder.query({
      query: () => 'contacts',
      providesTags: ['ContactLIST'],
    }),
    getDomainZones: builder.query({
      query: (params) => ({ url: 'domain_zones', params }),
      providesTags: ['DomainZoneLIST'],
    }),
    addDomainZone: builder.mutation({
      query: (body) => ({
        url: 'domain_zones',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['DomainZoneLIST'],
    }),
    updateDomainZone: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `domain_zones/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['DomainZoneLIST'],
    }),
    deleteDomainZone: builder.mutation({
      query: (id) => ({
        url: `domain_zones/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['DomainZoneLIST'],
    }),
    getDomains: builder.query({
      query: (params) => ({ url: 'domains', params }),
      providesTags: ['DomainLIST'],
    }),
    addDomain: builder.mutation({
      query: (body) => ({
        url: 'domains',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['DomainLIST'],
    }),
    updateDomain: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `domains/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['DomainLIST'],
    }),
    executeEppAction: builder.mutation({
      query: ({ id, action, body }) => ({
        url: `domains/${id}/${action}`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['DomainLIST'],
    }),
    getUsers: builder.query({
      query: (params) => ({ url: 'users', params }),
      providesTags: ['UserLIST'],
    }),
    addUser: builder.mutation({
      query: (body) => ({
        url: 'users',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['UserLIST'],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `users/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['UserLIST'],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['UserLIST'],
    }),
    getFtpUsers: builder.query({
      query: (params) => ({ url: 'ftp_users', params }),
      providesTags: ['FtpUserLIST'],
    }),
    addFtpUser: builder.mutation({
      query: (body) => ({
        url: 'ftp_users',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['FtpUserLIST'],
    }),
    updateFtpUser: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `ftp_users/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['FtpUserLIST'],
    }),
    deleteFtpUser: builder.mutation({
      query: (id) => ({
        url: `ftp_users/${id}`,
      }),
      invalidatesTags: ['FtpUserLIST'],
    }),
    getSubscriptionTemplates: builder.query({
      query: () => 'subscription_templates',
      providesTags: ['SubscriptionTemplateLIST'],
    }),
    addSubscriptionTemplate: builder.mutation({
      query: (body) => ({
        url: 'subscription_templates',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['SubscriptionTemplateLIST'],
    }),
    updateSubscriptionTemplate: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `subscription_templates/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['SubscriptionTemplateLIST'],
    }),
    deleteSubscriptionTemplate: builder.mutation({
      query: (id) => ({
        url: `subscription_templates/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['SubscriptionTemplateLIST'],
    }),
    getSubscriptions: builder.query({
      query: (params) => ({ url: 'subscriptions', params }),
      providesTags: ['SubscriptionLIST'],
    }),
    checkDomain: builder.mutation({
      query: (body) => ({
        url: 'domain/check',
        method: 'POST',
        body,
      }),
    }),
    getOrders: builder.query({
      query: (params) => ({ url: 'orders', params }),
      providesTags: ['OrderLIST'],
    }),
    getEvents: builder.query({
      query: (params) => ({ url: 'events', params }),
      providesTags: ['EventLIST'],
    }),
    getOrder: builder.query({
      query: (id) => `orders/${id}`,
      providesTags: (result, error, id) => [{ type: 'Order', id }],
    }),
    addOrder: builder.mutation({
      query: (body) => ({
        url: 'orders',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['OrderLIST'],
    }),
    approveOrder: builder.mutation({
      query: (id) => ({
        url: `orders/${id}/approve`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => ['OrderLIST', { type: 'Order', id }],
    }),
    deleteOrder: builder.mutation({
      query: (id) => ({
        url: `orders/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['OrderLIST'],
    }),
    getDnsZones: builder.query({
      query: (params) => ({ url: 'dns_zones', params }),
      providesTags: ['DnsZoneLIST'],
    }),
    getDnsZone: builder.query({
      query: (id) => `dns_zones/${id}`,
      providesTags: (result, error, id) => [{ type: 'DnsZone', id }],
    }),
    updateDnsZone: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `dns_zones/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['DnsZoneLIST'],
    }),
    addDnsZone: builder.mutation({
      query: (body) => ({
        url: 'dns_zones',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['DnsZoneLIST'],
    }),
    deleteDnsZone: builder.mutation({
      query: (id) => ({
        url: `dns_zones/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['DnsZoneLIST'],
    }),
    getDnsRecords: builder.query({
      query: (zoneId) => `dns_zones/${zoneId}/dns_records`,
      providesTags: (result, error, zoneId) => [{ type: 'DnsRecord', id: `LIST_${zoneId}` }],
    }),
    addDnsRecord: builder.mutation({
      query: ({ zoneId, ...body }) => ({
        url: `dns_zones/${zoneId}/dns_records`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, { zoneId }) => [{ type: 'DnsRecord', id: `LIST_${zoneId}` }],
    }),
    updateDnsRecord: builder.mutation({
      query: ({ zoneId, id, ...body }) => ({
        url: `dns_zones/${zoneId}/dns_records/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { zoneId }) => [{ type: 'DnsRecord', id: `LIST_${zoneId}` }],
    }),
    deleteDnsRecord: builder.mutation({
      query: ({ zoneId, id }) => ({
        url: `dns_zones/${zoneId}/dns_records/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { zoneId }) => [{ type: 'DnsRecord', id: `LIST_${zoneId}` }],
    }),
  }),
})

export const {
  useGetWebAppsQuery,
  useAddWebAppMutation,
  useUpdateWebAppMutation,
  useDeleteWebAppMutation,
  useStartWebAppMutation,
  useStopWebAppMutation,
  useRestartWebAppMutation,
  useBlockWebAppMutation,
  useUnblockWebAppMutation,
  useGetIpAddressesQuery,
  useAddIpAddressMutation,
  useUpdateIpAddressMutation,
  useDeleteIpAddressMutation,
  useGetRegistriesQuery,
  useAddRegistryMutation,
  useUpdateRegistryMutation,
  useDeleteRegistryMutation,
  useGetCustomersQuery,
  useAddCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
  useGetResellersQuery,
  useAddResellerMutation,
  useUpdateResellerMutation,
  useDeleteResellerMutation,
  useGetContactsQuery,
  useGetDomainZonesQuery,
  useAddDomainZoneMutation,
  useUpdateDomainZoneMutation,
  useDeleteDomainZoneMutation,
  useGetDomainsQuery,
  useAddDomainMutation,
  useUpdateDomainMutation,
  useExecuteEppActionMutation,
  useGetUsersQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetFtpUsersQuery,
  useAddFtpUserMutation,
  useUpdateFtpUserMutation,
  useDeleteFtpUserMutation,
  useGetSubscriptionTemplatesQuery,
  useAddSubscriptionTemplateMutation,
  useUpdateSubscriptionTemplateMutation,
  useDeleteSubscriptionTemplateMutation,
  useGetSubscriptionsQuery,
  useCheckDomainMutation,
  useGetOrdersQuery,
  useGetEventsQuery,
  useGetOrderQuery,
  useAddOrderMutation,
  useApproveOrderMutation,
  useDeleteOrderMutation,
  useGetDnsZonesQuery,
  useGetDnsZoneQuery,
  useAddDnsZoneMutation,
  useUpdateDnsZoneMutation,
  useDeleteDnsZoneMutation,
  useGetDnsRecordsQuery,
  useAddDnsRecordMutation,
  useUpdateDnsRecordMutation,
  useDeleteDnsRecordMutation,
} = api
