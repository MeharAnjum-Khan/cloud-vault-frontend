"use client";

import { createContext, useState, useContext } from "react";

// Create Context
const FolderContext = createContext();

// Create Provider
export const FolderProvider = ({ children }) => {
    const [currentFolderId, setCurrentFolderId] = useState(null);

    return (
        <FolderContext.Provider value={{ currentFolderId, setCurrentFolderId }}>
            {children}
        </FolderContext.Provider>
    );
};

// Custom Hook for safe consumption
export const useFolder = () => useContext(FolderContext);
