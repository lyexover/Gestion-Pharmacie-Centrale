import { useLocation } from "react-router-dom";
import './css/commande.css';

export default function Note(){
    const {commande} = useLocation().state

    return (
        <div className="note-overlay">
            <div className="note-container">
                <div className="note-content">
                    <h2>Notes de la Commande</h2>
                    <p className="note-text">{commande.notes}</p>
                </div>
            </div>
        </div>
    )
}