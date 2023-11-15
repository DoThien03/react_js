import { Outlet } from "react-router-dom";
import Header from "./components/header";
function CommonLayout() {
    return (
        <div className="WapperCommonLayout">
            <Header />
            <div className="WrapperContent">
                <Outlet />
            </div >
        </div >
    );
}
export default CommonLayout;