import { useEffect, useState } from "react";
import { MapPin, Calendar, Edit } from "lucide-react";
import { dummyUserData, dummyPostsData } from "../assets/assets";
import type { Post, User } from "../assets/assets";
import { Link, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import UserProfile from "../components/UserProfile";
import PostCard from "../components/PostCard";
import { formatDistanceToNow } from "date-fns";
import EditProfile from "../components/EditProfile";

const Profile = () => {
  const { profileId } = useParams();
  const [user, setUser] = useState<User>(dummyUserData);
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<
    "posts" | "media" | "links" | "about" | "connections"
  >("posts");
  const [showEdit, setShowEdit] = useState(false);

  const fetchUser = async () => {
    setUser(dummyUserData);
    setPosts(dummyPostsData);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUser();
  }, []);

  return user ? (
    <div className="relative h-full overflow-y-scroll no-scrollbar bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl overflow-hidden shadow">
          <div className="h-40 md:h-56 bg-linear-to-r from-indigo-200 via-purple-200 to-pink-200">
            {user.cover_photo && (
              <img
                src={user.cover_photo}
                alt=""
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <UserProfile
            user={user}
            posts={posts}
            profileId={profileId}
            serShowEdit={setShowEdit}
          />
        </div>
        <div className="mt-6">
          <div className="bg-white rounded-xl shadow p-1 flex justify-center mx-auto">
            {["posts", "media"].map((tab) => (
              <button
                key={tab}
                onClick={() =>
                  setActiveTab(
                    tab as
                      | "posts"
                      | "media"
                      | "links"
                      | "about"
                      | "connections",
                  )
                }
                className={`flex-1 px-4 py-2 flex items-center gap-2 rounded-lg transition-colors cursor-pointer ${
                  activeTab === tab
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {tab === "posts" && <Edit className="w-4 h-4" />}
                {tab === "media" && <MapPin className="w-4 h-4" />}
                {tab === "links" && <Calendar className="w-4 h-4" />}
                {tab === "about" && <MapPin className="w-4 h-4" />}
                {tab === "connections" && <MapPin className="w-4 h-4" />}
                <span>{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
              </button>
            ))}
          </div>
          {activeTab === "posts" && (
            <div className="mt-4 w">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} maxWidth="full" />
              ))}
            </div>
          )}
          {activeTab === "media" && (
            <div className="mt-4 flex  items-center gap-6">
              {posts
                .filter((post) => post.image_urls.length > 0)
                .map((post) => (
                  <>
                    {post.image_urls.map((image) => (
                      <Link key={image} to={image}  target="_blank" className="relative group">
                        <img
                          key={image}
                          src={image}
                          alt=""
                          className="w-64 aspect-video object-cover"
                        />
                        <p className="absolute bottom-0 right-0 text-xs p-1 px-3 backdrop-blur-xl text-white opacity-0 group-hover:opacity-100 transition duration-300 ">
                          Posted {formatDistanceToNow(new Date(post.createdAt))}
                        </p>
                      </Link>
                    ))}
                  </>
                ))}
            </div>
          )}
          {
            activeTab === "links" && (
              <div className="mt-4 w">
                {posts.map((post) => (
                  <PostCard key={post._id} post={post} maxWidth="full" />
                ))}
              </div>
            )
          }
          {
            activeTab === "about" && (
              <div className="mt-4 w">
              <p>{user.bio}</p>
              <p>{user.location}</p>
              <p>{user.is_verified ? "Verified" : "Not Verified"}</p>
              </div>
            )
          }
          {
            activeTab === "connections" && (
              <div className="mt-4 w">
                {posts.map((post) => (
                  <PostCard key={post._id} post={post} maxWidth="full" />
                ))}
              </div>
            )
          }
        </div>
      </div>
      {
        showEdit && (
          <EditProfile setShowEdit={setShowEdit} user={user} />
        )
      }
    </div>
  ) : (
    <Loader />
  );
};

export default Profile;
