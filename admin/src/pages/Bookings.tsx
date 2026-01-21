import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getBookings, updateBookingStatus } from "../api/api-bookings";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useDisclosure,
  TableCaption,
  TableContainer,
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
  Select,
} from "@chakra-ui/react";
import CustomSpinner from "../components/CutomSpinner";
import { Booking, Category, ServiceProvider } from "../definitions/types";
import toast from "react-hot-toast";
import { getCategories } from "../api/api-categories";
import { getServiceProviders } from "../api/api-sp";
import { useState } from "react";
import { addOrder } from "../api/api-orders";

export default function Bookings() {
  const [serviceProviderId, setServiceProviderId] = useState(0);
  const queryClient = useQueryClient();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: bookings, error: FetchBookingsError } = useQuery({
    queryKey: ["bookings"],
    queryFn: getBookings,
  });
  if (FetchBookingsError) {
    console.error(FetchBookingsError);
  }
  const { data: categories, error: FetchingCategoriesErr } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
  if (FetchingCategoriesErr) {
    console.error(FetchingCategoriesErr);
  }
  const { data: sp, error: FetchingSPErr } = useQuery({
    queryKey: ["serviceProviders"],
    queryFn: getServiceProviders,
  });
  if (FetchingSPErr) {
    console.error(FetchingSPErr);
  }

  const { mutate: addOrderMutate } = useMutation({
    mutationFn: addOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order added successfully", {
        position: "top-center",
      });
    },
    onError: (err) => {
      console.error(err);
      toast.error("Failed to add order");
    },
  });

  const { mutate: updateBSMutate } = useMutation({
    mutationFn: updateBookingStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success("Booking status updated successfully", {
        position: "top-center",
      });
    },
    onError: (err) => {
      console.error(err);
      toast.error("Failed to update booking status");
    },
  });

  if (!bookings || !categories || !sp) {
    return <CustomSpinner />;
  }

  function handleUpdateBookingStatus(booking_id: number, status: string) {
    updateBSMutate({ booking_id, status });
  }

  function handleAddOrder(bookingId: number) {
    if (!serviceProviderId) {
      return;
    }
    const newOrder = {
      booking_id: bookingId,
      sp_id: serviceProviderId,
    };
    addOrderMutate(newOrder);
  }
  if (!categories) {
    return <CustomSpinner />;
  }
  return (
    <main className="flex flex-col gap-4 w-full">
      <div className="flex flex-row items-center justify-between w-full">
        <p className="text-center text-2xl font-bold">Manage bookings here</p>
      </div>
      <TableContainer className="mt-6">
        <Table variant="simple" size={"sm"}>
          <TableCaption>Bookings</TableCaption>
          <Thead>
            <Tr>
              <Th>user id</Th>
              <Th>service</Th>
              <Th>description</Th>
              <Th>date</Th>
              <Th>status</Th>
              <Th>actions</Th>
              <Th>make order</Th>
            </Tr>
          </Thead>
          <Tbody>
            {bookings?.map((booking: Booking) => (
              <Tr key={booking.id}>
                {isOpen && (
                  <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                      <ModalHeader>Add Order</ModalHeader>
                      <ModalCloseButton />
                      <ModalBody>
                        <FormControl>
                          <FormLabel>Select Service Provider</FormLabel>
                          <Select
                            required
                            placeholder="Select Service Provider"
                            value={serviceProviderId}
                            onChange={(e) =>
                              setServiceProviderId(parseInt(e.target.value))
                            }
                          >
                            {sp
                              ?.filter(
                                (s: ServiceProvider) =>
                                  s.skill_id === booking.service_id,
                              )
                              ?.map((serviceProvider: ServiceProvider) => (
                                <option
                                  key={serviceProvider.id}
                                  value={serviceProvider.id}
                                >
                                  {serviceProvider.email}
                                </option>
                              ))}
                          </Select>
                        </FormControl>
                      </ModalBody>

                      <ModalFooter>
                        <Button
                          colorScheme="red"
                          variant={"ghost"}
                          mr={3}
                          onClick={onClose}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant={"solid"}
                          colorScheme="blue"
                          onClick={() => handleAddOrder(booking.id)}
                        >
                          Add Order
                        </Button>
                      </ModalFooter>
                    </ModalContent>
                  </Modal>
                )}
                <Td>{`${booking.user_id.slice(0, 5)}...`}</Td>
                <Td>
                  {
                    categories.find(
                      (c: Category) => c.category_id === booking.service_id,
                    ).category_name
                  }
                </Td>
                <Td>{booking.description}</Td>
                <Td>{new Date(booking.datetime).toDateString()}</Td>
                <Td>{booking.status}</Td>
                <Td className="flex gap-2">
                  {booking.status === "pending" ? (
                    <>
                      <button
                        onClick={() =>
                          handleUpdateBookingStatus(booking.id, "rejected")
                        }
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() =>
                          handleUpdateBookingStatus(booking.id, "accepted")
                        }
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Accept
                      </button>
                    </>
                  ) : (
                    <span className="font-bold py-3">
                      Booking already acted upon
                    </span>
                  )}
                </Td>
                <Td>
                  {booking.status === "accepted" ? (
                    <button
                      onClick={onOpen}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Make Order
                    </button>
                  ) : (
                    <span className="font-bold">Operation not available</span>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </main>
  );
}