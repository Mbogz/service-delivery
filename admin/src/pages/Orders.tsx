import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import CustomSpinner from "../components/CutomSpinner";
import { Order, ServiceProvider } from "../definitions/types";
import { getOrders } from "../api/api-orders";
import { getServiceProviders } from "../api/api-sp";

export default function OrderPage() {
  const { data: orders, error: FetchingOrdersErr } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
  });
  if (FetchingOrdersErr) {
    console.error(FetchingOrdersErr);
  }
  const { data: serviceProviders, error: FetchingSPErr } = useQuery({
    queryKey: ["serviceProviders"],
    queryFn: getServiceProviders,
  });
  if (FetchingSPErr) {
    console.error(FetchingSPErr);
  }

  if (!orders || !serviceProviders) {
    return <CustomSpinner />;
  }
  return (
    <main className="flex flex-col gap-4 w-full">
      <div className="flex flex-row items-center justify-between w-full">
        <p className="text-center text-2xl font-bold">Manage orders here</p>
      </div>
      <TableContainer className="mt-6">
        <Table variant="simple">
          <TableCaption>Orders</TableCaption>
          <Thead>
            <Tr>
              <Th>booking id</Th>
              <Th>service provider</Th>
              <Th>actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {orders?.map((order: Order) => (
              <Tr key={order.id}>
                <Td>{order.booking_id}</Td>
                <Td>
                  {
                    serviceProviders.find(
                      (s: ServiceProvider) => s.id === order.sp_id,
                    ).email
                  }
                </Td>
                <Td>
                  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Edit
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