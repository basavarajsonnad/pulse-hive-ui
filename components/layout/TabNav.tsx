"use client";

import { usePathname, useRouter } from "next/navigation";
import { Tabs } from "antd";
import styles from "./TabNav.module.scss";

export interface ITabNavItem {
  key: string;
  label: string;
  /** Items without an href are placeholders for pages not built yet. */
  href?: string;
  /** Path prefix that marks this tab active (defaults to href). */
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
