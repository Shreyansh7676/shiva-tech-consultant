import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Navbar from './nabvbar';
import Footer from './footer';
import Home from './home';
import Gallery from './gallery.js'
import Contact from './contact.js';
import Layout from './Layout';
import About from './about.js'
import 'bootstrap/dist/css/bootstrap.min.css';
import Asset from './assetmanagement.js';
import Project from './projectmgmt.js'
import Energy from './Energymgmt.js'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import {AnimatePresence} from "framer-motion"
import { useLocation } from 'react-router-dom';
import EmailAuth from './EmailAuth.js';

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
        }
        
      ]
    }
  ])
  

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <>
    <RouterProvider router={router}/>
    </>
    
);
