import React, { useState, useEffect, useContext } from "react";
import { ChevronDown, Filter, Home, LayoutDashboard, LayoutGrid, LibraryBig, Package, Search } from "lucide-react";
import { assets } from "../../assets/assets";
import { useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import SachdevaLogo from "../../assets/SachdevaLogo";
import Them from "../AppComponents/Them";

const menuItems = [
  {
    id: "home", 
    icon: Home,
    label: "Home",
    path: "/",
  }, 
  {
    id: "find-hub",
    icon: Search,
    label: "Find Hub",
    path: "/find",
    submenu: [
      { id: "lr_no_find", label: "LRNO Find", path: "/find/lr-no-find" },
      { id: "inward_no_find", label: "Inward Find", path: "/find/inward-find" },
      { id: "cr_no_find", label: "CRNO Find", path: "/find/cr-no-find" },
      { id: "lr_date_find", label: "LR DATE Find", path: "/find/lr-date-find" },
      { id: "party_name_find", label: "PARTY NAME Find", path: "/find/party-name-find" },
    ],
  },
  {
    id: "hub",
    icon: Package,
    label: "Hub",
    path: "/hub",
    submenu: [
      { id: "hub_entry", label: "HUB Entry", path: "/hub/hub-entry" },
      { id: "hub_edit", label: "Hub Edit", path: "/hub/hub-edit" },
      { id: "excel_entry", label: "Excel Entry", path: "/hub/excel-entry" },
      { id: "excel_entry_test", label: "Excel Entry Test", path: "/hub/excel-entry-test" },
      { id: "cr_no_null_bill", label: "CRNO & CR Bill", path: "/hub/cr-no-null-bill" },
      { id: "bill", label: "Bill", path: "/hub/bill" },
      { id: "bulk_bill", label: "Bulk Bill", path: "/hub/bulk-bill" },
      { id: "delete_hub", label: "Delete Hub", path: "/hub/delete-hub" },
    ],
  },
  {
    id: "filter",
    icon: Filter,
    label: "Filter",
    path: "/filter",
    submenu: [
      { id: "ddr", label: "Get DDR", path: "/filter/ddr" },
      // { id: "partyname_lrdate_range", label: "Party to Date Range", path: "/filter/partyname-lrdate-range" },
    ],
  },
  {
    id: "dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
    path: "/dashboard",
    badge: "New",
  },
  {
    id: "admin-dashboard",
    icon: LayoutGrid,
    label: "Admin Dashboard",
    path: "/admin-dashboard",
    badge: "New",
  },
  {
    id: "about",
    icon: LibraryBig,
    label: "About",
    path: "/about",
  },
];


export default function Sidebar({ collapsed, isMobileOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedItem, setExpandedItem] = useState(null);
  const { userData } = useContext(AppContext);

  // auto expand current route's submenu
  useEffect(() => {
    const currentPath = location.pathname;
    const parentWithMatch = menuItems.find((item) =>
      item.submenu?.some((sub) => currentPath.startsWith(sub.path))
    );
    if (parentWithMatch) {
      setExpandedItem(parentWithMatch.id);
    }
  }, [location.pathname]);

  const handleParentClick = (item) => {
    if (item.submenu) {
      if (item.path) navigate(item.path);
      setExpandedItem((prev) => (prev === item.id ? null : item.id));
    } else if (item.path) {
      navigate(item.path);
      setExpandedItem(null);
      if (isMobileOpen) onClose(); // close mobile menu after navigation
    }
  };

  return (
    <>
      {/* 🔹 Mobile overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 sm:hidden transition-opacity duration-300 
        ${isMobileOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={onClose}
      />

      {/* 🔹 Sidebar */}
      <div
        className={`fixed sm:static top-0 left-0 h-full z-50 sm:z-0
        transition-all duration-300 ease-in-out
        bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r 
        border-slate-200/50 dark:border-slate-700/50 flex flex-col
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} 
        sm:translate-x-0 
        ${collapsed ? "sm:w-20" : "sm:w-72"} w-72`}
      >
        <SidebarLogo collapsed={collapsed} />
        <div className='block sm:hidden bg-transparent ml-4 mt-2.5'>
          <Them /> 
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems
          .map((item) => {
            const isActive = location.pathname === item.path;
            const isExpanded = expandedItem === item.id;

            return (
              <div key={item.id}>
                <button
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 
                    ${
                      isActive
                        ? "bg-gradient-to-r from-blue-500 to-pink-600 text-white shadow-blue-500/25"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                    }`}
                  onClick={() => handleParentClick(item)}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-5 h-5" />
                    {!collapsed && <span className="font-medium ml-2">{item.label}</span>}
                  </div>
                  {!collapsed && item.submenu && (
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    />
                  )}
                </button>
                {/* http://localhost:5173/hub/hub-entry */}


                {/* Submenu */}
                {!collapsed && item.submenu && isExpanded && (
                  <div className="ml-8 mt-2 space-y-1">

                    {item.submenu.map((subitem) => {
                      const isSubActive = location.pathname === subitem.path;
                      return (
                        <button
                          key={subitem.id}
                          onClick={() => {
                            navigate(subitem.path);
                            if (isMobileOpen) onClose();
                          }}
                          className={`w-full text-left p-2 text-sm rounded-lg transition-all 
                            ${
                              isSubActive
                                ? "bg-gradient-to-r from-blue-500 to-pink-500 text-white"
                                : "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                            }`}
                        >
                          {subitem.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </>
  );
}

// Sidebar Logo
const  SidebarLogo = ({collapsed}) => {
  return (
    <div className="px-6 py-[12px] border-b border-slate-200/50 dark:border-slate-700/50">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg pt-2">
          <SachdevaLogo
            src={assets.sechdeva_icon}  // use your real logo image path
            size={50}
            color="#ffffff"
          />
        </div>
        {!collapsed && (
          <div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-white">Sechdeva </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">RoadLines</p>
          </div>
        )}
      </div>
    </div>
  );
}
