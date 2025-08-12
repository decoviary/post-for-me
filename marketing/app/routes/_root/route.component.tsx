import { Outlet } from "react-router";

import { Navbar } from "~/components/navbar";
import { Footer } from "~/components/footer";

export function Component() {
  return (
    <div className="space-y-8">
      <div className="sticky top-0 z-50 px-4 pt-4">
        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/100 z-0 backdrop-blur-lg"></div>
        <div className="relative">
          <Navbar />
        </div>
      </div>

      <div className="container p-4 mx-auto">
        <Outlet />
      </div>

      <Footer />
    </div>
  );
}
