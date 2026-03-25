import { ArrowLeft, ImagePlus, Type, X } from "lucide-react";
import { useState } from "react";
import api from "../api/base";
import { useAuth } from "@clerk/react";
import toast from "react-hot-toast";


type Props = {
  setShowCreateStory: React.Dispatch<React.SetStateAction<boolean>>;
  fetchStories: () => void;
};

const CreateStory = ({ setShowCreateStory, fetchStories }: Props) => {
  const bgColor = [
    "#ff0000",
    "#00ff00",
    "#0000ff",
    "#ffff00",
    "#ff00ff",
    "#00ffff",
    "#ffffff",
    "#000000",
    "#808080",
    "#c0c0c0",
    "#808000",
    "#800000",
    "#008000",
    "#800080",
    "#008080",
  ];

  const [mode, setMode] = useState<"media" | "text">("text");
  const [background, setBackground] = useState<string>(bgColor[7]);
  const [text, setText] = useState<string>("");
  const [media, setMedia] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { getToken } = useAuth();

  const handleModeChange = (newMode: "media" | "text") => {
    setMode(newMode);

    if (newMode === "text") {
      setMedia(null);
      setPreviewUrl(null);
    } else {
      setText("");
    }
  };

  const handlerMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMedia(file);
      if (file.type.includes("video")) {
        if (file.size > 10000000) {
          toast.error("Video size should be less than 10MB");
          setMedia(null);
          setPreviewUrl(null);
        }
        const video = document.createElement("video");
        video.preload = "metadata";
        video.onloadedmetadata = () => {
          window.URL.revokeObjectURL(previewUrl!);
          if (video.duration > 60) {
            toast.error("Video duration should be less than 60 seconds");
            setMedia(null);
            setPreviewUrl(null);
          } else {
            setPreviewUrl(URL.createObjectURL(file));
          }
        };
      } else if (file.type.includes("image")) {
        if (file.size > 5000000) {
          toast.error("Image size should be less than 5MB");
          setMedia(null);
          setPreviewUrl(null);
        } else {
          setPreviewUrl(URL.createObjectURL(file));
        }
      }
    }
  };

  const removeMedia = () => {
    setMedia(null);
    setPreviewUrl(null);
  };

  const handelCreateStory = async () => {
    if (mode === "text" && !text.trim()) return;
    if (mode === "media" && !media) return;

    const formData = new FormData();

    if (mode === "text") {
      formData.append("media_type", "text");
      formData.append("background_color", background);
      formData.append("content", text);
    }

    const fileType = media?.type?.split("/")[0];

    if (mode === "media" && media) {
      formData.append("media_type", fileType === "image" ? "image" : "video");
      formData.append("media", media);
    }

    try {
      setLoading(true);

      const { data } = await api.post("/story/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${await getToken()}`,
        },
      });
      console.log(data);

      setShowCreateStory(false);
      fetchStories();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-110 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/10 border border-white/20 backdrop-blur-xl rounded-2xl shadow-2xl p-5 text-white">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={() => setShowCreateStory(false)}
            className="p-2 rounded-full hover:bg-white/10 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <h2 className="text-lg font-semibold">Create Story</h2>

          <div className="w-9 h-9" />
        </div>

        <div className="flex bg-white/10 rounded-lg p-1 mb-4">
          {["text", "media"].map((m) => (
            <button
              key={m}
              onClick={() => handleModeChange(m as "text" | "media")}
              className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-md transition ${
                mode === m
                  ? "bg-white text-black"
                  : "text-white/70 hover:bg-white/10"
              }`}
            >
              {m === "text" ? <Type size={16} /> : <ImagePlus size={16} />}
              {m}
            </button>
          ))}
        </div>

        <div
          className="h-64 rounded-xl overflow-hidden flex items-center justify-center relative"
          style={{ backgroundColor: mode === "text" ? background : "#000" }}
        >
          {mode === "text" && (
            <textarea
              className="bg-transparent text-white w-full h-full p-6 text-lg resize-none focus:outline-none placeholder:text-white/60 text-center"
              placeholder="Write something..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          )}

          {mode === "media" && (
            <>
              {!previewUrl ? (
                <label className="flex flex-col items-center gap-2 cursor-pointer text-white/70 hover:text-white transition">
                  <ImagePlus size={28} />
                  <span className="text-sm">Upload Image / Video</span>
                  <input
                    type="file"
                    hidden
                    onChange={handlerMediaUpload}
                    accept="image/*,video/*"
                  />
                </label>
              ) : (
                <>
                  {media?.type.startsWith("image") ? (
                    <img
                      src={previewUrl}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <video
                      src={previewUrl}
                      controls
                      className="w-full h-full object-contain"
                    />
                  )}

                  <button
                    onClick={removeMedia}
                    className="absolute top-2 right-2 p-1 bg-black/60 rounded-full hover:bg-black"
                  >
                    <X size={16} />
                  </button>
                </>
              )}
            </>
          )}
        </div>

        {mode === "text" && (
          <div className="flex flex-wrap mt-4 gap-2 justify-center">
            {bgColor.map((color, index) => (
              <button
                key={index}
                onClick={() => setBackground(color)}
                className={`w-8 h-8 rounded-full transition ${
                  background === color
                    ? "ring-2 ring-white scale-110"
                    : "opacity-80 hover:opacity-100"
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        )}

        <button
          onClick={handelCreateStory}
          disabled={
            loading ||
            (mode === "text" && !text.trim()) ||
            (mode === "media" && !media)
          }
          className={`w-full mt-5 py-2.5 rounded-lg font-medium transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-white text-black hover:bg-gray-200"
          }`}
        >
          {loading ? "Sharing..." : "Share Story"}
        </button>
      </div>
    </div>
  );
};

export default CreateStory;
