import { Link } from "nextjs13-progress";

import styles from "./book-link.module.css";

export default function BookLink({
  children,
  style = {},
  secondaryStyle = {},
  ...props
}) {
  return (
    <Link className={style} style={secondaryStyle} {...props}>
      {children}
    </Link>
  );
}
