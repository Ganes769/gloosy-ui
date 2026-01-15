import { createRootRoute, createRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import LoginPage from "./src/pages/Login";
import SignUpPage from "./src/pages/SignUPage";
import UpdateProfile from "./src/pages/UpdateProfile";

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
  //   component: IndexComponent,
});

export const routeTree = rootRoute.addChildren([
  indexRoute,
  signupRoute,
  loginRoute,
  homeRoute,
]);
