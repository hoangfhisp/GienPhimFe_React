import Headers from "./components/Header/Header";
import Footer from "./components/Footer/Footer.jsx"

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import AppRoutes from "./routes/AppRoutes.jsx";
import { useLocation } from "react-router-dom";

function App() {
  const location = useLocation();

  const hiddenFooterPaths = ['/'];
  const isFooterVisible = !hiddenFooterPaths.includes(location.pathname);
  console.log('Current path:', location.pathname);
  return (
    <div className="Main">
      <Headers />
      <AppRoutes/>
      {isFooterVisible&&<Footer/>}
    </div>
  );
}

export default App;
