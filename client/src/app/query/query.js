import {QueryClient} from "@tanstack/react-query";

export const query = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    }
  }
});
