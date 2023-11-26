import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";

export const Root = () => (
  <div className="flex h-full flex-col justify-stretch">
    <Navbar />
    <div className="flex-grow">
      <Outlet />
    </div>
  </div>
);
