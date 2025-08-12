import { Link } from "react-router";
import { API_URL } from "~/lib/constants";

export function Footer() {
  return (
    <footer className="bg-card w-full border-t">
      <div className="container mx-auto px-4 py-12 md:px-6 2xl:max-w-[1400px]">
        <div className="flex flex-col justify-between md:flex-row">
          <div className="mb-8 md:mb-0">
            <a className="flex items-center space-x-2" href="/">
              <span className="text-xl font-bold">Post for Me</span>
            </a>
            <p className="text-balance text-muted-foreground mt-4 max-w-xs text-sm">
              The fastest and easiest way to build integrations with social
              media platforms.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            <div className="col-start-1 sm:col-start-4 space-y-3">
              <h3 className="text-sm font-medium">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                    to={API_URL}
                    target="_blank"
                  >
                    API Documentation
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                    to="mailto:postforme@daymoon.dev"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 items-center gap-6 border-t pt-8 md:flex-row">
          <p className="text-muted-foreground text-center text-sm md:text-left">
            <p>© {new Date().getFullYear()} Day Moon Development LLC.</p>

            <p>All rights reserved.</p>
          </p>

          <div className="flex flex-col items-center gap-2.5">
            <p className="text-[#d6c8b6] text-center text-[0.55em] font-mono">
              proudly built by
            </p>
            <Link to="https://www.daymoon.dev" target="_blank">
              <img
                src="/day-moon-logo-full.png"
                alt="Day Moon Development"
                className="h-10"
              />
            </Link>
          </div>

          <div className="flex gap-4 justify-center md:justify-end">
            <Link
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              to="/privacy"
            >
              Privacy Policy
            </Link>
            <Link
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              to="/terms"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
