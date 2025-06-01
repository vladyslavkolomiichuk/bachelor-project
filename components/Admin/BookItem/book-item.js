import Image from "next/image";
import styles from "./book-item.module.css";
import { sanitizeObjectDeepFront } from "@/lib/sanitize-text";

export default function BookItem({ book }) {
  const sanitizedBook = sanitizeObjectDeepFront(book);

  const {
    id,
    isbn13,
    title,
    image,
    synopsis,
    subjects,
    buy_link,
    person_share_id,
    binding,
    authors,
    title_long,
    pages,
    dimensions,
    language,
    publisher,
    date_published,
    rating,
  } = sanitizedBook;

  return (
    <>
      <td>
        <div>{id || "-"}</div>
      </td>
      <td>
        <div>{isbn13 || "-"}</div>
      </td>
      <td>
        {image ? (
          <Image src={image} alt={title || "-"} width={75} height={120} />
        ) : (
          ""
        )}
      </td>
      <td>
        <div>{title || "-"}</div>
      </td>
      <td>
        <div>{title_long || "-"}</div>
      </td>
      <td>
        <div>{authors && authors.length ? authors.join(", ") : "-"}</div>
      </td>
      <td>
        <div>{subjects && subjects.length ? subjects.join(", ") : "-"}</div>
      </td>
      <td>
        <div>{synopsis || "-"}</div>
      </td>
      <td>
        <div>{pages || "-"}</div>
      </td>
      <td>
        <div>{language || "-"}</div>
      </td>
      <td>
        <div>
          {date_published ? new Date(date_published).toLocaleDateString() : "-"}
        </div>
      </td>
      <td>
        <div>{publisher || "-"}</div>
      </td>
      <td>
        <div>{rating || "-"}</div>
      </td>
      <td>
        <div>{buy_link || "-"}</div>
      </td>
      <td>
        <div>{binding || "-"}</div>
      </td>
      <td>
        <div>
          {dimensions ? dimensions.toLowerCase().replace(/:/g, " ") : "-"}
        </div>
      </td>
      <td>
        <div>{person_share_id || "-"}</div>
      </td>
    </>
  );
}
