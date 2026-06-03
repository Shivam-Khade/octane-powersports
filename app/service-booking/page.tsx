import { ServiceClient } from "./service-client";

export const metadata = {
  title: "Service Booking | Octane Powersports",
  description: "Book installation, fitment checks or maintenance support for your motorcycle."
};

export default function ServiceBookingPage() {
  return <ServiceClient />;
}
