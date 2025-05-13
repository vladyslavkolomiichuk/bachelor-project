"use client";

import { useEffect, useState } from "react";
import styles from "./ToC.module.css";

export default function ToC({ content }) {
  return <nav className={styles.lastOpenNotesBar}></nav>;
}
