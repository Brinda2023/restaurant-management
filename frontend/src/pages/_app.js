import "@/styles/globals.css";
// import NavBar from "../../components/NavBar";
// import Footer from "../../components/Footer";
import React, { useEffect, useState } from "react";
import Head from "next/head";
import { ChakraProvider } from "@chakra-ui/react";

export default function App({ Component, pageProps }) {
  <Head>
    <meta
      name="viewport"
      content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0"
    />
  </Head>;

  const [cart, setCart] = useState([]);
  // Add to Cart
  const addToCart = (item, qty, price, id, fetchData) => {
    cart.forEach((item) => {
      if (item.menuItem === id) {
        item.quantity++;
      }
    });
    if (!cart.some((item) => item.menuItem === id)) {
      cart.push({ item, price, quantity: qty, menuItem: id });
    }
    setCart(cart);
    fetchData();
  };
  // Remove from Cart
  const removeFromCart = (id, fetchData) => {
    cart.forEach((item) => {
      if (item.quantity !== 0) {
        item.menuItem == id ? item.quantity-- : item;
      }
    });
    setCart(cart);
    fetchData();
  };

  // Clear Cart
  const clearCart = () => {
    setCart([]);
  };
  const Layout = Component.layout || (({ children }) => <>{children}</>);
  return (
    <>
      <ChakraProvider>
        {/* <NavBar key={reloadKey} cart={cart} /> */}
        <Layout>
          <Component
            cart={cart}
            removeFromCart={removeFromCart}
            addToCart={addToCart}
            clearCart={clearCart}
            {...pageProps}
          />
        </Layout>
        {/* <Footer /> */}
      </ChakraProvider>
    </>
  );
}
