import "./styles/App.css";
import { Route, Routes } from "react-router";
import DefaultLayout from "./pages/DefaultLayout";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="*" element={<DefaultLayout />} />
    </Routes>
  );
};

export default App;
