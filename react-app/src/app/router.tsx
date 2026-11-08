import { createBrowserRouter } from "react-router-dom";

import { AppLayout } from "../components/layout/AppLayout";
import { AboutPage } from "../pages/AboutPage";
import { ContactPage } from "../pages/ContactPage";
import { EngineeringDetailPage } from "../pages/EngineeringDetailPage";
import { EngineeringPage } from "../pages/EngineeringPage";
import { HomePage } from "../pages/HomePage";
import { WorkDetailPage } from "../pages/WorkDetailPage";
import { WorksPage } from "../pages/WorksPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "about", element: <AboutPage /> },
      { path: "works", element: <WorksPage /> },
      { path: "works/:projectSlug", element: <WorkDetailPage /> },
      { path: "work", element: <WorkDetailPage /> },
      { path: "engineering", element: <EngineeringPage /> },
      { path: "engineering/:projectSlug", element: <EngineeringDetailPage /> },
      { path: "contact", element: <ContactPage /> },
    ],
  },
]);
