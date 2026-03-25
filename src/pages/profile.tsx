/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useState } from "react";
import { MapPin, Image } from "lucide-react";
import type { Post, User } from "../assets/assets";
import { Link, useParams } from "react-router-dom";
import UserProfile from "../components/UserProfile";
import PostCard from "../components/PostCard";
import { formatDistanceToNow } from "date-fns";
import EditProfile from "../components/EditProfile";
import { useAuth } from "@clerk/react";
import api from "../api/base";
import toast from "react-hot-toast";
import { useAppSelector } from "../hooks/reduxHooks";
import ProfileSkeleton from "../components/ProfileSkeleton";

const Profile = () => {
  const currentUser = useAppSelector((state) => state.user.user) as User | null;
  const { profileId } = useParams();

  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<"posts" | "media">("posts");
  const [showEdit, setShowEdit] = useState(false);

  const { getToken } = useAuth();

  const targetUserId = profileId || currentUser?._id;

  const fetchUser = useCallback(
    async (signal?: AbortSignal) => {
      if (!targetUserId) return;

      try {
        const token = await getToken();

        const { data } = await api.get(`user/account/${targetUserId}`, {
          signal,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (data?.success) {
          setUser(data.user);
          setPosts(data.posts || []);
        } else {
          toast.error("Failed to load profile");
        }
      } catch (error: any) {
        if (error.name !== "CanceledError") {
          toast.error(error?.response?.data?.message || error.message);
        }
      }
    },
    [getToken, targetUserId],
  );

  useEffect(() => {
    const controller = new AbortController();

    if (targetUserId) {
      fetchUser(controller.signal);
    }

    return () => controller.abort();
  }, [fetchUser, targetUserId]);

  if (!user) return <ProfileSkeleton />;

  return (
    <div className="h-screen overflow-x-scroll no-scrollbar bg-gray-50 py-6 px-4">
      
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl overflow-hidden shadow">
          <div className="h-40 md:h-56 bg-linear-to-r from-indigo-200 via-purple-200 to-pink-200">
            {user?.cover_photo?.url && (
              <img
                src={user.cover_photo.url}
                alt="cover"
                className="w-full h-full object-cover"
              />
            )}
          </div>

          <UserProfile
            user={user}
            profileId={profileId}
            serShowEdit={setShowEdit}
          />
        </div>

        {/* TABS (Instagram style) */}
        <div className="border-b border-gray-200 flex justify-around text-sm font-medium">
          {["posts", "media"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as "posts" | "media")}
              className={`flex items-center gap-2 py-3 border-b-2 transition ${
                activeTab === tab
                  ? "border-black text-black"
                  : "border-transparent text-gray-400 hover:text-gray-700"
              }`}
            >
              {tab === "posts" && <MapPin className="w-4 h-4" />}
              {tab === "media" && <Image className="w-4 h-4" />}
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {/* POSTS */}
        {activeTab === "posts" && (
          <div className="space-y-4">
            {posts.length === 0 ? (
              <p className="text-center text-gray-400">No posts yet 📭</p>
            ) : (
              posts.map((post) => (
                <PostCard key={post._id} post={post} maxWidth="full" />
              ))
            )}
          </div>
        )}

        {/* MEDIA GRID */}
        {activeTab === "media" && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {posts
              .filter((post) => post.images?.length > 0)
              .flatMap((post) =>
                post.images.map((image) => (
                  <Link
                    key={image.fileId}
                    to={image.url}
                    target="_blank"
                    className="relative group"
                  >
                    <img
                      src={image.url}
                      alt="media"
                      className="w-full aspect-square object-cover rounded-lg"
                    />

                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-end justify-end p-2">
                      <p className="text-xs text-white">
                        {formatDistanceToNow(new Date(post.createdAt))}
                      </p>
                    </div>
                  </Link>
                )),
              )}

            {posts.filter((p) => p.images?.length > 0).length === 0 && (
              <p className="col-span-full text-center text-gray-400">
                No media found 🖼️
              </p>
            )}
          </div>
        )}
      </div>

      {showEdit && <EditProfile setShowEdit={setShowEdit} user={user} />}
    </div>
  );
};

export default Profile;
