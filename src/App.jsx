import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom'; // Import Router từ react-router-dom
import Routes from './routes/Route'; // Import Routes component

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function App() {
    return (
        <Router>
            <Routes />
        </Router>
    );
}

export default App;