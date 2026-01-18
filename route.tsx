import { createRootRoute, createRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import LoginPage from "./src/pages/Login";
import SignUpPage from "./src/pages/SignUPage";
import UpdateProfile from "./src/pages/UpdateProfile";
import Dashboard from "./src/pages/Dashboard";
import ProfilePage from "./src/pages/ProfilePage";
import { ProtectedRoute } from "./src/routes/ProtectedRoute";


const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});
const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/signup",
  component: SignUpPage,
});
const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/updateProfile",
  component: () => (
    <ProtectedRoute>
      <UpdateProfile />
    </ProtectedRoute>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  ),
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: () => (
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  ),
});

export const routeTree = rootRoute.addChildren([
  indexRoute,
  signupRoute,
  loginRoute,
  homeRoute,
  profileRoute,
]);
