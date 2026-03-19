import { UserPlus, UserCheck, Clock } from "lucide-react";
import type { User } from "../assets/assets";

type Props = {
  user: User;
  currentUser: User;
  onFollow: (id: string) => void;
  onUnfollow: (id: string) => void;
  onConnect: (id: string) => void;
  pending: string[];
};

const UserCard = ({
  user,
  currentUser,
  onFollow,
  onUnfollow,
  onConnect,
  pending,
}: Props) => {
  const isFollowing = currentUser.following.includes(user._id);
  const isConnected = currentUser.connections.includes(user._id);
  const isPending = pending.includes(user._id);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md transition">
      <div className="flex flex-col items-center text-center">
        <img
          src={user.profile_picture}
          className="w-16 h-16 rounded-full mb-3"
        />

        <h2 className="font-semibold">{user.full_name}</h2>
        <p className="text-sm text-gray-500">@{user.username}</p>
        <p className="text-xs text-gray-600 mt-2">{user.bio?.slice(0, 50)}</p>
        <div className="mt-2">
          <p>
            <span className="font-semibold">Location:</span> {user.location}
            
          </p>
        </div>
      </div>

      <div className="mt-5 flex gap-2">
        {isFollowing ? (
          <button
            onClick={() => onUnfollow(user._id)}
            className="flex-1 py-2 rounded-lg bg-gray-200 text-sm"
          >
            Unfollow
          </button>
        ) : (
          <button
            onClick={() => onFollow(user._id)}
            className="flex-1 py-2 rounded-lg bg-indigo-600 text-white text-sm"
          >
            Follow
          </button>
        )}

        {!isConnected && !isPending && (
          <button
            onClick={() => onConnect(user._id)}
            className="flex-1 py-2 rounded-lg bg-green-600 text-white text-sm flex items-center justify-center gap-1"
          >
            <UserPlus size={16} />
            Connect
          </button>
        )}

        {isPending && (
          <button className="flex-1 py-2 rounded-lg bg-yellow-100 text-yellow-700 text-sm flex items-center justify-center gap-1">
            <Clock size={16} />
            Requested
          </button>
        )}

        {isConnected && (
          <button className="flex-1 py-2 rounded-lg bg-green-100 text-green-700 text-sm flex items-center justify-center gap-1">
            <UserCheck size={16} />
            Connected
          </button>
        )}
      </div>
    </div>
  );
};

export default UserCard;
