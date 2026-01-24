import React, { useEffect, useState } from 'react';
import Headers from "./components/Header/Header";
import Footer from "./components/Footer/Footer.jsx"

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import AppRoutes from "./routes/AppRoutes.jsx";
import { useLocation, useNavigationType } from "react-router-dom";
import LoaderOverlay from './components/Layouts/LoaderOverlay/LoaderOverlay.jsx';
import BackToTop from './components/Commons/BackToTop/BackToTop.jsx';

function App() {
    const location = useLocation();
    const navType = useNavigationType();
    const [showLoader, setShowLoader] = useState(false);

    const hiddenHeadersPaths = ['/Home', '/Phim', '/XemPhim', '/History', '/SearchPhim', '/InfoAccount'].map(path => path.toLowerCase());
    const isHeadersVisible = hiddenHeadersPaths.some(path => location.pathname.toLowerCase().startsWith(path));

    const hiddenFooterPaths = ['/Home', '/Phim', '/XemPhim', '/History', '/SearchPhim', '/InfoAccount'].map(path => path.toLowerCase());;
    const isFooterVisible = hiddenFooterPaths.some(path => location.pathname.toLowerCase().startsWith(path));

    useEffect(() => {
        const navEntries = performance.getEntriesByType("navigation");
        const navType = navEntries[0]?.type;

        if (navType === "reload" || navType === "navigate") {
            setShowLoader(true);

            const timer = setTimeout(() => {
                setShowLoader(false);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, []);

    return (
        <div className='body-main'>
            {showLoader && (
                <div className="loader-overlat-wrapper">
                    <LoaderOverlay />
                </div>
            )}
            {isHeadersVisible && <Headers />}
            <AppRoutes />
            {isFooterVisible && <Footer />}
            <BackToTop />
        </div>
    );
}

export default App;