import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Home from './home';
import Gallery from './gallery.js'
import Disclaimer from './Footer/Disclaimer.js'
import Contact from './Contact/contact.js';
import Layout from './Layout';
import { Analytics } from '@vercel/analytics/react';
import About from './about.js'
import Techadv from './Portfolio/services/techadv.js'
import 'bootstrap/dist/css/bootstrap.min.css';
import Asset from './Portfolio/assetmanagement.js';
import Valuation from './Portfolio/services/valuation.js'
import EnergyAudit from './Portfolio/services/energyaudit.js'
import Project from './Portfolio/projectmgmt.js'
import Privacy from './Footer/Privacy.js'
import Manufacturing from './Portfolio/Manufacturing.js'
import Energy from './Portfolio/Energymgmt.js'
import Services from './Footer/Services.js'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import EmailAuth from './Contact/EmailAuth.js';
import ValueEng from './Portfolio/valueengg.js'
import HomeLogin from './Contact/homelogin.js'
import AdminDashboard from './Admin/AdminDashboard.js';

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
