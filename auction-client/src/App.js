import { Route, Routes } from "react-router";
import { Index } from "./components/Index/Index";
import { Auth } from "./components/Auth/Auth";
import { Navbar } from "./components/Navbar/Navbar";
import { CheckAuth } from "./middlewares/checkAuth";

import { Lots } from "./components/Lots/Lots";

export const App = () => {
  return (
    <>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route
          path="/"
          element={
            <CheckAuth>
              <Navbar />
              <Index />
            </CheckAuth>
          }
        />
        <Route
          path="/lots"
          element={
            <CheckAuth>
              <Navbar />
              <Lots />
            </CheckAuth>
          }
        />
      </Routes>
    </>
  );
};
