import { useCallback, useEffect, useRef, useState } from "react";
import { assets } from "../assets/assets";
import type { Post } from "../assets/assets";
import Loader from "../components/Loader";
import StoryBar from "../components/StoryBar";
import PostCard from "../components/PostCard";
import ResentMessages from "../components/ResentMessages";
import { useAuth } from "@clerk/react";
import api from "../api/base";
import PostSkeleton from "../components/PostSkeleton";

const Feed = () => {
  const [feeds, setFeeds] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const { getToken } = useAuth();
  const observerRef = useRef<HTMLDivElement | null>(null);

  const fetchFeeds = useCallback(
    async (pageNumber: number = 1) => {
      const token = await getToken();

      try {
        if (pageNumber === 1) setLoading(true);
        else setLoadingMore(true);

        const { data } = await api.get(
          `/post/feed?page=${pageNumber}&limit=5`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const newPosts = data?.posts || [];
        const pagination = data?.pagination;

        if (pageNumber === 1) {
          setFeeds(newPosts);
        } else {
          setFeeds((prev) => [...prev, ...newPosts]);
        }

        // ✅ NEW: use backend pagination
        setHasMore(pagination?.hasNextPage ?? false);

        if (pagination?.nextPage) {
          setPage(pagination.nextPage);
        }
      } catch (err) {
        const error = err as Error;
        setError(error.message || "Something went wrong");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [getToken],
  );

  useEffect(() => {
    fetchFeeds(1);
  }, [fetchFeeds]);

  
  useEffect(() => {
    if (!hasMore || loadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchFeeds(page); 
        }
      },
      { threshold: 0.5 },
    );

    const currentRef = observerRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [hasMore, loadingMore, page, fetchFeeds]);

  return (
    <div className="h-screen overflow-y-scroll no-scrollbar py-10 xl:pr-5 flex items-start justify-center xl:gap-8">
      <div>
        <StoryBar />

        <div className="p-4 space-y-6">
          {loading && (
            <div className="flex justify-center py-10">
              <Loader />
            </div>
          )}

          {!loading && error && (
            <div className="text-center text-red-500">
              <p>Failed to load feed 😕</p>
              <button
                onClick={() => {
                  setPage(1);
                  setHasMore(true);
                  fetchFeeds(1);
                }}
                className="mt-2 px-4 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && feeds.length === 0 && (
            <p className="text-gray-400 text-center">No posts available</p>
          )}

          {feeds.map((post, index) => (
            <div
              key={post._id || index}
              className="transition-all duration-500 ease-in-out opacity-0 animate-fadeIn-posts"
            >
              <PostCard post={post} />
            </div>
          ))}

          {loadingMore && (
            <div className="space-y-6">
              {[...Array(2)].map((_, i) => (
                <PostSkeleton key={i} />
              ))}
            </div>
          )}

          <div ref={observerRef} className="h-10" />

          {!hasMore && (
            <p className="text-center text-gray-400 py-4">
              You're all caught up 🎉
            </p>
          )}
        </div>
      </div>

      <div className="max-xl:hidden sticky top-0">
        <div className="max-w-xs bg-white text-xs p-4 rounded-md inline-flex flex-col gap-2 shadow">
          <h3 className="text-slate-800 font-semibold">Sponsored</h3>
          <img
            src={assets.sponsored_img}
            alt="sponsored"
            className="w-75 h-50 rounded-md"
          />
          <p className="text-slate-600">Email marketing</p>
          <p className="text-slate-400">
            Supercharge your marketing with a powerful, easy-to-use platform
            built for results.
          </p>
        </div>

        <ResentMessages />
      </div>
    </div>
  );
};

export default Feed;
