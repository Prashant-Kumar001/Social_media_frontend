import { useEffect, useRef, useState } from "react";
import { dummyMessagesData, dummyUserData } from "../assets/assets";
import { ImageIcon, SendHorizontal, X } from "lucide-react";

const ChatBox = () => {
  const messages = dummyMessagesData;
  const [text, setText] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [user, setUser] = useState(dummyUserData);
  const messageEndRef = useRef<HTMLDivElement>(null);

  const handleMessage = async () => {};

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    user && (
      <div className="flex flex-col h-screen">
        <div
          className="flex items-center
       gap-2 p-2 md:px-10 xl:pl-42 bg-linear-0-to-r from-indigo-50 to-purple-50 border-b border-gray-300"
        >
          <img
            src={user.profile_picture}
            alt=""
            className="size-8 rounded-full"
          />
          <div>
            <p className="font-medium">{user.full_name}</p>
            <p className="text-sm text-gray-500 -mt-1.5">@{user.username}</p>
          </div>
        </div>
        <div className="p-5 md:px-10 h-full overflow-y-auto">
          <div className="space-y-4 max-w-4xl mx-auto">
            {messages
              .toSorted(
                (a, b) =>
                  new Date(a.createdAt).getTime() -
                  new Date(b.createdAt).getTime(),
              )
              .map((message, index) => (
                <div
                  key={index}
                  className={`flex flex-col ${message.from_user_id === user._id ? "items-start" : "items-end"} `}
                >
                  <div
                    className={`p-2 text-sm max-w-sm bg-white text-slate-700 rounded-lg shadow ${message.to_user_id !== user._id ? "rounded-bl-none" : "rounded-br-none"} `}
                  >
                    {message.message_type === "image" && (
                      <img
                        src={message.media_url}
                        alt=""
                        className="w-full max-w-sm rounded-lg mb-1"
                      />
                    )}
                    <p className="">{message.text}</p>
                  </div>
                </div>
              ))}
            <div ref={messageEndRef} />
          </div>
        </div>
        <div className="px-4">
          <div className="flex items-center  gap-3 pl-5 p-1.5 bg-white w-full max-w-xl mx-auto  border-gray-200 shadow rounded-full mb-5  ">
            <input
              type="text"
              className="flex-1 outline-none text-shadow-slate-700 h-8"
              placeholder="Type a message... "
              onKeyDown={(e) => e.key === "Enter" && handleMessage()}
              onChange={(e) => setText(e.target.value)}
              value={text}
            />
            <div className="relative">
              <label htmlFor="image">
                {image ? (
                  <img
                    src={URL.createObjectURL(image)}
                    alt=""
                    className="h-8 rounded mr-2"
                  />
                ) : (
                  <ImageIcon className="size-6 text-gray-500 cursor-pointer rounded mr-1" />
                )}
              </label>

              {image && (
                <span className="absolute -top-1 right-0">
                  <X
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setImage(null);
                    }}
                    className="size-4 text-white bg-black/60 rounded cursor-pointer"
                  />
                </span>
              )}

              <input
                type="file"
                id="image"
                hidden
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files) {
                    setImage(e.target.files[0]);
                  }
                }}
              />
            </div>
            <button
              onClick={handleMessage}
              className="p-2 rounded-full bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-800 active:scale-95 transition text-white cursor-pointer "
            >
              <SendHorizontal
                size={18}
                className="w-5 transform-rotate-45 h-5"
              />
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default ChatBox;
