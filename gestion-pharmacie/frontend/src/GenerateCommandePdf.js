import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Génère un PDF avec les détails de la commande et le télécharge
 * @param {Object} commande - Informations de la commande
 * @param {Array} produits - Liste des produits commandés
 * @param {Array} traitement_data - Données de traitement avec les lots utilisés
 * @param {Array} produits_lots - Tous les lots disponibles (pour obtenir les informations détaillées)
 */
export const generateCommandePdf = (commande, produits, traitement_data, produits_lots) => {
  // Créer un nouveau document PDF
  const doc = new jsPDF();
  
  // Ajouter le titre
  doc.setFontSize(18);
  doc.text(`Détails de la commande #${commande.id_commande}`, 14, 20);
  
  // Informations sur la commande
  doc.setFontSize(12);
  doc.text(`Date de commande: ${new Date(commande.date_commande).toLocaleDateString()}`, 14, 30);
  doc.text(`Client: ${commande.nom_client || 'Non spécifié'}`, 14, 38);
  doc.text(`Adresse: ${commande.adresse_livraison || 'Non spécifiée'}`, 14, 46);
  doc.text(`Statut: ${commande.statut}`, 14, 54);
  
  // Tableau des produits commandés
  doc.setFontSize(14);
  doc.text('Produits commandés', 14, 65);
  
  const produitsTableData = produits.map(produit => [
    produit.code_produit,
    produit.nom || 'Non spécifié',
    produit.quantite_commande
  ]);
  
  autoTable(doc, {
    startY: 70,
    head: [['Code produit', 'Nom', 'Quantité commandée']],
    body: produitsTableData
  });
  
  // Obtenir la position Y après le premier tableau
  const finalY1 = doc.lastAutoTable ? doc.lastAutoTable.finalY : 120;
  
  // Tableau des lots utilisés pour le traitement
  doc.setFontSize(14);
  doc.text('Lots utilisés pour le traitement', 14, finalY1 + 15);
  
  // Préparation des données pour le tableau des lots
  const traitementTableData = traitement_data.map(item => {
    const lot = produits_lots.find(l => l.id_lot === item.id_lot);
    return [
      lot?.id_lot || 'N/A',
      lot?.code_produit || 'N/A',
      lot?.nom || 'Non spécifié',
      item.quantite,
      lot?.date_peremption ? new Date(lot.date_peremption).toLocaleDateString() : 'N/A'
    ];
  });
  
  autoTable(doc, {
    startY: finalY1 + 20,
    head: [['ID Lot', 'Code produit', 'Nom', 'Quantité utilisée', 'Date de péremption']],
    body: traitementTableData
  });
  
  // Obtenir la position Y après le deuxième tableau
  const finalY2 = doc.lastAutoTable ? doc.lastAutoTable.finalY : finalY1 + 100;
  
  // Informations sur le traitement
  const totalProduits = produits.reduce((sum, p) => sum + p.quantite_commande, 0);
  const totalTraite = traitement_data.reduce((sum, item) => sum + item.quantite, 0);
  
  doc.setFontSize(12);
  doc.text(`Total produits commandés: ${totalProduits}`, 14, finalY2 + 15);
  doc.text(`Total produits traités: ${totalTraite}`, 14, finalY2 + 23);
  
  if (totalTraite < totalProduits) {
    doc.setTextColor(255, 0, 0);
    doc.text(`Attention: ${totalProduits - totalTraite} produits n'ont pas été traités`, 14, finalY2 + 31);
    doc.setTextColor(0, 0, 0);
  }
  
  // Pied de page
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(`Page ${i} sur ${pageCount} - Traitement effectué le ${new Date().toLocaleString()}`, 14, doc.internal.pageSize.height - 10);
  }
  
  // Télécharger le PDF
  doc.save(`commande_${commande.id_commande}_traitement.pdf`);
};