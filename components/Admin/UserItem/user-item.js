import Image from "next/image";
import styles from "./user-item.module.css";
import { sanitizeObjectDeepFront } from "@/lib/sanitize-text";

export default function UserItem({ user }) {
  const sanitizedUser = sanitizeObjectDeepFront(user);

  const {
    id,
    name,
    surname,
    email,
    date_of_first_visit,
    date_of_last_visit,
    flame_score,
    username,
    role,
    image,
  } = sanitizedUser;

  return (
    <>
      <td>
        <div>{id || "-"}</div>
      </td>
      <td>
        <div>{role || "-"}</div>
      </td>
      <td>
        {image ? (
          <Image
            src={image}
            alt={username || "-"}
            width={50}
            height={50}
            className={styles.userImage}
          />
        ) : (
          "-"
        )}
      </td>
      <td>
        <div>{name || "-"}</div>
      </td>
      <td>
        <div>{surname || "-"}</div>
      </td>
      <td>
        <div>{username || "-"}</div>
      </td>
      <td>
        <div>{email || "-"}</div>
      </td>
      <td>
        <div>
          {date_of_first_visit
            ? new Date(date_of_first_visit).toLocaleDateString()
            : "-"}
        </div>
      </td>
      <td>
        <div>
          {date_of_last_visit
            ? new Date(date_of_last_visit).toLocaleDateString()
            : "-"}
        </div>
      </td>
      <td>
        <div>{flame_score || "-"}</div>
      </td>
    </>
  );
}
