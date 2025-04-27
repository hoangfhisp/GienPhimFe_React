import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home/Home";
import NotFound from "../pages/NotFound/NotFound.jsx";

export default function AppRoutes(){
    return(
        <Routes>
            <Route path="/Home" element = {<Home/>}/>
            {/* Thêm route 404 nếu muốn */}
            <Route path="*" element={<NotFound/>} />
        </Routes>
    );
}