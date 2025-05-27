import { verifyAuth } from "@/lib/auth";
import { getUsername, getUserVisitData } from "@/lib/db/user";
import NotificationBarClient from "./notification-bar-client";
import NotificationBarUnauth from "./notification-bar-unauth";

export default async function NotificationBar() {
  const result = await verifyAuth();
  if (!result.user) {
    return <NotificationBarUnauth />;
  }

  const handleUsername = async () => {
    "use server";
    const username = await getUsername(result.user.id);
    return username;
  };

  const handleUserVisitScore = async () => {
    "use server";
    const { flame_score: score } = await getUserVisitData(result.user.id);
    return score;
  };

  return (
    <NotificationBarClient
      userId={result.user.id}
      getUsername={handleUsername}
      getUserScore={handleUserVisitScore}
    />
  );
}
