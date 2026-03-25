const ProfileSkeleton = () => {
  return (
    <div className="animate-pulse p-6 h-screen overflow-y-scroll ">
      <div className="max-w-3xl mx-auto">
        <div className="h-56 bg-gray-300 rounded-2xl" />

        <div className="mt-4 flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gray-300" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-40 bg-gray-300 rounded" />
            <div className="h-3 w-24 bg-gray-300 rounded" />
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-300 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
