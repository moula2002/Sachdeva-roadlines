import React, { useContext, useState, useEffect } from 'react'
import Sidebar from './components/Layouts/Sidebar'
import Header from './components/Layouts/Header'
import { AppContext } from './context/AppContext'

import { Route, Routes } from 'react-router-dom'

// home Page
import Home from './pages/Home'
import About from './pages/About'

// hub pages
import HubEntry from './pages/HubPages/HubEntry'
import HubEdit from './pages/HubPages/HubEdit'
import ExcelEntry from './pages/HubPages/ExcelEntry'
import CrNoNullBill from './pages/HubPages/CrNoNullBill';
import Bill from './pages/HubPages/Bill';
import BulkBill from './pages/HubPages/BulkBill'
import DeleteHub from './pages/HubPages/DeleteHub'

// find pages
import LrnoFind from './pages/FindHubPages/LrnoFind'
import InwardNoFind from './pages/FindHubPages/InwardNoFind'
import CrnoFind from './pages/FindHubPages/CrnoFind'
import LrDateFind from './pages/FindHubPages/LrDateFind'
import PartyNameFind from './pages/FindHubPages/PartyNameFind'



// filter pages
import DDR from './pages/FilterPages/DDR'

// Breadcrumb showing
import Breadcrumb from "./components/Layouts/Breadcrumb";


// Dashboard pages
import Dashboard from './pages/DashboardPages/Dashboard';

// Toast messages
import { ToastContainer } from 'react-toastify'

// context
import { HubContextProvider } from './context/HubContext'
import { FindContextProvider } from './context/FindContext'

import "./App.css";   // ← MUST ADD THIS


function App() {
  /* disable scroll-based increment behavior by preventing the wheel event when the input is focused. */

  useEffect(() => {
    // Disable scroll increment on all number inputs
    const handleWheel = (e) => {
      if (e.target.type === "number") {
        e.preventDefault();
        e.target.blur(); // removes focus to stop scrolling value
      }
    };

    // Disable unwanted keys (-, e, E)
    const handleKeyDown = (e) => {
      if (
        e.target.type === "number" &&
        (e.key === "-" || e.key === "e" || e.key === "E")
      ) {
        e.preventDefault();
      }
    };

    // Attach globally
    document.addEventListener("wheel", handleWheel, { passive: false });
    document.addEventListener("keydown", handleKeyDown);

    // Cleanup when component unmounts
    return () => {
      document.removeEventListener("wheel", handleWheel);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  const {them} = useContext(AppContext);
  

  return (
    <div className={`${them ? "dark" : ""}`}>

      <HubContextProvider>
        <FindContextProvider>
          <Application />
        </FindContextProvider>
      </HubContextProvider>
    </div>
  )
}

export const Application = () => {

  const [sideBarCollapsed, setSideBarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 
      dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 transition-all duration-500'>

        
        <div className='flex h-screen overflow-hidden'>
          <Sidebar
            collapsed={sideBarCollapsed}
            isMobileOpen={isMobileOpen}
            onClose={() => setIsMobileOpen(false)}
          />

          <div className='flex-1 flex flex-col overflow-hidden '>
            <Header 
              onToggleSidebar={() => setSideBarCollapsed(!sideBarCollapsed)}
              onToggleMobile={() => setIsMobileOpen(!isMobileOpen)}
            />
            <MainContent/>
          </div>
        </div>
      </div>
    </>
  )
}
export const MainContent = () => {
  return (
    <main className='flex-1 overflow-y-auto bg-transparent'>

      {/* here we controll the hole project */}
      <div className="pt-1 px-2">
        
        <ToastContainer /> 
        <Breadcrumb />
       

        <AppRoutes />
      </div>
    </main>
  )
}

// Initial pages
import { Filter, Find, Hub } from './pages/InitialPages'
import ExcelEntryTest from './pages/HubPages/ExcelEntryTest'


export const AppRoutes = () =>  {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      
      <Route path="/find" element={<Find />} />
      <Route path="/find/lr-no-find" element={<LrnoFind />} />
      <Route path="/find/inward-find" element={<InwardNoFind />} />
      <Route path="/find/cr-no-find" element={<CrnoFind />} />
      <Route path="/find/lr-date-find" element={<LrDateFind />} />
      <Route path="/find/party-name-find" element={<PartyNameFind />} /> 
        
      <Route path="/hub" element={<Hub />} />
      <Route path="/hub/hub-entry" element={<HubEntry />} />
      <Route path="/hub/hub-edit" element={<HubEdit />} />
      <Route path="/hub/excel-entry" element={<ExcelEntry />} />
      <Route path="/hub/excel-entry-test" element={<ExcelEntryTest />} />
      <Route path="/hub/cr-no-null-bill" element={<CrNoNullBill />} />
      <Route path="/hub/bill" element={<Bill />} />
      
      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/filter" element={<Filter />} />
      <Route path="/filter/ddr" element={<DDR />} />
    
       
      <Route path="/hub" >
        <Route path="/hub/delete-hub" element={<DeleteHub />} />
        <Route path="/hub/bulk-bill" element={<BulkBill />} />
      </Route>
      
      <Route path="filter/ddr" element={<DDR />} />
    
    </Routes>
  );
}


export default App
