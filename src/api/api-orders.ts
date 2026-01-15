import { NewOrder } from "../definitions/types";
import supabase from "../utils/supabase";
export async function getOrders() {
  const { data, error } = await supabase.from("order").select("*");
  if (error) {
    throw new Error("Failed to fetch orders");
  }
  return data;
}

export async function addOrder(order: NewOrder) {
  const { data, error } = await supabase.from("order").insert([order]);
  if (error) {
    throw new Error("Failed to add order");
  }
  return data;
}