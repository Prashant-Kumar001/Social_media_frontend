const PostSkeleton = () => {
  return (
    <div className="bg-white p-4 rounded-xl shadow animate-pulse space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-300 rounded-full" />
        <div className="h-3 w-24 bg-gray-300 rounded" />
      </div>

      <div className="h-60 bg-gray-300 rounded-lg" />

      <div className="space-y-2">
        <div className="h-3 bg-gray-300 rounded w-3/4" />
        <div className="h-3 bg-gray-300 rounded w-1/2" />
      </div>
    </div>
  );
};

export default PostSkeleton;
