import {createContext, useContext, useState, useEffect, useCallback} from 'react';

const AlertContext = createContext();

export const AlertProvider = ({children}) => {
    const [stockAlert, setStockAlert] = useState(false);
    const [perimeAlert, setPerimeAlert] = useState(false);

    const [stockItems, setStockItems] = useState([]);
    const [perimeItems, setPerimeItems] = useState([]);

    // Utiliser useEffect pour surveiller les changements dans stockItems et perimeItems
    useEffect(() => {
        setStockAlert(stockItems.length > 0);
        setPerimeAlert(perimeItems.length > 0);
    }, [stockItems, perimeItems]);

    // Utiliser useCallback pour mémoriser la fonction et éviter les re-rendus inutiles
    const updateData = useCallback((data) => {
        if (data?.products && data?.lots) {
            setStockItems(data.products.filter(product => product.total_quantite < 10));
            setPerimeItems(data.lots.filter(lot => Date.now() > new Date(lot.date_peremption)));
        }
    }, []);

    return (
        <AlertContext.Provider value={{stockAlert, perimeAlert, updateData, stockItems, perimeItems}}>
            {children}
        </AlertContext.Provider>
    );
};

export const useAlert = () => useContext(AlertContext);