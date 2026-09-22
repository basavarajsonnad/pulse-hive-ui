"use client";

import { usePathname, useRouter } from "next/navigation";
import { Tabs } from "antd";
import styles from "./styles/TabNav.module.scss";

export interface ITabNavItem {
  key: string;
  label: string;
  href?: string;
  match?: string;
}

interface ITabNavProps {
  items: ITabNavItem[];
  variant?: "primary" | "secondary";
}

export default function TabNav({ items, variant = "primary" }: ITabNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  const activeKey = items.find(
    (item) => item.href && pathname.startsWith(item.match ?? item.href),
  )?.key;

  const handleOnChange = (key: string) => {
    const href = items.find((item) => item.key === key)?.href;
    if (href) router.push(href);
  };

  return (
    <Tabs
      className={`${styles.tabs} ${styles[variant]}`}
      activeKey={activeKey}
      onChange={handleOnChange}
      items={items.map((item) => ({
        key: item.key,
        label: item.label,
        disabled: !item.href,
      }))}
    />
  );
}
