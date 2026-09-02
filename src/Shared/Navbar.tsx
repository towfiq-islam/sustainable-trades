import CombinedNavbar from "./CombinedNavbar";
import LowerNavbar from "./LowerNavbar";
import { getDynamicPages } from "@/lib/cms.api";
import { ScrollTop } from "../Components/Common/ScrollTop";
import { getUser } from "@/lib/getUser";

const Navbar = async () => {
  const [initialUser, dynamicPages] = await Promise.all([
    getUser(),
    getDynamicPages(),
  ]);

  return (
    <>
      <nav className="sticky top-0 z-999">
        <CombinedNavbar
          dynamicPages={dynamicPages?.data}
          initialUser={initialUser}
        />
        <LowerNavbar />
      </nav>

      <ScrollTop />
    </>
  );
};

export default Navbar;
