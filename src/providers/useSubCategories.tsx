import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from "react";
import { SubCategory } from "../definitions/types";
import supabase from "../utils/supabase";

interface SubCategoriesContextType {
  subCategories: SubCategory[] | null;
  isLoading: boolean;
}

const SubCategoriesContext = createContext<SubCategoriesContextType | null>(
  null,
);

export default function SubCategoriesContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [subCategories, setSubCategories] = useState<SubCategory[] | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    async function fetchSubCategories() {
      try {
        setIsLoading(true);
        const { data, error } = await supabase.from("sub_category").select("*");
        if (!error) {
          setSubCategories(data);
          return;
        }
        throw new Error(`Failed to fetch sub categories ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSubCategories();
  }, []);

  return (
    <SubCategoriesContext.Provider value={{ subCategories, isLoading }}>
      {children}
    </SubCategoriesContext.Provider>
  );
}

export function useSubCategories() {
  const ctx = useContext(SubCategoriesContext);
  if (!ctx) {
    throw new Error(
      "useSubCategories must be used within a SubCategoriesContextProvider",
    );
  }
  return ctx;
}