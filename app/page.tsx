"use client";

import { Button, Space, Typography } from "antd";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { decrement, increment } from "@/store/slices/counterSlice";
import styles from "./page.module.scss";

const { Title, Text } = Typography;

export default function Home() {
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();

  return (
    <main className={styles.main}>
      <Title level={2}>Pulse Hive UI</Title>
      <Text type="secondary">
        Next.js + Ant Design + Redux Toolkit + SCSS
      </Text>

      <Space size="middle" className={styles.counter}>
        <Button onClick={() => dispatch(decrement())}>−</Button>
        <Text strong>{count}</Text>
        <Button type="primary" onClick={() => dispatch(increment())}>
          +
        </Button>
      </Space>
    </main>
  );
}
