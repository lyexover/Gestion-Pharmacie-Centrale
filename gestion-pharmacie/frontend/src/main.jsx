import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {createBrowserRouter , RouterProvider, Navigate, Form} from 'react-router-dom'
import './index.css'
import Auth from './Auth'
import { AuthProvider } from './AuthContext'
import { ProtectedRoute, RequireRole } from './ProtectedRoutes'
import HomeLayout from './HomeLayout'
import GestionUtilisateurs from './GestionUtilisateurs'
import GestionStock from './GestionStock'
import MesCommandes from './MesCommandes'
import {loader as usersLoader} from './GestionUtilisateurs'
import GestionProduits from './GestionProduits'
import {loader as produitsLoader} from './GestionProduits'
import ProductForm , {loader as typesLoader} from './ProductForm'
import LotForm, {loader as LotFromLoader} from './LotForm'

const router = createBrowserRouter([
  {
    path: '/login',
    element : <Auth />
  } , 
  {
    path: '/',
    element: <Navigate to="/login" replace />
  },
  {
    element : <ProtectedRoute />,
    children : [
      {
        element : <HomeLayout/> , 
        children : [
          {
            path : 'superAdmin' , 
            element : <RequireRole allowedRoles={['superAdmin']}/> , 
            children : [
              {
                path : 'gestion-utilisateurs' , 
                element : <GestionUtilisateurs /> , 
                loader : usersLoader
              } , 
              {
                path : 'gestion-stock' , 
                element : <GestionProduits /> , 
                loader : produitsLoader , 
                children : [
                  {
                    path : 'ajouter-produit' , 
                    element : <ProductForm /> , 
                    loader : typesLoader
                  } , 
                  {
                    path : 'ajouter-Lot', 
                    element : <LotForm/>, 
                    loader : LotFromLoader
                  }
                ]
              }
            ]
          } , 

          {
            path : 'gestionnaire_stock' , 
            element : <RequireRole allowedRoles={['gestionnaire_stock']}/> ,
            children : [
              {
                path : 'gestion-stock' , 
                element : <GestionStock />
              }
            ]
          } , 

          {
            path : 'admin_base' , 
            element : <RequireRole allowedRoles={['admin_base']}/> ,
            children : [
              {
                path : 'mes-commandes' , 
                element : <MesCommandes />
              }
            ]
          }
          
        ]
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
