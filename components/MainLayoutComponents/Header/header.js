import Image from "next/image";
import Link from "next/link";

import styles from "./header.module.css";

import logo from "@/public/logo.svg";
import { House } from "lucide-react";
import { BookText } from 'lucide-react';
import { ChartPie } from 'lucide-react';
import { Bolt } from 'lucide-react';
import { BookA } from 'lucide-react';
import { BookOpenCheck } from 'lucide-react';
import { BookUser } from 'lucide-react';

export default function Header() {
  return (
    <header className={styles.header}>
      <Link href="/">
        <Image
          src={logo}
          // width={100}
          // height={100}
          // sizes="10vw"
          priority
          alt="Logo"
        />
      </Link>
      <nav className={styles.nav}>
        <ul>
          <li>
            <Link href="/">
              <House />
            </Link>
          </li>
          <li>
            <Link href="/library">
              <BookText />
            </Link>
          </li>
          <li>
            <Link href="/stats">
              <ChartPie />
            </Link>
          </li>
          <li>
            <Link href="/settings">
              <Bolt />
            </Link>
          </li>
          <li>
            <Link href="/dictionary">
              <BookA />
            </Link>
          </li>
          <li>
            <Link href="/test">
              <BookOpenCheck />
            </Link>
          </li>
          <li>
            <Link href="/friends">
              <BookUser />
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
