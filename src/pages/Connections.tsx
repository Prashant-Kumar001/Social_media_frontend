import React, { useEffect } from "react";
import {
  Users,
  UserPlus,
  UserCheck,
  UserRoundPen,
  MessageSquare,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import type { User } from "../assets/assets";
import { useAuth } from "@clerk/react";
import { fetchConnections } from "../features/connections/connection.slice";
import toast from "react-hot-toast";
import api from "../api/base";

const Connections = () => {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const dispatch = useAppDispatch();
  const { connections, followers, following, pendingConnections } =
    useAppSelector((state) => state.Connections);
  const [currentTad, setCurrentTad] = React.useState<
    "Followers" | "Following" | "Pending" | "Connections"
  >("Followers");

  const dataArray: {
    label: "Followers" | "Following" | "Pending" | "Connections";
    value: User[];
    icon: typeof Users;
  }[] = [
    { label: "Followers", value: followers, icon: Users },
    { label: "Following", value: following, icon: UserCheck },
    { label: "Pending", value: pendingConnections, icon: UserRoundPen },
    { label: "Connections", value: connections, icon: UserPlus },
  ];

  useEffect(() => {
    getToken().then((token) => {
      if (!token) {
        navigate("/login");
      } else {
        dispatch(fetchConnections(token));
      }
    });
  }, [dispatch, getToken, navigate]);

  const handleUnfollow = async (id: string) => {
    try {
      const { data } = await api.post(
        "/user/unfollow",
        {
          userId: id,
        },
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        },
      );
      if (data?.success) {
        const token = await getToken();
        dispatch(fetchConnections(token!));
        toast.success(data.message ?? "now you unfollow this user");
      } else {
        toast.error(data.message ?? "something went wrong");
      }
    } catch (error) {
      const err = error as Error;
      toast.error(err.message ?? "something went wrong");
    }
  };

  const handleConnect = async (id: string) => {
    try {
      const { data } = await api.post(
        "/connection/accept",
        {
          id: id,
        },
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        },
      );
      if (data?.success) {
        const token = await getToken();
        dispatch(fetchConnections(token!));
        toast.success(data.message ?? "now you are connected with this user");
      } else {
        toast.error(data.message ?? "something went wrong");
      }
    } catch (error) {
      const err = error as Error;
      toast.error(err.message ?? "something went wrong");
    }
  };

  const selectedData = dataArray.find(
    (item) => item.label === currentTad,
  )?.value;

  return (
    <div className="h-screen overflow-y-scroll no-scrollbar bg-linear-to-b from-slate-50 to-white">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8 sticky top-0 bg-white">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Connections
          </h1>
          <p className="text-slate-600">
            Manage your network and discover new connections
          </p>
        </div>

        <div className="mb-8 flex flex-wrap gap-6">
          {dataArray.map((data, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center gap-1 border h-20 w-40 border-gray-200 rounded-md shadow"
            >
              <b>{data.value.length}</b>
              <p className="text-slate-600">{data.label}</p>
            </div>
          ))}
        </div>

        <div className="inline-flex flex-wrap items-end border border-gray-200 rounded-md p-1 bg-white shadow-sm">
          {dataArray.map((tab) => (
            <button
              key={tab.label}
              onClick={() => setCurrentTad(tab.label)}
              className={`flex items-center px-3 py-1 text-sm rounded-md transition ${
                currentTad === tab.label
                  ? "bg-indigo-50 text-indigo-700"
                  : "hover:bg-gray-50"
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
              <span className="ml-2 text-xs bg-gray-100 px-2 rounded-full">
                {tab.value.length}
              </span>
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-6 mt-6">
          {selectedData?.map((connection, index) => (
            <div
              key={index}
              className="w-full max-w-sm p-6 bg-white shadow rounded-md"
            >
              <img
                src={connection.profile_picture.url}
                alt=""
                className="rounded-full w-12 h-12 shadow-md  mx-auto"
              />

              <div className="flex-1">
                <p className="font-medium text-slate-700">
                  {connection.full_name}
                </p>
                <p className="text-slate-500">@{connection.username}</p>
                <p className="text-sm text-gray-600">
                  {connection.bio?.slice(0, 50)}
                </p>
              </div>

              <div className="flex gap-1.5 max:flex-col mt-4">
                <button
                  onClick={() => navigate(`/profile/${connection._id}`)}
                  className="w-full p-2 text-sm rounded bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-800 active:scale-95 transition text-white cursor-pointer "
                >
                  View Profile
                </button>
                {currentTad === "Following" && (
                  <button
                    onClick={() => handleUnfollow(connection._id)}
                    className="w-full p-2 text-sm rounded bg-slate-100 hover:bg-slate-200 active:scale-95 transition text-slate-800 cursor-pointer"
                  >
                    unfollow
                  </button>
                )}
                {currentTad === "Pending" && (
                  <button
                    onClick={() => handleConnect(connection._id)}
                    className="w-full p-2 text-sm rounded bg-slate-100 hover:bg-slate-200 active:scale-95 transition text-slate-800 cursor-pointer"
                  >
                    Accept
                  </button>
                )}
                {currentTad === "Connections" && (
                  <button
                    onClick={() => navigate(`/messages/${connection._id}`)}
                    className="w-full p-2 text-sm rounded bg-slate-100 hover:bg-slate-200 active:scale-95 transition text-slate-800 cursor-pointer flex items-center justify-center gap-1 "
                  >
                    <MessageSquare className="w-4 h-4" /> Message
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Connections;
