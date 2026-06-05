import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import SignOutButton from "../account/SignOutButton";
import "./admin.css";

export const metadata = {
  title: "Admin Dashboard - Octane"
};

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/account");
  }

  if (session.user?.role !== "admin") {
    return (
      <main className="admin-page">
        <section className="container" style={{ padding: "100px 20px", textAlign: "center" }}>
          <h1>Access Denied</h1>
          <p>You do not have permission to view this page.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <section className="container" style={{ padding: "60px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
          <h1>Admin Dashboard</h1>
          <SignOutButton />
        </div>
        
        <div className="admin-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
          <div className="admin-card" style={{ padding: "24px", background: "#f8f9fa", borderRadius: "12px", border: "1px solid #e9ecef", color: "black" }}>
            <h2>Users Management</h2>
            <p>View and manage registered users.</p>
            <button className="button" style={{ marginTop: "15px" }}>View Users</button>
          </div>
          
          <div className="admin-card" style={{ padding: "24px", background: "#f8f9fa", borderRadius: "12px", border: "1px solid #e9ecef", color: "black" }}>
            <h2>Products Management</h2>
            <p>Add, edit, or remove store products.</p>
            <button className="button" style={{ marginTop: "15px" }}>View Products</button>
          </div>

          <div className="admin-card" style={{ padding: "24px", background: "#f8f9fa", borderRadius: "12px", border: "1px solid #e9ecef", color: "black" }}>
            <h2>Orders</h2>
            <p>Manage customer orders and shipments.</p>
            <button className="button" style={{ marginTop: "15px" }}>View Orders</button>
          </div>
        </div>
      </section>
    </main>
  );
}
