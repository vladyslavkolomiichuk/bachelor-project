import { useState } from "react";
import { SquareArrowOutDownLeft, SquareArrowOutUpRight } from "lucide-react";

import styles from "./item-list.module.css";

export default function ItemList({
  type,
  items,
  children,
  selectedItem,
  onItemClick,
}) {
  const [isFullScreen, setIsFullScreen] = useState(false);

  if (!items || items.length === 0) {
    return <div className={styles.container}>No {type} found.</div>;
  }

  const headers = Object.keys(items[0]);

  return (
    <div
      className={`${styles.container} ${isFullScreen ? styles.fullScreen : ""}`}
    >
      <h3 className={styles.listTitle}>List of {type}</h3>

      <div className={styles.tableWrapper}>
        <button
          onClick={() => setIsFullScreen((prev) => !prev)}
          className={styles.fullScreenButton}
        >
          {!isFullScreen ? (
            <SquareArrowOutUpRight />
          ) : (
            <SquareArrowOutDownLeft />
          )}
        </button>
        <table className={styles.table}>
          <thead>
            <tr>
              {headers.map((header) => (
                <th key={header} className={styles.tableHeader}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                className={`${
                  selectedItem && selectedItem.id === item.id
                    ? styles.activeRow
                    : ""
                }`}
                onClick={() => onItemClick(item)}
              >
                {children(item)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
