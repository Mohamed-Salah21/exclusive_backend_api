export interface OrderI {
  cartItems: {
    product: string;
    count: string;
    price: string | number;
  }[];
  totalCartPrice: number;
  customer: any;
  isPaid: boolean;
  status: "pending" | "approved" | "rejected";
  isDelivered: Boolean;
  deliveredAt: Date;
}
