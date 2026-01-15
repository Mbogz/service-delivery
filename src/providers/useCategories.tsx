import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from "react";
import { Category } from "../definitions/types";
import supabase from "../utils/supabase";

interface CategoriesContextType {
  categories: Category[] | null;
  isLoading: boolean;
}

const CategoriesContext = createContext<CategoriesContextType | null>(null);

export default function CategoriesContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    async function fetchCategories() {
      try {
        setIsLoading(true);
        const { data, error } = await supabase.from("category").select("*");
        if (!error) {
          setCategories(data);
          return;
        }
        throw new Error(`Failed to fetch  categories ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCategories();
  }, []);

  return (
    <CategoriesContext.Provider value={{ categories, isLoading }}>
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategories() {
  const ctx = useContext(CategoriesContext);
  if (!ctx) {
    throw new Error(
      "useCategories must be used within a  CategoriesContextProvider",
    );
  }
  return ctx;
}