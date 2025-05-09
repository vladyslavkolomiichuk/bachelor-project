import LoginForm from "@/components/FormComponents/LoginForm/login-form";

import styles from "../auth-page.module.css";

export default function LoginPage() {
  return (
    <div className={styles.authWrapper}>
      <h1>NōtBook</h1>
      <LoginForm />
    </div>
  );
}
