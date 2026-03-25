import { useState, useEffect, useCallback } from "react";
import { type User } from "../assets/assets";
import UserCard from "../components/UserCard";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/react";
import api from "../api/base";
import { fetchUser } from "../features/user/user.slice";

const Discover = () => {
  const currentUser = useAppSelector((state) => state.user.user) as User | null;

  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const { getToken } = useAuth();
  const dispatch = useAppDispatch();

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setUsers([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const { data } = await api.get(`/user/discover?input=${query}`, {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });

      if (data?.success) {
        setUsers(data.users);
        const token = await getToken();
        dispatch(fetchUser(token!));
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search, handleSearch]);

  return (
    <div className="h-screen overflow-y-scroll no-scrollbar bg-linear-to-b from-slate-50 to-white">
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Discover</h1>

        <input
          type="text"
          placeholder="Search people..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full mb-6 px-4 py-2 rounded-xl bg-white shadow-sm border border-gray-200
          focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
        />

        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-40 rounded-xl bg-gray-200"></div>
            ))}
          </div>
        )}

        {!loading && users.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 transition-all duration-300">
            {users.map((user) => (
              <UserCard key={user._id} user={user} currentUser={currentUser!} />
            ))}
          </div>
        )}

        {!loading && search && users.length === 0 && (
          <div className="text-center text-gray-500 mt-10 animate-fade-in">
            <p className="text-lg">No users found 😔</p>
            <p className="text-sm">Try a different keyword</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Discover;
