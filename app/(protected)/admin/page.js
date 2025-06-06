import Section from "@/components/GeneralComponents/Section/section";
import SiteStats from "@/components/Admin/Stats/site-stats";
import AdminPanel from "@/components/Admin/Panel/admin-panel";
import AdminNotification from "@/components/Admin/Notifications/admin-notification";

import styles from "@/components/Admin/admin.module.css";
import { verifyAuth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const { user } = await verifyAuth();
  if (!user) {
    redirect("/login");
  }

  return (
    <Section sectionName="Admin Panel">
      <div className={styles.together}>
        <SiteStats />
        <AdminNotification />
      </div>

      <AdminPanel />
    </Section>
  );
}
