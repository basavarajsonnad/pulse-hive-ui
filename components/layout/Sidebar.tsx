"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "antd";
import { BuildOutlined } from "@ant-design/icons";
import type { ReactNode } from "react";
import translator from "@/i18n/translator";
import styles from "./styles/Sidebar.module.scss";

interface INavItem {
  key: string;
  label: string;
  icon?: ReactNode;
  href?: string;
  match?: string;
  badge?: number;
}

const NAV_ITEMS: INavItem[] = [
  {
    key: "customers",
    label: translator("layout.sidebar.nav.customers"),
    icon: <BuildOutlined />,
    href: "/customers/tenant-setup/tenants",
    match: "/customers",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <Image
          src="/logo.png"
          alt="portal26"
          width={112}
          height={25}
          priority
        />
      </div>
      <nav
        className={styles.nav}
        aria-label={translator("layout.sidebar.ariaPrimary")}
      >
        {NAV_ITEMS.map((item) => {
          const active =
            !!item.href && pathname.startsWith(item.match ?? item.href);
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
