import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/base";
import type { Message } from "../../assets/assets";

export const fetchMessages = createAsyncThunk(
  "messages/fetchMessages",
  async ({ token, id }: { token: string; id: string }) => {
    const response = await api.get(`/message/get/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data?.success ? response?.data : null;
  },
);

type MMessage = {
  messages: Message[];
};

const messageSlice = createSlice({
  name: "messages",
  initialState: {
    messages: [],
  } as MMessage,
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      state.messages = [...state.messages, action.payload];
    },
    resetMessage: (state) => {
      state.messages = [];
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMessages.fulfilled, (state, action) => {
      state.messages = action.payload?.messages;
    });
  }
});

export const { setMessages, addMessage, resetMessage } = messageSlice.actions;
export default messageSlice.reducer;
