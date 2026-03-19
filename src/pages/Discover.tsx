import { useState, useMemo } from "react";
import { dummyConnectionsData, dummyUserData } from "../assets/assets";
import UserCard from "../components/UserCard";

const Discover = () => {
  const [currentUser, setCurrentUser] = useState(dummyUserData);
  const [pending, setPending] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  const users = dummyConnectionsData;
  const handleFollow = (id: string) => {
    setCurrentUser((prev) => ({
      ...prev,
      following: [...prev.following, id],
    }));
  };

  const handleUnfollow = (id: string) => {
    setCurrentUser((prev) => ({
      ...prev,
      following: prev.following.filter((u) => u !== id),
    }));
  };

  const handleConnect = (id: string) => {
    setPending((prev) => [...prev, id]);

    setTimeout(() => {
      setPending((prev) => prev.filter((u) => u !== id));

      setCurrentUser((prev) => ({
        ...prev,
        connections: [...prev.connections, id],
      }));
    }, 2000);
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      `${user.full_name} ${user.username}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [search, users]);

  return (
    <div className="h-screen overflow-y-scroll no-scrollbar bg-linear-to-b from-slate-50 to-white">
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Discover</h1>

        <input
          type="text"
          placeholder="Search people..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
    w-full mb-6 px-4 py-2
    rounded-xl
    bg-white/20
    backdrop-blur-md
    border border-white/30
    text-gray-800 placeholder-gray-500
    focus:outline-none
    focus:bg-white/30
    focus:border-indigo-400
    focus:ring-2 focus:ring-indigo-300/40
    transition-all duration-300 ease-in-out
  "
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredUsers.map((user) => (
            <UserCard
              key={user._id}
              user={user}
              currentUser={currentUser}
              onFollow={handleFollow}
              onUnfollow={handleUnfollow}
              onConnect={handleConnect}
              pending={pending}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Discover;
