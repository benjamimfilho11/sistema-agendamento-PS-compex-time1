import { Outlet } from "react-router-dom";
import Sidebar from "../components/ui/Sidebar";

export default function MainLayout() {
  return (
    <div className="flex h-screen">
      <Sidebar />

      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
