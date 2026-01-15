import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from "react";
import { ServiceProvider } from "../definitions/types";
import supabase from "../utils/supabase";

interface ServiceProvidersContextType {
  serviceProviders: ServiceProvider[] | [];
  addServiceProvider: (serviceProvider: ServiceProvider) => void;
  deleteServiceProvider: (id: number) => void;
  updateServiceProvider: (serviceProvider: ServiceProvider) => void;
  isLoading: boolean;
}

const ServiceProvidersContext =
  createContext<ServiceProvidersContextType | null>(null);

export default function ServiceProvidersContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [serviceProviders, setServiceProviders] = useState<
    ServiceProvider[] | []
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    async function fetchServiceProviders() {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("service_provider")
          .select("*");
        if (!error) {
          setServiceProviders(data);
          return;
        }
        throw new Error(`Failed to fetch  serviceProviders ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    }
    fetchServiceProviders();
  }, []);

  function addServiceProvider(serviceProvider: ServiceProvider) {
    setServiceProviders([...serviceProviders, serviceProvider]);
  }

  function deleteServiceProvider(id: number) {
    setServiceProviders(serviceProviders.filter((sp) => sp.id !== id));
  }

  function updateServiceProvider(serviceProvider: ServiceProvider) {
    setServiceProviders(
      serviceProviders.map((sp) =>
        sp.id === serviceProvider.id ? serviceProvider : sp,
      ),
    );
  }
  return (
    <ServiceProvidersContext.Provider
      value={{
        serviceProviders,
        isLoading,
        addServiceProvider,
        deleteServiceProvider,
        updateServiceProvider,
      }}
    >
      {children}
    </ServiceProvidersContext.Provider>
  );
}

export function useServiceProviders() {
  const ctx = useContext(ServiceProvidersContext);
  if (!ctx) {
    throw new Error(
      "useServiceProviders must be used within a  ServiceProviderContextProvider",
    );
  }
  return ctx;
}