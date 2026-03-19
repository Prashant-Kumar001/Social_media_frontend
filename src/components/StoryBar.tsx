/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { dummyStoriesData } from "../assets/assets";
import { Plus } from "lucide-react";
import type { Story } from "../assets/assets";
import { formatDistanceToNow } from "date-fns";
import CreateStory from "./CreateStory";
import StoryViewer from "./StoryViewer";

const StoryBar = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [showModel, setShowModel] = useState(false);
  const [ViewStory, setViewStory] = useState<Story | null>(null);
  const [, setLoading] = useState<boolean>(false);

  const fetchFeeds = async () => {
    setLoading(true);
    setStories(dummyStoriesData);
    setLoading(false);
  };

  useEffect(() => {
    fetchFeeds();
  }, []);

  return (
    <div className="w-screen sm:w-[calc(100vw-240px)] lg:max-w-2xl no-scrollbar overflow-x-auto px-4 ">
      <div className="flex gap-4 pb-5">
        <div
          onClick={() => setShowModel(true)}
          className="rounded-lg shadow-sm min-w-30 max-w-30 max-h-40 aspect-3/4 cursor-pointer hover:shadow-lg transition-all duration-200 border-2 border-dashed border-indigo-300 bg-linear-to-b from-indigo-50 to-white  "
        >
          <div className="h-full flex flex-col items-center justify-center p-4 ">
            <div className="size-10 bg-indigo-500 rounded-full flex items-center justify-center mb-3 ">
              <Plus className="w-5 h-5 text-white " />
            </div>
            <p className="text-sm font-medium text-slate-700 text-center">
              Create Story
            </p>
          </div>
        </div>
        {stories.map((story, index) => (
          <div
            onClick={() => setViewStory(story)}
            key={index}
            className={`relative rounded-lg  shadow min-w-30 max-w-3p max-h-40 cursor-pointer hover:shadow-lg transition-all duration-200 bg-linear-to-b from-indigo-50 to-purple-600 hover:from-indigo-700 hover:to-purple-800 `}
          >
            <img
              src={story.user.profile_picture}
              alt={story.user.full_name}
              className="absolute size-8 top-3 left-3 x-10 rounded-full ring ring-gray-100 shadow "
            />
            <p className="absolute top-18 left-3 text-white/60 text-sm truncate max-w-24 ">
              {story.content}
            </p>
            <p className="text-white absolute bottom-1 right-2 z-10 text-xs ">
              {formatDistanceToNow(new Date(story.createdAt), {
                addSuffix: true,
              })}
            </p>
            {story.media_type !== "text" && (
              <div className="absolute inset-0 z-1 rounded-ld bg-black overflow-hidden  ">
                {story.media_type === "image" ? (
                  <img
                    src={story.media_url}
                    alt={story.content}
                    className="w-full h-full object-cover hover:scale-110 transition duration-300  opacity-70 hover:opacity-80 "
                  />
                ) : (
                  <video
                    src={story.media_url}
                    controls
                    className="w-full h-full object-cover hover:scale-110 transition-all duration-300 opacity-70 hover:opacity-80"
                  />
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      {showModel && (
        <CreateStory
          setShowCreateStory={setShowModel}
          fetchStories={fetchFeeds}
        />
      )}
      {ViewStory && (
        <StoryViewer viewStory={ViewStory} onClose={setViewStory} />
      )}
    </div>
  );
};

export default StoryBar;
