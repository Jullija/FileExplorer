import { createBrowserRouter } from "react-router-dom";

import Login from "../screens/Login/Login";
import SubjectsList from "../screens/SubjectsList/SubjectsList";
import Subject from "../screens/Subject/Subject";
import AccessRightsPanel from "../screens/AccessRightsPanel/AccessRightsPanel";
import Edition from "../screens/Edition/Edition";
import AddEdition from "../screens/AddEdition/AddEdition";
import AddSubject from "../screens/AddSubject/AddSubject";
import Root from "../components/Root";
import PageNotFound from "../screens/PageNotFound/PageNotFound";
import { browserRouterPaths } from "./paths";

const routes = createBrowserRouter([
  {
    path: browserRouterPaths.Default,
    element: <Root />,
    children: [
      {
        path: browserRouterPaths.Default,
        element: <Login />,
        index: true,
      },
      {
        path: browserRouterPaths.Login,
        element: <Login />,
      },
      {
        path: browserRouterPaths.SubjectsList,
        element: <SubjectsList />,
      },
      {
        path: browserRouterPaths.AddSubject,
        element: <AddSubject />,
      },
      {
        path: browserRouterPaths.Subject,
        element: <Subject />,
      },
      {
        path: browserRouterPaths.Edition,
        element: <Edition />,
      },
      {
        path: browserRouterPaths.AccessRights,
        element: <AccessRightsPanel />,
      },
      {
        path: browserRouterPaths.AddEdition,
        element: <AddEdition />,
      },
      {
        path: browserRouterPaths.PageNotFound,
        element: <PageNotFound />,
      },
    ],
  },
]);

export default routes;