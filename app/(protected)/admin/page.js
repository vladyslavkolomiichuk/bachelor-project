import Section from "@/components/GeneralComponents/Section/section";
import SiteStats from "@/components/Admin/Stats/site-stats";
import AdminPanel from "@/components/Admin/Panel/admin-panel";
import AdminNotification from "@/components/Admin/Notifications/admin-notification";

import styles from "@/components/Admin/admin.module.css";

export default function AdminPage() {
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
