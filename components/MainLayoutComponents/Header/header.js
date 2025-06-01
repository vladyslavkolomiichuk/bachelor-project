import Image from "next/image";
import { Link } from "nextjs13-progress";
import logo from "@/public/logo.svg";
import {
  House,
  Swords,
  BookText,
  ChartPie,
  BookA,
  BookOpenCheck,
  BookUser,
} from "lucide-react";
import { getInProgressCount } from "@/lib/db/challenge";
import SeparateBadge from "@/components/Badge/separate-badge";

import styles from "./header.module.css";

const navItems = [
  { href: "/", icon: House },
  { href: "/library", icon: BookText },
  { href: "/stats", icon: ChartPie },
  {
    href: "/challenges",
    icon: Swords,
    badge: true,
    getCount: getInProgressCount,
    type: "challenges",
  },
  { href: "/dictionary", icon: BookA },
  { href: "/test", icon: BookOpenCheck },
  { href: "/friends", icon: BookUser },
];

export default function Header() {
  return (
    <header className={styles.header}>
      <Link href="/">
        <Image src={logo} priority alt="Logo" />
      </Link>
      <nav className={styles.nav}>
        <ul>
          {navItems.map(({ href, icon: Icon, badge, getCount, type }) => (
            <li key={href}>
              <Link href={href}>
                {badge ? (
                  <SeparateBadge getCount={getCount} type={type}>
                    <Icon />
                  </SeparateBadge>
                ) : (
                  <Icon />
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
