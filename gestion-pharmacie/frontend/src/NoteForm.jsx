import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import './css/traitement.css'

export default function NoteForm(){
    const [note, setNote] = useState('')
    const navigate = useNavigate()
    const {commande} = useLocation().state

    async function handleNoteSUbmit(e){
        e.preventDefault()

        try {
            const response = await fetch(`http://localhost:3000/api/ajouter-note/${commande.id_commande}`, 
                {
                    method : 'PATCH' , 
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body : JSON.stringify({note: note})
                }
            )
        
            if(!response.ok){
                throw new Error('Failed to submit note')
            }

            const data = await response.json()
            window.alert(data.message)
            navigate(-1)
            
        }
        catch(err){
            console.error(err)
        }
    }

    return (
        <div className="note-overlay">
            <div className="note-container">
                <form onSubmit={handleNoteSUbmit} className="note-form">
                    <label htmlFor="note">Note</label>
                    <textarea 
                        onChange={(e)=> setNote(e.target.value)} 
                        value={note} 
                        name="note" 
                        id="note"
                        rows={5} 
                        cols={50} 
                    />

                    <button type="submit">Ajouter</button>
                </form>
            </div>
        </div>
    )
}