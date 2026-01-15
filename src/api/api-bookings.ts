import supabase from "../utils/supabase";

export async function getBookings() {
  const { data, error } = await supabase.from("booking").select("*");
  if (error) {
    throw new Error("Failed to fetch bookings");
  }
  return data;
}

export async function updateBookingStatus({
  booking_id,
  status,
}: {
  booking_id: number;
  status: string;
}) {
  const { data, error } = await supabase
    .from("booking")
    .update({ status })
    .eq("id", booking_id);
  if (error) {
    throw new Error("Failed to update booking status");
  }
  return data;
}