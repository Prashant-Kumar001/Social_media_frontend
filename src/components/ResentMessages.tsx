/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { dummyRecentMessagesData, type ResentMessage } from "../assets/assets";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

const ResentMessages = () => {
  const [message, setMessage] = useState<ResentMessage[]>([]);
  const fetchResentMessages = async () => {
    setMessage(dummyRecentMessagesData);
  };
  useEffect(() => {
    fetchResentMessages();
  }, []);
  return (
    <div className="bg-white max-w-xs mt-4 p-4 min-h-20 rounded-md shadow text-xs text-slate-800 ">
      <h3 className="font-semibold text-slate-800 mb-4">Resent Messages</h3>
      <div className="flex flex-col max-h-56 overflow-y-scroll no-scrollbar  ">
        {message.map((message, index) => (
          <Link
            to={`messages/${message.from_user_id._id}`}
            key={index}
            className="flex items-start gap-2 py-2 hover:bg-slate-100 "
          >
            <img
              src={message.from_user_id.profile_picture}
              className="w-8 h-8 rounded-full"
              alt=""
            />
            <div className="w-full">
              <div className="flex justify-between">
                <p className="font-medium">{message.from_user_id.full_name}</p>
                <p className="text-[10px] text-slate-400 ">
                  {formatDistanceToNow(new Date(message.createdAt))}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-500">
                  {message.text ? message.text : "Media"}
                </p>
                {!message.seen && (
                  <p className="bg-indigo-500 text-white w-4 h-4 rounded-full  text-[10px] flex items-center justify-center "></p>
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
