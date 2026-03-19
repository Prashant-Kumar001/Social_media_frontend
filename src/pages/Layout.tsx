import { Outlet } from "react-router-dom";
import SideBar from "../components/SideBar";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { dummyUserData } from "../assets/assets";
import Loader from "../components/Loader";

const Layout = () => {
  const user = dummyUserData;
  const [openSideBar, setSideBar] = useState(false);

  return user ? (
    <div className="w-full flex h-screen">
      <SideBar openSideBar={openSideBar} setSideBar={setSideBar} />
      <div className="flex-1 bg-slate-50">
        <Outlet />
      </div>
      {openSideBar ? (
        <X
          onClick={() => setSideBar(false)}
          className="absolute top-3 right-3 p-2 z-50 bg-white rounded-md shadow w-10 h-10 text-gray-600 sm:hidden cursor-pointer"
        />
      ) : (
        <Menu
          onClick={() => setSideBar(true)}
          className="absolute top-3 right-3 p-2 z-50 bg-white rounded-md shadow w-10 h-10 text-gray-600 sm:hidden cursor-pointer"
        />
      )}
    </div>
  ) : (
    <Loader />
  );
};

export default Layout;
