import React from 'react';
import Headers from "./components/Header/Header";
import Footer from "./components/Footer/Footer.jsx"

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import AppRoutes from "./routes/AppRoutes.jsx";
import { useLocation } from "react-router-dom";

function App() {
    const location = useLocation();

    const hiddenHeadersPaths = ['/Home'].map(path => path.toLowerCase());
    const isHeadersVisible = hiddenHeadersPaths.includes(location.pathname.toLowerCase())

    const hiddenFooterPaths = ['/Home'].map(path => path.toLowerCase());;
    const isFooterVisible = hiddenFooterPaths.includes(location.pathname.toLowerCase());
    console.log('Current path:', location.pathname);
    return (
        <div>
            {isHeadersVisible && <Headers />}
            <AppRoutes />
            {isFooterVisible && <Footer />}
        </div>
    );
}

export default App;