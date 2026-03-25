import { Link, Route, Routes, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Feed from "./pages/Feed";
import Messages from "./pages/Messages";
import ChatBox from "./pages/ChatBox";
import Connections from "./pages/Connections";
import Discover from "./pages/Discover";
import Profile from "./pages/profile";
import CreatePost from "./pages/CreatePost";
import { useAuth, useUser } from "@clerk/react";
import Layout from "./pages/Layout";
import { useCallback, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { fetchUser } from "./features/user/user.slice";
import type { AppDispatch } from "./store";
import { fetchConnections } from "./features/connections/connection.slice";
import { addMessage } from "./features/messages/messages.slice";
import toast from "react-hot-toast";

const App = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const dispatch = useDispatch<AppDispatch>();

  const { pathname } = useLocation();
  const pathNameRef = useRef(pathname);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio("/notification1.mp3");
  }, []);

  const CurrentSession = useCallback(async () => {
    if (user) {
      const token = await getToken();
      if (token) {
        dispatch(fetchUser(token));
        dispatch(fetchConnections(token));
      }
    }
  }, [getToken, user, dispatch]);

  useEffect(() => {
    CurrentSession();
  }, [CurrentSession]);

  useEffect(() => {
    pathNameRef.current = pathname;
  }, [pathname]);

  useEffect(() => {
    if (!user?.id) return;

    const eventSource = new EventSource(
      `${import.meta.env.VITE_LOCAL_DB}api/v1/message/${user.id}`,
    );

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        const senderId = data?.message?.from_user_id?._id;

        const currentChatUserId = pathNameRef.current.split("/")[2] || null;

        if (
          pathNameRef.current.startsWith("/messages/") &&
          currentChatUserId === senderId
        ) {
          dispatch(addMessage(data.message));
          return;
        }

        

        if (data?.message === 'Connected') return;

           if (audioRef.current) {
             audioRef.current.currentTime = 0;
             audioRef.current.play().catch(() => {});
           }
 
        toast.custom(
          (t) => (
            <div
              className={`${
                t.visible ? "animate-enter" : "animate-leave"
              } max-w-sm w-full bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl pointer-events-auto flex border border-gray-200/50 overflow-hidden transition-all duration-300`}
            >
              <div className="flex-1 p-4">
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <img
                      className="h-11 w-11 rounded-full object-cover ring-2 ring-indigo-400"
                      src={data?.message?.from_user_id?.profile_picture?.url}
                      alt=""
                    />
                    <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {data?.message?.from_user_id?.full_name}
                    </p>

                    <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                      {data?.message?.text}
                    </p>

                    {/* Action */}
                    <Link
                      to={`/messages/${data?.message?.from_user_id?._id}`}
                      className="inline-block mt-2 text-xs font-medium text-indigo-600 hover:text-indigo-800 transition"
                    >
                      Reply →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ),
          { position: "top-right" },
        );
      } catch (err) {
        console.error("SSE parse error:", err);
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE error:", err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [user?.id, dispatch]);

  return (
    <Routes>
      <Route path="/" element={!user ? <Login /> : <Layout />}>
        <Route index element={<Feed />} />
        <Route path="messages" element={<Messages />} />
        <Route path="messages/:userId" element={<ChatBox />} />
        <Route path="connections" element={<Connections />} />
        <Route path="discover" element={<Discover />} />
        <Route path="profile" element={<Profile />} />
        <Route path="profile/:profileId" element={<Profile />} />
        <Route path="create-post" element={<CreatePost />} />
      </Route>
    </Routes>
  );
};

export default App;
