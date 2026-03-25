import { Link, useNavigate } from "react-router-dom";
import { assets, type User } from "../assets/assets";
import MenuItems from "./MenuItems";
import { CirclePlus, LogOut } from "lucide-react";
import { useClerk, UserButton } from "@clerk/react";
import { useAppSelector } from "../hooks/reduxHooks";

type SideBarProps = {
  openSideBar: boolean;
  setSideBar: (value: boolean) => void;
};

const SideBar = ({ openSideBar, setSideBar }: SideBarProps) => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.user.user) as User | null;
  const { signOut } = useClerk();
  return (
    <div
      className={`w-60 h-full  xl:w-72 bg-white border-e border-gray-200 flex flex-col justify-between items-center max-sm:absolute top-0 border-0 z-20
        transition-all duration-300 ease-in-out
      ${openSideBar ? "translate-x-0" : "-translate-x-full"}
      sm:translate-x-0`}
    >
      <div className="w-full">
        <img
          onClick={() => navigate("/")}
          src={assets.logo}
          alt=""
          className="w-26 ml-7  my-2 "
        />
        <hr className="border-gray-300 mb-8 " />
        <MenuItems setSideBar={setSideBar} />
        <Link
          to={"/create-post"}
          className="flex items-center justify-center gap-2 py-2.5 mt-6 mx-6 rounded-lg bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-800 active:scale-95 transition text-white cursor-pointer "
        >
          <CirclePlus className="w-5 h-5" />
          Create Post
        </Link>
      </div>
      <div className="w-full border-t border-gray-200 py-2  px-2 flex items-center justify-between  ">
        <div className="flex gap-2 items-center cursor-pointer ">
          <UserButton />
          <div>
            <h1 className="text-sm font-medium">{user?.full_name}</h1>
            <p className="text-sm text-gray-700 ">@{user?.username}</p>
          </div>
        </div>
        <LogOut
          onClick={() => signOut()}
          className="w-6  text-gray-400 hover:text-gray-700 transition cursor-pointer  "
        />
      </div>
    </div>
  );
};

export default SideBar;
