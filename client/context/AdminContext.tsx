"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type TabType = "overview" | "products" | "inventory" | "orders" | "customers" | "categories" | "banners" | "blog" | "seo" | "settings";

interface AdminContextProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  counts: {
    products: number;
    inventory: number;
    orders: number;
    customers: number;
    categories: number;
    blog: number;
  };
  setCounts: React.Dispatch<React.SetStateAction<{
    products: number;
    inventory: number;
    orders: number;
    customers: number;
    categories: number;
    blog: number;
  }>>;
}

const AdminContext = createContext<AdminContextProps | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTabState] = useState<TabType>("overview");
  const [counts, setCounts] = useState({
    products: 0,
    inventory: 0,
    orders: 0,
    customers: 0,
    categories: 0,
    blog: 0,
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab") as TabType;
    if (tab && ["overview", "products", "inventory", "orders", "customers", "categories", "banners", "blog", "seo", "settings"].includes(tab)) {
      setActiveTabState(tab);
    }
  }, []);

  const setActiveTab = (tab: TabType) => {
    setActiveTabState(tab);
    const params = new URLSearchParams(window.location.search);
    params.set("tab", tab);
    window.history.pushState(null, "", `/admin?${params.toString()}`);
  };

  return (
    <AdminContext.Provider value={{ activeTab, setActiveTab, counts, setCounts }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
