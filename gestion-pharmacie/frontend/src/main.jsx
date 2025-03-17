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
import {loader} from './HomeLayout'
import ProductForm , {loader as typesLoader} from './ProductForm'
import LotForm, {loader as LotFromLoader} from './LotForm'
import DetailsCommande from './DetailsCommande'
import ConfirmDelete from "./ConfirmDelete"
import Commandes_super from './Commandes_super'
import { AlertProvider } from './AlertContext'
import TraiterCommande from './TraiterCommande'
import Dashboard_super from './Dashboard-super'
import ValideLivre from './ValideLivre'



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
        loader : loader , 
        id : 'parent',
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
                  } , 
                  {
                    path : 'confirmer-suppression' ,
                    element : <ConfirmDelete/>
                  }
                ]
              } , 
              {
                path : 'commandes-super' , 
                element : <Commandes_super/> , 
                children : [
                  {
                    path : 'details' , 
                    element : <DetailsCommande/>
                  }
                ]
              } , 
              {
                index: true , 
                element : <Dashboard_super/>
              }
            ]
          } , 

          {
            path : 'gestionnaire_stock', 
            element : <RequireRole allowedRoles={['gestionnaire_stock']}/> ,
            children : [
              {
                path : 'gestion-stock' , 
                element : <GestionProduits /> ,
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
                  } , 
                  {
                    path : 'confirmer-suppression' ,
                    element : <ConfirmDelete/>
                  } 
                  
                ] 
              } , 
              {
                path : 'commandes-super' , 
                element : <Commandes_super/> , 
                children : [
                  {
                    path : 'details' , 
                    element : <DetailsCommande/>
                  } , 
                  {
                    path : 'valideLivre' , 
                    element : <ValideLivre/>
                  }
                ]
              } , 
              {
                path : 'traiter-commande' , 
                element : <TraiterCommande/>
              },
              {
                index: true , 
                element : <Dashboard_super/>
              }
                
            ]
          } , 

          {
            path : 'admin_base' , 
            element : <RequireRole allowedRoles={['admin_base']}/> ,
            children : [
              {
                path : 'mes-commandes' , 
                element : <MesCommandes /> , 
                children : [
                  {
                    path : 'details' , 
                    element : <DetailsCommande/>
                  }
                ]
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
      <AlertProvider>
       <RouterProvider router={router} />
      </AlertProvider>
    </AuthProvider>
  </StrictMode>
);
