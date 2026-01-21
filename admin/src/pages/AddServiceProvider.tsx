import { useState } from "react";
import { FormControl, FormLabel, Input, Select } from "@chakra-ui/react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addServiceProvider } from "../api/api-sp";
import { getCategories } from "../api/api-categories";
import CustomSpinner from "../components/CutomSpinner";
import { Category } from "../definitions/types";

export default function AddServiceProvider() {
  const [email, setEmail] = useState("");
  const [skill, setSkill] = useState("");
  const [fullName, setFullName] = useState("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
  const { mutate } = useMutation({
    mutationFn: addServiceProvider,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["serviceProviders"] });
      toast.success("Service provider added successfully", {
        position: "top-center",
      });
      setEmail("");
      setSkill("");
      setFullName("");
      toast.success("Service provider added successfully");
      navigate("/app/service-providers");
    },
    onError: () => {},
  });
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (!email || !skill || !fullName) {
      return;
    }
    e.preventDefault();
    const newServiceProvider = {
      email,
      skill_id: parseInt(skill),
      full_name: fullName,
    };

    mutate(newServiceProvider);
  }
  if (!categories) {
    return <CustomSpinner />;
  }

  return (
    <main className="flex items-center justify-center w-full">
      <form onSubmit={handleSubmit} className="gap-2 flex flex-col">
        <p className="text-2xl font-bold">Add Service Provider</p>
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
          <FormLabel>Email address</FormLabel>
          <Input
            required
            type="email"
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
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
          >
            {categories?.map((category: Category) => (
              <option key={category.category_id} value={category.category_id}>
                {category.category_name}
              </option>
            ))}
          </Select>
        </FormControl>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Service provider
        </button>
      </form>
    </main>
  );
}