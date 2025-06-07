import Section from "@/components/GeneralComponents/Section/section";
import SiteStats from "@/components/Admin/Stats/site-stats";
import AdminPanel from "@/components/Admin/Panel/admin-panel";
import AdminNotification from "@/components/Admin/Notifications/admin-notification";
import { notFound as notFoundFunction } from "next/navigation";
import { verifyAuth } from "@/lib/auth";
import { redirect } from "next/navigation";

import styles from "@/components/Admin/admin.module.css";

export default async function AdminPage() {
  const { user } = await verifyAuth();
  if (!user) {
    redirect("/login");
  }
  if (user.role !== "admin") {
    notFoundFunction();
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
