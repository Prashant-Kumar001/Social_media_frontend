import { BadgeCheck, Heart, MessageCircle, Share2 } from "lucide-react";
import type { Post } from "../assets/assets";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const PostCard = ({
  post,
  maxWidth = "max-w-2xl",
}: {
  post: Post;
  maxWidth?: string;
}) => {
  const [likes, setLikes] = useState(post.likes_count);
  const handleLike = async () => {};
  const navigate = useNavigate();

  const postWithHashTags = post.content?.replace(
    /#(\w+)/g,
    (match) => `<span class="text-indigo-500">${match}</span>`,
  );

  return (
    <div className={`bg-white  rounded-xl  shadow p-4 space-y-4 w-full ${maxWidth}  `}>
      <div
        onClick={() => navigate("/profile/" + post.user._id)}
        className="inline-flex items-center gap-3 cursor-pointer "
      >
        <img
          src={post.user.profile_picture}
          alt=""
          className="w-10 h-10 rounded-full shadow"
        />
        <div>
          <div className="flex items-center  space-x-1 ">
            <span>{post.user.full_name}</span>
            <BadgeCheck className="w-4 h-4 inline-block text-blue-500" />
          </div>
          <div className="text-gray-500 text-sm ">
            @{post.user.username} -{" "}
            {formatDistanceToNow(new Date(post.createdAt))}
          </div>
        </div>
      </div>
      {post.content && (
        <div
          className="text-gray-800 text-sm whitespace-pre-line"
          dangerouslySetInnerHTML={{ __html: postWithHashTags || "" }}
        />
      )}
      <div className="grid grid-cols-2 gap-2 ">
        {post.image_urls.map((url) => (
          <img
            key={url}
            src={url}
            alt=""
            className={`w-full h-48 object-cover rounded-lg ${post.image_urls.length === 1 && "col-span-2 h-auto "} `}
          />
        ))}
      </div>
      <div className="flex items-center gap-4 text-gray-400 text-sm pt-2 border-t border-gray-300 ">
        <div className="flex items-center gap-1">
          <Heart
            className={`w-4 h-4 inline-block ${likes.includes(post._id) && "text-red-500"} `}
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
