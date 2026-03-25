import { useCallback, useEffect, useRef, useState } from "react";
import { type ResentMessage } from "../assets/assets";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { useAuth, useUser } from "@clerk/react";
import api from "../api/base";

type RecentMessageResponse = {
  success: boolean;
  messages: ResentMessage[];
};

const ResentMessages = () => {
  const [messages, setMessages] = useState<ResentMessage[]>([]);
  const { user } = useUser();
  const { getToken } = useAuth();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchResentMessages = useCallback(async () => {
    try {
      if (!user?.id) return;

      const token = await getToken();
      if (!token) return;

      const res = await api.get<RecentMessageResponse>(
        `/message/get/recent/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.data?.success) return;

      const groupedMessages = res.data.messages.reduce<
        Record<string, ResentMessage>
      >((acc, msg) => {
        const senderId = msg.from_user_id._id;

        if (
          !acc[senderId] ||
          new Date(msg.createdAt) > new Date(acc[senderId].createdAt)
        ) {
          acc[senderId] = msg;
        }

        return acc;
      }, {});

      const sortedMessages = Object.values(groupedMessages).sort((a, b) => {
        const aTime = new Date(a.createdAt).getTime();
        const bTime = new Date(b.createdAt).getTime();

        if (isNaN(aTime) || isNaN(bTime)) return 0;

        return bTime - aTime;
      });

      setMessages(sortedMessages);
    } catch (error) {
      console.log(error);
    }
  }, [user, getToken]);

  useEffect(() => {
    if (!user?.id) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchResentMessages();
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      fetchResentMessages();
    }, 30000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchResentMessages, user?.id]);

  return (
    <div className="bg-white max-w-xs mt-4 p-4 min-h-20 rounded-md shadow text-xs text-slate-800">
      <h3 className="font-semibold text-slate-800 mb-4">Recent Messages</h3>

      <div className="flex flex-col max-h-56 overflow-y-scroll no-scrollbar">
        {messages.map((msg) => (
          <Link
            to={`messages/${msg.from_user_id._id}`}
            key={msg._id}
            className="flex items-start gap-2 py-2 hover:bg-slate-100"
          >
            <img
              src={msg.from_user_id.profile_picture.url}
              className="w-8 h-8 rounded-full"
              alt=""
            />

            <div className="w-full">
              <div className="flex justify-between">
                <p className="font-medium">{msg.from_user_id.full_name}</p>
                <p className="text-[10px] text-slate-400">
                  {formatDistanceToNow(new Date(msg.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>

              <div className="flex justify-between">
                <p className="text-gray-500">{msg.text || "Media"}</p>

                {!msg.seen && (
                  <span className="bg-indigo-500 text-white w-4 h-4 rounded-full text-[10px] flex items-center justify-center">
                    •
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ResentMessages;
