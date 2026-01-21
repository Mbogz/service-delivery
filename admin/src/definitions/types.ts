export type SubCategory = {
  sub_category_id: number;
  sub_category_name: string;
  category_id: number;
};

export type Category = {
  category_id: number;
  category_name: string;
};

export type ServiceProvider = {
  id: number;
  full_name: string;
  email: string;
  skill_id: number;
};

export type NewServiceProvider = Omit<ServiceProvider, "id">;

export type Booking = {
  id: number;
  user_id: string;
  service_id: number;
  description: string;
  datetime: string;
  status: "pending" | "accepted" | "rejected";
};

export type Order = {
  id: number;
  sp_id: number;
  booking_id: number;
};

export type NewOrder = Omit<Order, "id">;