import React from "react";
import type { User } from "../assets/assets";
import { Calendar, MapPin, PenBox, Verified } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const UserProfile = ({
  user,
  profileId,
  serShowEdit,
}: {
  user: User;
  profileId: string | undefined;
  serShowEdit: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div className="relative py-4 px-6 md:mx-8 bg-white">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="   absolute -top-16 rounded-full  w-28 h-28 md:w-32 md:h-32  border-4 border-white shadow-xl overflow-hidden">
          <img
            src={user.profile_picture.url}
            alt=""
            loading="lazy"
            className="rounded-full w-32 h-32  object-fill "
          />
        </div>
        <div className="w-full pt-16 md:pt-0 md:pl-36">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <div className="flex items-center gap-3 ">
                <h1 className="text-2xl font-bold text-gray-900 ">
                  {" "}
                  {user.full_name}
                </h1>
                <Verified className="w-6 h-6 text-blue-500" />
              </div>
              <p>{user.username ? `@${user.username}` : "Add a username"}</p>
            </div>
            {!profileId && (
              <button
                onClick={() => serShowEdit(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-100 transition text-sm font-medium"
              >
                <PenBox className="w-4 h-4" />
                Edit Profile
              </button>
            )}
          </div>
          <p className="text-gray-700 text-sm max-w-md mt-4 ">
            {user.bio ? user.bio : "Add a bio"}
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500 mt-4">
            <span className="flex items-center gap-1.5 ">
              <MapPin className="w-4 h-4" />{" "}
              {user.location ? user.location : "Add a location"}
            </span>
            <span className="flex items-center gap-1.5 ">
              <Calendar className="w-4 h-4" /> Joined{" "}
              <span className="font-medium">
                {" "}
                {formatDistanceToNow(new Date(user.createdAt))}{" "}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-6 mt-6 border-t border-gray-200">
            <div>
              <span className="sm:text-xl font-bold text-gray-900 ">
                {user.posts.length}
              </span>
              <span className=" text-xs sm:text-sm font-bold text-gray-500 ml-1">
                Posts
              </span>
            </div>
            <div>
              <span className="sm:text-xl font-bold text-gray-900 ">
                {user.followers.length}
              </span>
              <span className=" text-xs sm:text-sm font-bold text-gray-500 ml-1">
                Followers
              </span>
            </div>
            <div>
              <span className="sm:text-xl font-bold text-gray-900 ">
                {user.following.length}
              </span>
              <span className=" text-xs sm:text-sm font-bold text-gray-500 ml-1">
                Following
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
