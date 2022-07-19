import { Outlet } from "react-router-dom"
import NavbarUser from "./navbar/NavbarUser"


function TemplateUser () {
    return (
        <div>
            <NavbarUser />
            <div>
              <Outlet />
            </div>
        </div>
    )
}

export default TemplateUser;