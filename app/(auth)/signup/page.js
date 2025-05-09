import SignupForm from "@/components/FormComponents/SignupForm/signup-form";

import styles from "../auth-page.module.css";

export default function SignupPage() {
  return (
    <div className={styles.authWrapper}>
      <h1>NōtBook</h1>
      <SignupForm />
    </div>
  );
}
