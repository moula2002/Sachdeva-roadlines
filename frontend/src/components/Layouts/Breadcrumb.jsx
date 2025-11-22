import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const routeNames = {
  "/": "Home",
  "/dashboard": "Dashboard",
  "/find": "Find Hub",
  "/find/lr-no-find": "LRNO Find",
  "/find/cr-no-find": "CRNO Find",
  "/find/inward-find": "Inward Find",
  "/find/lr-date-find": "LR Date Find",
  "/find/party-name-find": "Party Name Find",
  "/hub": "Hub",
  "/hub/hub-entry": "Hub Entry",
  "/hub/hub-edit": "Hub Edit",
  "/hub/payment": "Payment",
  "/hub/excel-entry": "Excel Entry",
  "/filter": "Filter",
  "/filter/ddr": "Get DDR",
  "/filter/partyname-lrdate-range": "Party to Date Range",
};

export default function Breadcrumb() {
  const location = useLocation();
  const navigate = useNavigate();
  const pathnames = location.pathname.split("/").filter(Boolean);

  // 🏠 Case 1: Home page
  if (pathnames.length === 0) {
    return (
      <div className="text-sm font-semibold text-slate-800 dark:text-white mb-4">
        Home
      </div>
    );
  }

  const buildPath = (index) => "/" + pathnames.slice(0, index + 1).join("/");

  const crumbs = pathnames.map((_, index) => {
    const path = buildPath(index);
    return {
      path,
      label: routeNames[path] || pathnames[index],
    };
  });

  // 🧩 Case 2: Only one level (like "/hub" or "/find")
  if (crumbs.length === 1) {
    const crumb = crumbs[0];
    return (
      <nav className="flex items-center text-sm mb-4 text-slate-600 dark:text-slate-300">
        <span
          onClick={() => navigate(crumb.path)}
          className="cursor-pointer hover:bg-gradient-to-r hover:from-blue-500 hover:to-pink-500 hover:bg-clip-text hover:text-transparent font-semibold transition-all"
        >
          {crumb.label}
        </span>
      </nav>
    );
  }

  // Case 3: Nested paths (like "/hub/excel-entry")
  return (
    <nav
      className="flex items-center flex-wrap text-sm text-slate-600 dark:text-slate-300 mb-4"
      aria-label="Breadcrumb"
    >
      {crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1;
        return (
          <React.Fragment key={crumb.path}>
            {index > 0 && (
              <ChevronRight className="w-4 h-4 text-slate-400 mx-1 inline" />
            )}
            {isLast ? (
              <span className="font-semibold text-slate-800 dark:text-white">
                {crumb.label}
              </span>
            ) : (
              <button
                onClick={() => navigate(crumb.path)}
                className="hover:bg-gradient-to-r hover:from-blue-500 hover:to-pink-500 hover:bg-clip-text hover:text-transparent transition-all"
              >
                {crumb.label}
              </button>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
