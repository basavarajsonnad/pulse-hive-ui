import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { INotificationState, NotificationType } from "./types";

const initialState: INotificationState = {
  type: null,
  message: "",
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotification: (
      _state,
      action: PayloadAction<{ type: NotificationType; message: string }>,
    ) => action.payload,
    clearNotification: () => initialState,
  },
});

export const { setNotification, clearNotification } = notificationSlice.actions;
export const notificationReducer = notificationSlice.reducer;
