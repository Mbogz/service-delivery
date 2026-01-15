import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  Spinner,
} from "@chakra-ui/react";
import { useState } from "react";
import supabase from "../utils/supabase";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addCategory,
  deleteCategory,
  getCategories,
} from "../api/api-categories";
import CustomSpinner from "../components/CutomSpinner";

export default function CategoriesPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [categoryName, setCategoryName] = useState("");
  const queryClient = useQueryClient();
  const { data: categories, error: FetchingCategoriesErr } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
  if (FetchingCategoriesErr) {
    console.error(FetchingCategoriesErr);
  }
  const { mutate: addMutate } = useMutation({
    mutationFn: addCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category added successfully", {
        position: "top-center",
      });
      setCategoryName("");
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to add category");
    },
  });

  const { mutate: deleteMutate } = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category deleted successfully", {
        position: "top-center",
      });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to delete category");
    },
  });

  async function handleAddCategory() {
    if (!categoryName) {
      return;
    }
    const newCategory = {
      category_id: categories!.length + 1,
      category_name: categoryName,
    };
    addMutate(newCategory);
  }
  if (!categories) {
    return <CustomSpinner />;
  }
  return (
    <main className="flex flex-col gap-4 w-full">
      <div className="flex flex-row items-center justify-between w-full">
        <p className="text-center text-2xl font-bold">
          Manage your categories here
        </p>
        <button
          onClick={onOpen}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Category
        </button>
      </div>
      {isOpen && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add Category</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl>
                <FormLabel>Category Name</FormLabel>
                <Input
                  required
                  type="text"
                  placeholder="Category Name"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme="blue"
                variant={"ghost"}
                mr={3}
                onClick={onClose}
              >
                Close
              </Button>
              <Button
                variant={"solid"}
                colorScheme="blue"
                onClick={handleAddCategory}
              >
                Add Category
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
      <TableContainer className="mt-6">
        <Table variant="simple">
          <TableCaption>Service Providers</TableCaption>
          <Thead>
            <Tr>
              <Th>category name</Th>
              <Th>actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {categories?.map((category) => (
              <Tr key={category.category_id}>
                <Td>{category.category_name}</Td>
                <Td className="flex gap-2">
                  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Edit
                  </button>
                  <button
                    onClick={() => deleteMutate(category.category_id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Delete
                  </button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </main>
  );
}