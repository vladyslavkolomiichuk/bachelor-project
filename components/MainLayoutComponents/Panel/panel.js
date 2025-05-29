import SearchBar from "../../GeneralComponents/SearchComponents/SearchingBar/search-bar";
import NotificationBar from "../NotificationBar/notification-bar";

import styles from "./panel.module.css";

export default function Panel() {
  return (
    <div id="panel" className={styles.panel}>
      <SearchBar />
      <NotificationBar />
    </div>
  );
}
