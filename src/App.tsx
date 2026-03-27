import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Outlet } from "@tanstack/react-router";

function App() {
  return (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  );
}

export default App;
