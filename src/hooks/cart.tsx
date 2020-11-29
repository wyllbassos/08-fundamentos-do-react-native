import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      // TODO LOAD ITEMS FROM ASYNC STORAGE
      const storageProducts = await AsyncStorage.getItem(
        'GoMarketPlace@products',
      );
      if (storageProducts) {
        setProducts(JSON.parse(storageProducts));
      }
    }

    loadProducts();
  }, []);

  const increment = useCallback(
    async id => {
      const newProducts = products.map(product => {
        if (product.id === id) {
          return {
            ...product,
            quantity: product.quantity + 1,
          };
        }
        return product;
      });
      setProducts(newProducts);
      await AsyncStorage.setItem(
        'GoMarketPlace@products',
        JSON.stringify(newProducts),
      );
    },
    [products],
  );

  const addToCart = useCallback(
    async (newProduct: Product) => {
      const { id } = newProduct;

      const productExist = products.filter(product => product.id === id);

      if (productExist.length > 0) {
        await increment(id);
      } else {
        const newProducts = [...products];
        newProducts.push({ ...newProduct, quantity: 1 });
        setProducts(newProducts);
        await AsyncStorage.setItem(
          'GoMarketPlace@products',
          JSON.stringify(newProducts),
        );
      }
    },
    [products, increment],
  );

  const decrement = useCallback(
    async id => {
      let newProducts: Product[] = [];
      const indexProduct = products.findIndex(product => product.id === id);
      if (products[indexProduct].quantity - 1 === 0) {
        if (products.length === 1) newProducts = [];
        else newProducts = products.splice(indexProduct, 1);
      } else {
        newProducts = products.map(product => {
          if (product.id === id) {
            return {
              ...product,
              quantity: product.quantity - 1,
            };
          }
          return product;
        });
      }
      setProducts(newProducts);
      await AsyncStorage.setItem(
        'GoMarketPlace@products',
        JSON.stringify(newProducts),
      );
    },
    [products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
