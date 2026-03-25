import { Eye, MessageSquare } from "lucide-react";
// import type { User  } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks/reduxHooks";

const Messages = () => {
  const connections = useAppSelector((state) => state.Connections.connections);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative bg-slate-50">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-stone-900mb-2">Messages</h1>
          <p className="text-slate-600">Talk yo your friends and family </p>
        </div>

        <div className="flex flex-col gap-3">
          {connections.length > 0 ? (
            connections.map((connection, index) => (
              <div
                key={index + 1}
                className="max-w-xl flex flex-wrap gap-5 p-6 bg-gray-200 rounded-xl hover:bg-gray-100"
              >
                <img
                  src={connection?.profile_picture.url}
                  alt=""
                  className="rounded-full size-12 mx-auto "
                />
                <div className="flex-1">
                  <p className="font-medium text-slate-700">
                    {connection.full_name}
                  </p>
                  <p className="text-slate-500">@{connection.username}</p>
                  <p className="text0-sm text-gray-600">{connection.bio}</p>
                </div>
                <div className="flex flex-col gap-2 mt-4">
                  <button
                    onClick={() => navigate(`/messages/${connection._id}`)}
                    className="size-10 flex items-center justify-center text-sm rounded bg-slate-100 hover:bg-slate-200 text-slate-800 active:scale-95 transition cursor-pointer gap-1 "
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => navigate(`/profile/${connection._id}`)}
                    className="size-10 flex items-center justify-center text-sm rounded bg-slate-100 hover:bg-slate-200 text-slate-800 active:scale-95 transition cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-slate-600">No connections yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
