import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/user/user.slice";
import connectionReducer from "./features/connections/connection.slice";
import messageReducer from "./features/messages/messages.slice";
export const store = configureStore({
  reducer: {
    user: userReducer,
    Connections: connectionReducer,
    messages: messageReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
