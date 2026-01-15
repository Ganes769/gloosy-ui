import { createRootRoute, createRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import LoginPage from "./src/pages/Login";
import SignUpPage from "./src/pages/SignUPage";
import UpdateProfile from "./src/pages/UpdateProfile";
import Dashboard from "./src/pages/Dashboard";
import ProfilePage from "./src/pages/ProfilePage";

// Root route component

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
  component: UpdateProfile,
});

// Index route
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Dashboard,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: ProfilePage,
});

export const routeTree = rootRoute.addChildren([
  indexRoute,
  signupRoute,
  loginRoute,
  homeRoute,
  profileRoute,
]);
