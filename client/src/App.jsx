import { createBrowserRouter, RouterProvider } from "react-router-dom";
import * as Wt from "./pages";
import { store } from "./store";

// Loaders start ------
import { loader as AdminLayoutLoader } from "./pages/layouts/AdminLayout";
import { loader as LeadLayoutLoader } from "./pages/layouts/LeadLayout";
import { loader as UserLayoutLoader } from "./pages/layouts/UserLayout";

// Action starts ------
import { action as LoginAction } from "./pages/auth/Login";

const router = createBrowserRouter([
  { path: "/", element: <Wt.Login />, action: LoginAction(store) },
  { path: "/forgot-password", element: <Wt.ForgotPassword /> },
  { path: "/profile", element: <Wt.Profile /> },
  { path: "/change-password", element: <Wt.ChangePassword /> },
  {
    path: "/admin",
    element: <Wt.AdminLayout />,
    loader: AdminLayoutLoader(store),
    children: [
      { path: "dashboard", element: <Wt.AdminDashboard /> },
      { path: "users", element: <Wt.UserList /> },
      { path: "roles", element: <Wt.RoleList /> },
      { path: "projects", element: <Wt.ProjectList /> },
      { path: "permissions", element: <Wt.PermissionList /> },
      {
        path: "role-permissions",
        element: <Wt.RolePermission />,
      },
      { path: "user-permissions", element: <Wt.UserPermission /> },
      { path: "tasks", element: <Wt.TaskAdmin /> },
    ],
  },
  {
    path: "/lead",
    element: <Wt.LeadLayout />,
    loader: LeadLayoutLoader(store),
    children: [
      { path: "dashboard", element: <Wt.LeadDashboard /> },
      { path: "tasks", element: <Wt.TaskLead /> },
    ],
  },
  {
    path: "/user",
    element: <Wt.UserLayout />,
    loader: UserLayoutLoader(store),
    children: [
      { path: "dashboard", element: <Wt.UserDashboard /> },
      { path: "tasks", element: <Wt.TaskUser /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
