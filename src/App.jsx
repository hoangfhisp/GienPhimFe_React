import React from 'react';
import Headers from "./components/Header/Header";
import Footer from "./components/Footer/Footer.jsx"

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import AppRoutes from "./routes/AppRoutes.jsx";
import { useLocation } from "react-router-dom";

function App() {
    const location = useLocation();

    const hiddenHeadersPaths = ['/Home','/Phim','/XemPhim'].map(path => path.toLowerCase());
    const isHeadersVisible = hiddenHeadersPaths.some(path => location.pathname.toLowerCase().startsWith(path));
    
    const hiddenFooterPaths = ['/Home','/Phim','/XemPhim'].map(path => path.toLowerCase());;
    const isFooterVisible = hiddenFooterPaths.some(path => location.pathname.toLowerCase().startsWith(path));
    return (
        <div className='body-main'>
            {isHeadersVisible && <Headers />}
            <AppRoutes />
            {isFooterVisible && <Footer />}
        </div>
    );
}

export default App;