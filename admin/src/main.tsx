import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import App from "./App.tsx";
import "./index.css";
import SessionContextProvider from "./providers/useSession.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
  <ChakraProvider>
    <SessionContextProvider>
      <App />
    </SessionContextProvider>
  </ChakraProvider>
  </React.StrictMode>,
);