import Link from "next/link";

import styles from "./book-link.module.css";

export default function BookLink({ link, children, style = {} }) {
  return (
    <Link className={style} href={link} style={style}>
      {children}
    </Link>
  );
}
