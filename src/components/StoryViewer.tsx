/* eslint-disable react-hooks/set-state-in-effect */
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import type { Story } from "../assets/assets";

type Props = {
  viewStory: Story;
  onClose: React.Dispatch<React.SetStateAction<null | Story>>;
};

const StoryViewer = ({ viewStory, onClose }: Props) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!viewStory) return;

    setProgress(0);

    if (viewStory.media_type === "video") {
      setProgress(100);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          onClose(null);
          return 100;
        }
        return prev + 1.5;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [onClose, viewStory]);

  if (!viewStory) return null;

  const { user, content, media_url, media_type, background_color, createdAt } =
    viewStory;

  return (
    <div className="fixed inset-0 z-120 bg-linear-to-b from-black via-black/80 to-black flex items-center justify-center">
      <div className="relative w-full max-w-md h-[92vh] rounded-2xl overflow-hidden shadow-2xl bg-black">
        <div className="absolute top-2 left-2 right-2 flex gap-1 z-20">
          <div className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
          <div className="flex items-center gap-3 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full">
            <img
              src={user.profile_picture.url}
              alt=""
              className="w-9 h-9 rounded-full object-cover ring-2 ring-white/40"
            />
            <div className="text-white text-sm leading-tight">
              <p className="font-semibold">{user.username}</p>
              <p className="text-xs text-white/70">
                {new Date(createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>

          <button
            onClick={() => onClose(null)}
            className="p-2 rounded-full bg-black/30 backdrop-blur-md hover:bg-white/20 transition"
          >
            <X className="text-white w-5 h-5" />
          </button>
        </div>

        <div className="w-full h-full flex items-center justify-center">
          {media_type === "text" && (
            <div
              className="w-full h-full flex items-center justify-center p-8 text-center"
              style={{ background: background_color }}
            >
              <p className="text-white text-2xl font-semibold leading-relaxed tracking-wide drop-shadow-lg">
                {content}
              </p>
            </div>
          )}

          {media_type === "image" && (
            <img
              src={media_url.url}
              alt=""
              className="w-full h-full object-cover"
            />
          )}

          {media_type === "video" && (
            <video
              src={media_url.url}
              autoPlay
              muted
              playsInline
              onEnded={() => onClose(null)}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-black/70 to-transparent pointer-events-none" />
      </div>
    </div>
  );
};

export default StoryViewer;
