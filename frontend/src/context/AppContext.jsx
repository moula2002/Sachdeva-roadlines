import { createContext, useState } from 'react'

import { useNavigate } from 'react-router-dom';



export const AppContext = createContext();

export const AppContextProvider = (props) => {
  
  const navigate = useNavigate();
  const [them, setThem] = useState(false);
  
  const contextValue = { them, setThem, navigate }

  return (
    <AppContext.Provider value={contextValue}>
        {props.children}
    </AppContext.Provider>
  )
}

