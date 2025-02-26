import {createContext, useContext, useState} from 'react';


const AlertContext = createContext();

export const AlertProvider = ({children}) => {

    const [stockAlert, setStockAlert] = useState(false);
    const [perimeAlert, setPerimeAlert] = useState(false);


    return (
        <AlertContext.Provider value={{stockAlert, setStockAlert, perimeAlert, setPerimeAlert}}>
            {children}
        </AlertContext.Provider>
    )

}

export const useAlert = () => useContext(AlertContext);