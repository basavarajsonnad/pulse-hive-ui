"use client";

import { useEffect } from "react";
import { message } from "antd";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { clearNotification } from "./slice";

export default function Notification() {
  const dispatch = useAppDispatch();
  const { type, message: content } = useAppSelector((state) => state.notification);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (!type) return;
    messageApi.open({ type, content });
    dispatch(clearNotification());
  }, [type, content, messageApi, dispatch]);

  return contextHolder;
}
