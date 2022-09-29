import SideNav from "./SideNav/SideNav";
import Navbar from "./Navbar/Navbar";
import Workspace from "./Workspace/Workspace";
const FullLayout = ({ children }) => {
  return (
    <div>
      <Navbar></Navbar>
      <div className="flex">
        <SideNav></SideNav>
        <Workspace children={children}></Workspace>
      </div>
    </div>
  );
};

export default FullLayout;
