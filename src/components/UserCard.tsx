import { MessageCircle, PlusIcon, Loader2 } from "lucide-react";
import type { User } from "../assets/assets";
import api from "../api/base";
import { useAuth } from "@clerk/react";
import toast from "react-hot-toast";
import { useAppDispatch } from "../hooks/reduxHooks";
import { useNavigate } from "react-router-dom";
import { fetchUser } from "../features/user/user.slice";
import { useState } from "react";

type Props = {
  user: User;
  currentUser: User;
};

const UserCard = ({ user, currentUser }: Props) => {
  const { getToken } = useAuth();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleFollow = async (id: string) => {
    try {
      const { data } = await api.post(
        "/user/follow",
        { userId: id },
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        },
      );

      if (data?.success) {
        const token = await getToken();
        dispatch(fetchUser(token!));
        toast.success(data.message ?? "Followed successfully");
      } else {
        toast.error(data.message ?? "Something went wrong");
      }
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || "Something went wrong");
    }
  };

  // const handleUnfollow = async (id: string) => {
  //   try {
  //     const { data } = await api.post(
  //       "/user/unfollow",
  //       { userId: id },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${await getToken()}`,
  //         },
  //       },
  //     );

  //     if (data?.success) {
  //       const token = await getToken();
  //       if (token) {
  //         dispatch(fetchConnections(token));
  //       }
  //       toast.success("Unfollowed");
  //     } else {
  //       toast.error(data.message);
  //     }
  //   } catch (err) {
  //     const error = err as Error;
  //     toast.error(error.message || "Something went wrong");
  //   }
  // };

  const handleConnect = async (id: string) => {
    if (currentUser.connections.includes(id)) {
      return navigate(`/messages/${id}`);
    }
    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BASEURL}api/v1/connection/request`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await getToken()}`,
          },
          body: JSON.stringify({ receiverId: id }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      if (data?.success) {
        const token = await getToken();
        if (token) {
          dispatch(fetchUser(token));
        }
        toast.success(data.message ?? "connection request sent");
      }

      toast.success("connections request sent 🎉");
    } catch (error) {
      const err = error as Error;
      console.log(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md transition">
      <div className="flex flex-col items-center text-center">
        <img
          src={user.profile_picture.url}
          className="w-16 h-16 rounded-full mb-3"
        />

        <h2 className="font-semibold">{user.full_name}</h2>
        <p className="text-sm text-gray-500">@{user.username}</p>
        <p className="text-xs text-gray-600 mt-2">
          {user.bio.startsWith("write your bio here") ? "no bio" : user.bio}
        </p>
        <div className="mt-2">
          <p>
            <span className="font-semibold">Location:</span>{" "}
            {user.location ? user.location : "Not specified"}
          </p>
        </div>
      </div>

      <div className="mt-5 flex gap-2">
        <button
          disabled={currentUser?.following.includes(user._id)}
          onClick={() => handleFollow(user._id)}
          className="flex-1 py-2 rounded-lg bg-gray-200 text-sm"
        >
          {currentUser.following.includes(user._id) ? "Following" : "Follow"}
        </button>

        <button
          disabled={loading}
          onClick={() => handleConnect(user._id)}
          className="flex-1 py-2 rounded-lg bg-green-600 text-white text-sm flex items-center justify-center gap-1"
        >
          {loading && (
            <Loader2
              className="animate-spin"
              size={16}
              strokeWidth={2}
              color="white"
            />
          )}

          {currentUser.connections.includes(user._id) ? (
            <MessageCircle size={16} />
          ) : (
            <PlusIcon size={16} />
          )}
        </button>

        {/* {isPending && (
          <button className="flex-1 py-2 rounded-lg bg-yellow-100 text-yellow-700 text-sm flex items-center justify-center gap-1">
            <Clock size={16} />
            Requested
          </button>
        )} */}
      </div>
    </div>
  );
};

export default UserCard;
