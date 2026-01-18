import UserProfile from "../components/Profile";
import { Suspense } from "react";

export default function ProfilePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserProfile />
    </Suspense>
  );
}
