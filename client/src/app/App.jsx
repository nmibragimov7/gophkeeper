import {RouterProvider} from "react-router-dom";
import {Toaster} from "react-hot-toast";
import {QueryClientProvider} from "@tanstack/react-query";

import {router} from "@/app/router/router.jsx";
import {query} from "@/app/query/query.js";

function App() {
  return (
    <>
      <QueryClientProvider client={query}>
        <RouterProvider router={router}/>
      </QueryClientProvider>
      <Toaster
        position={"top-center"}
        gutter={12}
        toastOptions={{
          duration: 5000,
          style: {
            maxWidth: "640px",
          }
        }}
      />
    </>
  );
}

export default App
