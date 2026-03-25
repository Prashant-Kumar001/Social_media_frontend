import { BadgeCheck, Heart, MessageCircle, Share2 } from "lucide-react";
import type { Post, User } from "../assets/assets";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks/reduxHooks";
import api from "../api/base";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/react";
import PostHeader from "./PostHeader";

const PostCard = ({
  post,
  maxWidth = "max-w-2xl",
}: {
  post: Post;
  maxWidth?: string;
}) => {
  const currentUser = useAppSelector((state) => state.user.user) as User | null;
  const [likes, setLikes] = useState(post.likes);
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const isLiked = likes.includes(currentUser?._id || "");
  const isMyPost = post.user._id === currentUser?._id;

  const handleLike = async () => {
    try {
      const response = await api.put(
        `/post/like`,
        {
          postId: post._id,
        },
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        },
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setLikes((prev: string[]) => {
          if (prev.includes(currentUser?._id || "")) {
            return prev.filter((id) => id !== currentUser?._id);
          } else {
            return [...prev, currentUser?._id as string];
          }
        });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("something went wrong");
      console.error(error);
    }
  };

  const postWithHashTags = post.content?.replace(
    /#(\w+)/g,
    (match) => `<span class="text-indigo-500">${match}</span>`,
  );

  return (
    <div
      className={`bg-white  rounded-xl  shadow p-4 space-y-4 w-full ${maxWidth}  `}
    >
      <div className="flex items-center gap-3 cursor-pointer ">
        <img
          src={post.user.profile_picture.url}
          alt=""
          className="w-10 h-10 rounded-full object-cover shadow"
        />
        <div className="flex justify-between w-full">
          <div onClick={() => navigate("/profile/" + post.user._id)}>
            <div className="flex items-center  space-x-1 ">
              <span>{post.user.full_name}</span>
              <BadgeCheck className="w-4 h-4 inline-block text-blue-500" />
            </div>
            <div className="text-gray-500 text-sm ">
              @{post.user.username} -{" "}
              {formatDistanceToNow(new Date(post.createdAt))}
            </div>
          </div>
          {isMyPost && <PostHeader isMyPost={isMyPost} />}
        </div>
      </div>
      {post.content && (
        <div
          className="text-gray-800 text-sm whitespace-pre-line"
          dangerouslySetInnerHTML={{ __html: postWithHashTags || "" }}
        />
      )}
      <div className="grid grid-cols-2 gap-2 ">
        {post.images.map((img) => (
          <img
            key={img.fileId}
            src={img.url}
            alt=""
            className={`w-full h-48 object-cover rounded-lg ${post.images.length === 1 && "col-span-2 h-auto "} `}
          />
        ))}
      </div>
      <div className="flex items-center gap-4 text-gray-400 text-sm pt-2 border-t border-gray-300 ">
        <div className="flex items-center gap-1">
          <Heart
            onClick={handleLike}
            className={`w-4 h-4 inline-block cursor-pointer ${
              isLiked ? "text-red-500   fill-red-500" : ""
            }`}
          />
          <span>{likes.length}</span>
        </div>
        <div className="flex items-center gap-1">
          <MessageCircle className="w-4 h-4" />
          <span>{12}</span>
        </div>
        <div className="flex items-center gap-1">
          <Share2 className="w-4 h-4" />
          <span>{2}</span>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
