import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/base";
import type { User } from "../../assets/assets";

export const fetchConnections = createAsyncThunk(
  "connections/fetchConnections",
  async (token: string) => {
    const response = await api.get("/connection/account", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data?.success ? response?.data : null;
  },
);

type InitialState = {
  connections: User[];
  following: User[];
  followers: User[];
  pendingConnections: User[];
}

const connectionSlice = createSlice({
  name: "connections",
  initialState: {
    connections: [],
    pendingConnections: [],
    followers: [],
    following: [],
  } as InitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchConnections.fulfilled, (state, action) => {
      state.connections = action.payload?.connections;
      state.following = action.payload?.following;
      state.followers = action.payload?.followers;
      state.pendingConnections = action.payload?.pending;
    });
  },
});

export default connectionSlice.reducer;
