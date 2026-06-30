"use client";
import { api } from "@/lib/api";
import { useMutation, useQuery } from "@tanstack/react-query";

type apiProps = {
  key?: any[];
  endpoint?: string;
  method?: "get" | "post" | "put" | "delete";
  onSuccess?: any;
  onError?: any;
  queryOptions?: any;
  mutationOptions?: any;
  axiosOptions?: any;
  params?: any;
  headers?: any;
  enabled?: boolean;
};

export default function useClientApi({
  endpoint,
  method = "get",
  key,
  onSuccess,
  onError,
  params,
  headers,
  queryOptions,
  mutationOptions,
  axiosOptions,
  enabled = true,
}: apiProps): any {
  if (method === "get") {
    return useQuery({
      queryKey: key,
      queryFn: async () => {
        const res = await api.get(endpoint!, { params, headers });
        return res.data;
      },
      enabled,
      retry: false,
      ...queryOptions,
    });
  }

  return useMutation({
    mutationKey: key,
    mutationFn: async (variables?: { endpoint?: string; data?: any } | any) => {
      // Support:
      // - mutate({ data })
      // - mutate({ endpoint: "/api/other" })
      // - mutate({ endpoint: "/api/other", data })
      const dynamicEndpoint = variables?.endpoint || endpoint;
      const payload = variables?.data || variables;

      let res;

      if (method.toLowerCase() === "delete") {
        res = await api.delete(dynamicEndpoint, {
          data: payload,
          headers,
          ...axiosOptions,
        });
      } else {
        res = await api[method](dynamicEndpoint, payload, {
          headers,
          ...axiosOptions,
        });
      }

      return res?.data;
    },
    onSuccess,
    onError,
    ...mutationOptions,
  });
}
