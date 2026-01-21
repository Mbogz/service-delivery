import { useQuery } from "@tanstack/react-query";
import AnalyticsCard from "../components/AnalyticsCard";
import { getServiceProviders } from "../api/api-sp";
import CustomSpinner from "../components/CutomSpinner";
import { getBookings } from "../api/api-bookings";
import { getCategories } from "../api/api-categories";
import { getOrders } from "../api/api-orders";

export default function DashboardPage() {
  const { data: sp, error: FetchingSPErr } = useQuery({
    queryKey: ["serviceProviders"],
    queryFn: getServiceProviders,
  });
  if (FetchingSPErr) {
    console.error(FetchingSPErr);
  }
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
  const { data: orders, error: FetchingOrdersErr } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
  });
  if (FetchingOrdersErr) {
    console.error(FetchingOrdersErr);
  }

  if (!sp || !bookings || !categories || !orders) {
    return <CustomSpinner />;
  }
  const analyticsData = [
    {
      title: "Total Service Providers",
      value: sp.length,
    },
    {
      title: "Total Bookings",
      value: bookings.length,
    },
    {
      title: "Total Categories",
      value: categories.length,
    },
    {
      title: "Total Orders",
      value: orders.length,
    },
  ];
  return (
    <main className="flex flex-col gap-4 w-full">
      <h1 className="text-cenLoginter font-bold text-3xl">
        Helpy Admin Dashboard
      </h1>
      <div className="w-full grid grid-cols-4 gap-4">
        {analyticsData.map((data) => (
          <AnalyticsCard
            key={data.title}
            title={data.title}
            stats={data.value.toString()}
          />
        ))}
      </div>
    </main>
  );
}