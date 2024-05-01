import { Routes, Route } from "react-router-dom";
import AddPost from "./Pages/Instagram/AddPost";
import Dashboard from "./Pages/Instagram/Dashboard";
import ExploreDiscover from "./Pages/Instagram/ExploreDiscover";
import ErrorPage from "./Pages/404";
import ContactSupport from "./Pages/ContactSupport";
import PrivacyPolicy from "./Pages/PrivacyPolicy";
import SearchPage from "./Pages/SearchPage";
import Settings from "./Pages/Settings";
import Reels from "./Pages/Instagram/Reels";
import ProtectedRoute from "./ProtectedRoute";
import PhotoEditor from "./Pages/PhotoEditor";
import ChatBoard from "./Pages/Instagram/ChatBoard";
import { UserProfileProvider } from "./hooks/UserProfileContext";

const Router = () => {
  return (
    <Routes>
      <Route path="/AddPost" element={<ProtectedRoute Component={AddPost} />} />
      <Route
        path="/editProfile"
        element={<ProtectedRoute Component={Settings} />}
      />
      <Route path="/Chat" element={<ProtectedRoute Component={ChatBoard} />} />
      <Route path="/Reel" element={<ProtectedRoute Component={Reels} />} />
      <Route path="/" element={<ProtectedRoute Component={Dashboard} />} />
      <Route
        path="/Explore"
        element={<ProtectedRoute Component={ExploreDiscover} />}
      />
      <Route
        path="/Profile/:userid"
        element={<ProtectedRoute Component={UserProfileProvider} />}
      />
      <Route
        path="/Search"
        element={<ProtectedRoute Component={SearchPage} />}
      />
      <Route
        path="/Settings"
        element={<ProtectedRoute Component={Settings} />}
      />
      <Route
        path="/ImageEditor"
        element={<ProtectedRoute Component={PhotoEditor} />}
      />
      <Route path="/Support" element={ContactSupport} />
      <Route path="/PrivacyPolicy" element={PrivacyPolicy} />
      <Route path="/*" element={ErrorPage} />
    </Routes>
  );
};

export default Router;
