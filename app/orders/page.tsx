import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import OrdersClient from "./orders-client";

export const metadata = {
  title: "Orders"
};

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  return <OrdersClient session={session} />;
}
