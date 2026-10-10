import React, { createContext, useContext, useState, useEffect } from 'react';

const InquiryCartContext = createContext();

export const InquiryCartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('shriji_inquiry_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('shriji_inquiry_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to persist cart items', e);
    }
  }, [cartItems]);

  const addToCart = (product, selectedPack, quantity = 1) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.productId === product._id && item.weight === selectedPack.weight
      );

      if (existingIndex > -1) {
        const copy = [...prev];
        copy[existingIndex].quantity += quantity;
        copy[existingIndex].subtotal = copy[existingIndex].quantity * copy[existingIndex].unitPrice;
        return copy;
      } else {
        const price = selectedPack.discountPrice || selectedPack.price;
        return [
          ...prev,
          {
            productId: product._id,
            productName: product.name,
            productImage: product.images?.[0] || '/assets/placeholders/sample-product.svg',
            weight: selectedPack.weight,
            unitPrice: price,
            quantity: quantity,
            subtotal: price * quantity
          }
        ];
      }
    });
    setIsDrawerOpen(true);
  };

  const updateQuantity = (productId, weight, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId, weight);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.productId === productId && item.weight === weight) {
          return {
            ...item,
            quantity: newQty,
            subtotal: newQty * item.unitPrice
          };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId, weight) => {
    setCartItems((prev) =>
      prev.filter((item) => !(item.productId === productId && item.weight === weight))
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalCartAmount = cartItems.reduce((acc, item) => acc + item.subtotal, 0);

  return (
    <InquiryCartContext.Provider
      value={{
        cartItems,
        totalItemsCount,
        totalCartAmount,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        isDrawerOpen,
        setIsDrawerOpen
      }}
    >
      {children}
    </InquiryCartContext.Provider>
  );
};

export const useInquiryCart = () => useContext(InquiryCartContext);
