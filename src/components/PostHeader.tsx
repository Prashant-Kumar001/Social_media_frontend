import { MoreHorizontal } from "lucide-react";
import { useState } from "react";

const PostHeader = ({ isMyPost }: { isMyPost: boolean }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center justify-between text-sm text-gray-500 relative">

      {isMyPost && (
        <div className="relative">
          <MoreHorizontal
            onClick={() => setOpen((prev) => !prev)}
            className="w-5 h-5 cursor-pointer hover:text-black"
          />

          {open && (
            <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-md border border-gray-200 z-50">
              <button className="w-full text-left px-3 py-2 hover:bg-gray-100">
                Edit
              </button>
              <button className="w-full text-left px-3 py-2 hover:bg-gray-100 text-red-500">
                Delete
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PostHeader;
