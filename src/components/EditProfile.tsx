import React, { useState } from "react";
import type { User } from "../assets/assets";
import toast from "react-hot-toast";
import { updateUser } from "../features/user/user.slice";
import { useAuth } from "@clerk/react";
import { useAppDispatch } from "../hooks/reduxHooks";
type Props = {
  setShowEdit: React.Dispatch<React.SetStateAction<boolean>>;
  user: User;
};

const EditProfile = ({ setShowEdit, user }: Props) => {
  const [name, setName] = useState(user.full_name);
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio);
  const [location, setLocation] = useState(user.location);

  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [coverPicture, setCoverPicture] = useState<File | null>(null);
  const { getToken } = useAuth();
  const dispatch = useAppDispatch();
  
  




  const handleSave = async () => {
    const token = await getToken();

    if (!token) return;

    const formData = new FormData();
    formData.append("full_name", name);
    formData.append("username", username);
    formData.append("bio", bio);
    formData.append("location", location);
    formData.append("profile", profilePicture || "");
    formData.append("cover", coverPicture || "");

    try {
      dispatch(updateUser({ formData, token }));
      setShowEdit(false);
    } catch (error) {
      const err = error as Error;
      toast.error(err.message ?? "something went wrong");
    }
  };

  return (
    <div className="fixed inset-0 no-scrollbar bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center">
      <div
        className="
    w-full 
    sm:max-w-2xl 
    bg-white 
    rounded-t-3xl sm:rounded-3xl 
    shadow-2xl 
    overflow-hidden
    animate-slideUp
  "
      >
        <div className="flex justify-between items-center px-4 sm:px-6 py-3 border-b border-gray-400 ">
          <h2 className="font-semibold text-base sm:text-lg">Edit Profile</h2>
          <button
            onClick={() => setShowEdit(false)}
            className="text-gray-400 text-xl"
          >
            ✕
          </button>
        </div>

        <div className="max-h-[80vh] no-scrollbar overflow-y-auto p-2 ">
          <div className="relative group ">
            <img
              src={
                coverPicture
                  ? URL.createObjectURL(coverPicture)
                  : user.cover_photo.url ||
                    "https://via.placeholder.com/800x200"
              }
              className="w-full rounded-2xl h-32 sm:h-44 object-cover"
            />

            <label className="absolute inset-0 flex items-center justify-center rounded-2xl  bg-black/40 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition cursor-pointer">
              <span className="text-white text-xs sm:text-sm">
                Change Cover
              </span>
              <input
                type="file"
                hidden
                onChange={(e) => setCoverPicture(e.target.files?.[0] || null)}
              />
            </label>
          </div>

          <div className="flex justify-center">
            <div className="relative -mt-10 sm:-mt-12">
              <img
                src={
                  profilePicture
                    ? URL.createObjectURL(profilePicture)
                    : user.profile_picture.url ||
                      "https://via.placeholder.com/150"
                }
                className="w-20 h-20 sm:w-28 sm:h-28 rounded-full border-4 border-white object-cover"
              />

              <label className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-100 sm:opacity-0 sm:hover:opacity-100 transition cursor-pointer">
                <span className="text-white text-[10px] sm:text-xs">Edit</span>
                <input
                  type="file"
                  hidden
                  onChange={(e) =>
                    setProfilePicture(e.target.files?.[0] || null)
                  }
                />
              </label>
            </div>
          </div>

          <div className="p-4 sm:p-6 space-y-4">
            {[
              { label: "Name", value: name, setter: setName },
              { label: "Username", value: username, setter: setUsername },
              { label: "Location", value: location, setter: setLocation },
            ].map((field, i) => (
              <div key={i}>
                <label className="text-xs sm:text-sm text-gray-500">
                  {field.label}
                </label>
                <input
                  value={field.value}
                  onChange={(e) => field.setter(e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-sm sm:text-base bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            ))}

            <div>
              <label className="text-xs sm:text-sm text-gray-500">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full mt-1 px-3 py-2 text-sm sm:text-base bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center px-4 sm:px-6 py-3 border-t border-gray-300 ">
          <button
            onClick={() => setShowEdit(false)}
            className="text-gray-500 text-sm"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="bg-indigo-500  text-white px-4 sm:px-8 py-1 rounded-lg text-sm sm:text-base"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
