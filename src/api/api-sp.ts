import { NewServiceProvider, ServiceProvider } from "../definitions/types";
import supabase from "../utils/supabase";

export async function getServiceProviders() {
  const { data, error } = await supabase.from("service_provider").select("*");
  if (error) {
    throw new Error("Failed to fetch service providers");
  }
  return data;
}

export async function addServiceProvider(serviceProvider: NewServiceProvider) {
  const { data, error } = await supabase
    .from("service_provider")
    .insert([serviceProvider]);
  if (error) {
    throw new Error("Failed to add service provider");
  }
  return data;
}

export async function deleteServiceProvider(id: number) {
  const { data, error } = await supabase
    .from("service_provider")
    .delete()
    .eq("id", id);
  if (error) {
    throw new Error("Failed to delete service provider");
  }
  return data;
}

export async function updateServiceProvider(serviceProvider: ServiceProvider) {
  const { data, error } = await supabase
    .from("service_provider")
    .update(serviceProvider)
    .match({ id: serviceProvider.id });
  if (error) {
    throw new Error("Failed to update service provider");
  }
  return data;
}