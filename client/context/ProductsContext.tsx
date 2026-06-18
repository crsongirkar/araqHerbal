"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import initialProducts from "@/data/products.json";

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  images?: string[];
  description: string;
  rating?: number;
  reviewCount?: number;
  stock?: number;
  mfgDate?: string;
  expiryDate?: string;
  ingredients?: string;
  netWeight?: string;
  shelfLife?: string;
}

interface ProductsContextProps {
  products: Product[];
  loading: boolean;
  addProduct: (product: Omit<Product, "id">) => Promise<Product | null>;
  deleteProduct: (id: number) => Promise<boolean>;
  updateProduct: (id: number, product: Partial<Product>) => Promise<Product | null>;
  refreshProducts: () => void;
}

const ProductsContext = createContext<ProductsContextProps | undefined>(undefined);

export const ProductsProvider = ({ children }: { children: React.ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts as Product[]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addProduct = async (productData: Omit<Product, "id">) => {
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });
      if (res.ok) {
        const newProduct = await res.json();
        setProducts((prev) => [...prev, newProduct]);
        return newProduct;
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
    return null;
  };

  const deleteProduct = async (id: number) => {
    try {
      const res = await fetch(`/api/products?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        return true;
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
    return false;
  };

  const updateProduct = async (id: number, productData: Partial<Product>) => {
    try {
      const res = await fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...productData }),
      });
      if (res.ok) {
        const updatedProduct = await res.json();
        setProducts((prev) => prev.map((p) => (p.id === id ? updatedProduct : p)));
        return updatedProduct;
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
    return null;
  };

  return (
    <ProductsContext.Provider
      value={{
        products,
        loading,
        addProduct,
        deleteProduct,
        updateProduct,
        refreshProducts: fetchProducts,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductsProvider");
  }
  return context;
};
