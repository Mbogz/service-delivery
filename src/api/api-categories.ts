import { Category } from "../definitions/types";
import supabase from "../utils/supabase";
export async function getCategories() {
  const { data, error } = await supabase.from("category").select("*");
  if (error) {
    throw new Error("Failed to fetch categories");
  }
  return data;
}

export async function addCategory(category: Category) {
  const { data, error } = await supabase.from("category").insert([category]);
  if (error) {
    throw new Error("Failed to add category");
  }
  return data;
}

export async function deleteCategory(category_id: number) {
  const { data, error } = await supabase
    .from("category")
    .delete()
    .eq("category_id", category_id);
  if (error) {
    throw new Error("Failed to delete category");
  }
  return data;
}

export async function updateCategory(category: Category) {
  const { data, error } = await supabase
    .from("category")
    .update(category)
    .match({ category_id: category.category_id });
  if (error) {
    throw new Error("Failed to update category");
  }
  return data;
}