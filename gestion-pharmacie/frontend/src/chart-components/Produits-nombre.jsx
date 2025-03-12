import React from 'react';
import { useRouteLoaderData } from "react-router-dom";

export default function Produits_Nombre() {
  const { produits } = useRouteLoaderData('parent');

  return (
    <div className="card">
      <h5>Nombre de Produits en stock</h5>
      <p>{produits.length}</p>
    </div>
  );
}