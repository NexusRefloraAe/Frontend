// LayoutScroll.js
import { Outlet } from "react-router-dom";
import "./LayoutScrollStyler.css";

function LayoutScroll() {
  return (
    <div className="layout-scroll">
      <Outlet />
    </div>
  );
}

export default LayoutScroll;
