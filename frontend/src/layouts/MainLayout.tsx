import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function MainLayout() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-stone-100">
      <Sidebar />
      <main className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}