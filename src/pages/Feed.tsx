/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { assets, dummyPostsData } from "../assets/assets";
import type { Post } from "../assets/assets";
import Loader from "../components/Loader";
import StoryBar from "../components/StoryBar";
import PostCard from "../components/PostCard";
import ResentMessages from "../components/ResentMessages";

const Feed = () => {
  const [feeds, setFeeds] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchFeeds = async () => {
    setLoading(true);
    setFeeds(dummyPostsData);
    setLoading(false);
  };

  useEffect(() => {
    fetchFeeds();
  }, []);

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <div className="h-screen overflow-y-scroll no-scrollbar py-10 xl:pr-5 flex items-start justify-center xl:gap-8 ">
          <div>
            <StoryBar />
            <div className="p-4 space-y-6 ">
              {feeds.map((post, index) => (
                <PostCard key={post._id || index} post={post} />
              ))}
            </div>
          </div>
          <div className="max-xl:hidden sticky  top-0">
            <div className="max-w-xs bg-white text-xs p-4 rounded-md inline-flex flex-col gap-2 shadow  ">
              <h3 className="text-slate-800 font-semibold">Sponsored</h3>
              <img
                src={assets.sponsored_img}
                alt=""
                className="w-75 h-50 rounded-md"
              />
              <p className="text-slate-600">Email marketing</p>
              <p className="text-slate-400">
                Supercharge your marketing with a powerful. easy-to-use platform
                build for results.
              </p>
            </div>
            <ResentMessages />
          </div>
        </div>
      )}
    </div>
  );
};

export default Feed;
