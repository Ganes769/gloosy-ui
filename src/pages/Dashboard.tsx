import { Suspense } from "react";
import AppNavBar from "../components/AppNavbar";
import { useAuth } from "../context/AuthContext";
import Creator from "../components/Creator";
export default function Dashboard() {
  const { user } = useAuth();
  console.log(user);
  return (
    <div>
      <AppNavBar />
      <Suspense fallback={<div>loading</div>}>
        <Creator />
      </Suspense>
    </div>
  );
}
