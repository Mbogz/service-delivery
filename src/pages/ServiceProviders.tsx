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
  Select,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import supabase from "../utils/supabase";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteServiceProvider,
  getServiceProviders,
  updateServiceProvider,
} from "../api/api-sp";
import CustomSpinner from "../components/CutomSpinner";
import { Category, ServiceProvider } from "../definitions/types";
import { getCategories } from "../api/api-categories";

export default function ServiceProvidersPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const [serviceProviderId, setServiceProviderId] = useState(0);
  const [email, setEmail] = useState("");
  const [skill, setSkill] = useState("");
  const [fullName, setFullName] = useState("");
  const queryClient = useQueryClient();
  const { data: serviceProviders, error } = useQuery({
    queryKey: ["serviceProviders"],
    queryFn: getServiceProviders,
  });
  if (error) {
    console.error(error);
  }
  const { data: categories, error: FetchingCategoriesErr } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
  if (FetchingCategoriesErr) {
    console.error(FetchingCategoriesErr);
  }
  const { mutate: updateSPMutate } = useMutation({
    mutationFn: updateServiceProvider,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["serviceProviders"] });
      toast.success("Service provider updated successfully", {
        position: "top-center",
      });
      setEmail("");
      setSkill("");
      setFullName("");
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to update service provider");
    },
  });
  const { mutate: deleteSPMutate } = useMutation({
    mutationFn: deleteServiceProvider,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["serviceProviders"] });
      toast.success("Service provider deleted successfully", {
        position: "top-center",
      });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to delete service provider");
    },
  });

  useEffect(() => {
    const serviceProvider = serviceProviders?.find(
      (sp: ServiceProvider) => sp.id === serviceProviderId,
    );
    if (serviceProvider) {
      setEmail(serviceProvider.email);
      setSkill(serviceProvider.skill_id.toString());
      setFullName(serviceProvider.full_name);
    }
  }, [serviceProviderId, serviceProviders]);

  async function handleUpdate(id: number) {
    if (!email || !skill || !fullName) {
      return;
    }
    const serviceProvider = {
      email,
      skill_id: parseInt(skill),
      full_name: fullName,
      id,
    };
    updateSPMutate(serviceProvider);
  }

  if (!serviceProviders || !categories) {
    return <CustomSpinner />;
  }
  return (
    <main className="flex flex-col gap-4 w-full">
      <div className="flex flex-row items-center justify-between w-full">
        <p className="text-center text-2xl font-bold">
          Manage your service providers here
        </p>
        <button
          onClick={() => navigate("/app/service-providers/add")}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Service provider
        </button>
      </div>
      <TableContainer className="mt-6">
        <Table variant="simple">
          <TableCaption>Service Providers</TableCaption>
          <Thead>
            <Tr>
              <Th>full name</Th>
              <Th>email</Th>
              <Th>skill</Th>
              <Th>actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {serviceProviders?.map((serviceProvider) => (
              <Tr>
                {isOpen && (
                  <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                      <ModalHeader>Edit Service Provider</ModalHeader>
                      <ModalCloseButton />
                      <ModalBody className="flex flex-col gap-4">
                        <FormControl>
                          <FormLabel>Full Name</FormLabel>
                          <Input
                            required
                            type="text"
                            placeholder="Full Name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel>Email</FormLabel>
                          <Input
                            required
                            type="text"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel>Skill</FormLabel>
                          <Select
                            required
                            placeholder="Select skill"
                            value={skill || ""}
                            onChange={(e) => setSkill(e.target.value)}
                          >
                            {categories?.map((category: Category) => (
                              <option
                                key={category.category_id}
                                value={category.category_id}
                              >
                                {category.category_name}
                              </option>
                            ))}
                          </Select>
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
                          onClick={() => handleUpdate(serviceProvider.id)}
                        >
                          Edit Service Provider
                        </Button>
                      </ModalFooter>
                    </ModalContent>
                  </Modal>
                )}
                <Td>{serviceProvider.full_name}</Td>
                <Td>{serviceProvider.email}</Td>
                <Td>
                  {
                    categories.find(
                      (c: Category) =>
                        c.category_id === serviceProvider.skill_id,
                    )?.category_name
                  }
                </Td>
                <Td className="flex gap-4">
                  <button
                    onClick={() => {
                      onOpen();
                      setServiceProviderId(serviceProvider.id);
                    }}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteSPMutate(serviceProvider.id)}
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