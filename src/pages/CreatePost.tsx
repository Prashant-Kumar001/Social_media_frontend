import { useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { dummyUserData } from "../assets/assets";

const CreatePost = () => {
  const [content, setContent] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const user = dummyUserData;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages = Array.from(files).map((file) =>
      URL.createObjectURL(file),
    );

    setImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!content && images.length === 0) return;

    setLoading(true);

    const newPost = {
      content,
      image_urls: images,
      post_type: "post",
    };

    console.log("POST DATA 👉", newPost);

    setContent("");
    setImages([]);
    setLoading(false);
  };

  return (
    <div className="h-screen overflow-y-scroll no-scrollbar bg-linear-to-b from-slate-50 to-white">
      <div className="max-w-2xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Create Post
          </h1>
          <p className="text-slate-600">Share your thoughts with the world</p>
        </div>
        <div className="bg-white rounded-2xl shadow border p-5">
          <div className="flex items-center gap-3 mb-4">
            <img
              src={user.profile_picture}
              alt=""
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="font-medium">{user.full_name}</p>
              <p className="text-xs text-gray-500">@{user.username}</p>
            </div>
          </div>

          <textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border-none outline-none resize-none text-sm min-h-25"
          />

          
          {images.length > 0 && (
            <div className="grid grid-cols-2 gap-3 mt-4">
              {images.map((img, index) => (
                <div key={index} className="relative">
                  <img
                    src={img}
                    className="w-full h-40 object-cover rounded-lg"
                  />

                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between mt-5">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 hover:text-indigo-600">
              <ImagePlus className="w-5 h-5" />
              Add Images
              <input type="file" multiple hidden onChange={handleImageChange} />
            </label>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-5 py-2 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
