import { NavLink, useLocation } from "react-router-dom";
import { Calendar, Users } from "lucide-react";

const ROUTES = [
  {
    name: "Home",
    path: "/",
    icon: Calendar,
  },
  {
    name: "Clientes",
    path: "/clientes",
    icon: Users,
  },
];
export default function Sidebar() {
  const path = useLocation().pathname;
  return (
    <aside className="flex h-full w-58 min-w-58 shrink-0 flex-col overflow-y-auto border-r border-stone-300 bg-stone-200 px-4 py-5">
      <div className="mb-5 flex items-center gap-2.5 border-b border-stone-300 pb-5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-amber-800 text-lg font-semibold text-amber-50">
          H
        </div>
        <div className="">
          <p className=" font-semibold text-stone-800">Horários</p>
          <p className="text-xs uppercase text-stone-500">
            caderno de agendamentos
          </p>
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        {ROUTES.map((route) => (
          <NavLink
            key={route.name}
            to={route.path}
            className={`flex items-cneter gap-2.5 rounded-mg px-3 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-50 hover:text-stone-900", ${path === route.path && "bg-amber-800 text-white hover:bg-amber-800 hover:text-amber-800"}`}
          >
            {route.icon && <route.icon className="h-4 w-4" />}
            {route.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
