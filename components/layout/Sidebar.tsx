"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "antd";
import { BuildOutlined, HomeOutlined } from "@ant-design/icons";
import type { ReactNode } from "react";
import styles from "./Sidebar.module.scss";

interface INavItem {
  key: string;
  label: string;
  icon?: ReactNode;
  /** Items without an href are placeholders for pages not built yet. */
  href?: string;
  /** Path prefix that marks this item active (defaults to href). */
  match?: string;
  badge?: number;
}

const NAV_ITEMS: INavItem[] = [
  { key: "home", label: "Home", icon: <HomeOutlined /> },
  {
    key: "customers",
    label: "Customers",
    icon: <BuildOutlined />,
    href: "/customers/tenant-setup/tenants",
    match: "/customers",
  },
  { key: "operations", label: "Operations", badge: 44 },
  { key: "administration", label: "Administration", badge: 3 },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <Image src="/logo.png" alt="portal26" width={112} height={25} priority />
      </div>
      <nav className={styles.nav} aria-label="Primary">
        {NAV_ITEMS.map((item) => {
          const active = !!item.href && pathname.startsWith(item.match ?? item.href);
          const className = [
            styles.item,
            active && styles.active,
            !item.href && styles.disabled,
          ]
            .filter(Boolean)
            .join(" ");
          const content = (
            <>
              <span className={styles.icon}>{item.icon}</span>
              <span className={styles.label}>{item.label}</span>
              {item.badge !== undefined && (
                <Badge count={item.badge} size="small" color="#e5383b" />
              )}
            </>
          );

          return item.href ? (
            <Link
              key={item.key}
              href={item.href}
              className={className}
              aria-current={active ? "page" : undefined}
            >
              {content}
            </Link>
          ) : (
            <div key={item.key} className={className} aria-disabled="true">
              {content}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
