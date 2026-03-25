import { createAsyncThunk } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import api from "../../api/base";
import toast from "react-hot-toast";

export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (token: string) => {
    const response = await api.get("/user/account", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data?.user;
  },
);


export const updateUser = createAsyncThunk(
  "user/update",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async ({ formData, token }: { formData: any; token: string }) => {
    const response = await api.post("/user/account/update", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.data?.success) {
      toast.success("User updated successfully");
      return response.data?.user;
    } else {
      toast.error(response.data?.message || "Failed to update user");
      return null;
    }
  },
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload;
        }
      });
  },
});

export default userSlice.reducer;
