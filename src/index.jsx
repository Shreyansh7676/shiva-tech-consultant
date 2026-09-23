import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Home from './home.jsx';
import Gallery from './gallery.jsx'
import Disclaimer from './Footer/Disclaimer.jsx'
import Contact from './Contact/contact.jsx';
import Layout from './Layout.jsx';
import { Analytics } from '@vercel/analytics/react';
import About from './about.jsx'
import Techadv from './Portfolio/services/techadv.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import Asset from './Portfolio/assetmanagement.jsx';
import Valuation from './Portfolio/services/valuation.jsx'
import EnergyAudit from './Portfolio/services/energyaudit.jsx'
import Project from './Portfolio/projectmgmt.jsx'
import Privacy from './Footer/Privacy.jsx'
import Manufacturing from './Portfolio/Manufacturing.jsx'
import Energy from './Portfolio/Energymgmt.jsx'
import Services from './Footer/Services.jsx'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import EmailAuth from './Contact/EmailAuth.jsx';
import ValueEng from './Portfolio/valueengg.jsx'
import HomeLogin from './Contact/homelogin.jsx'
import AdminDashboard from './Admin/AdminDashboard.jsx';

const router=createBrowserRouter(
  [{
      
      path:'/',
      element:<Layout />,
      children: [
        {
          path:"",
          element:<Home />
        },
        {
          path:"contact",
          element:<Contact />
        },
        {
          path:"gallery",
          element:<Gallery />
        },
        {
          path:"about",
          element:<About />
        },
        {
          path:"assetmanagement",
          element:<Asset />
        },
        {
          path:"projectmanagement",
          element:<Project />
        },
        {
          path:"energymanagement",
          element:<Energy />
        },
        {
          path:"emailauth",
          element:<EmailAuth />
        },
        {
          path:"homelogin",
          element:<HomeLogin />
        },
        {
          path:"services",
          element:<Services />
        },
        {
          path:"techadv",
          element:<Techadv />
        },
        {
          path:"value",
          element:<ValueEng />
        },
        {
          path:"valuation",
          element:<Valuation />
        },
        {
          path:"energyaudit",
          element:<EnergyAudit />
        },
        {
          path:"disclaimer",
          element:<Disclaimer />
        },
        {
          path:"manufacturing",
          element:<Manufacturing />
        },
        {
          path:"privacy",
          element:<Privacy />
        }
        
      ]
    },
    { path: '/admin', element: <AdminDashboard /> }
  ])
  

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <>
    <RouterProvider router={router}/>
    <Analytics />
    </>
    
);
