import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { HomeLayout } from "./layout/Homelayout";
import { MainView } from "./layout/MainView";
import { MainBoardList } from "./layout/MainBoardList";

const routes = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<HomeLayout />}>
      <Route index element={<MainView />} />
      <Route index element={<MainBoardList />} />
      {/*<Route path="경로명" element={컴포넌트} />*/}
    </Route>,
  ),
);

function App() {
  // 건들지 마시오
  return <RouterProvider router={routes} />;
}

export default App;
