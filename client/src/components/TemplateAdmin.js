import { Outlet } from "react-router-dom"
import NavbarAdmin from "./navbar/NavbarAdmin"


function TemplateAdmin () {
    return (
        <div>
            <NavbarAdmin />
            <div>
              <Outlet />
            </div>
        </div>
    )
}

export default TemplateAdmin;