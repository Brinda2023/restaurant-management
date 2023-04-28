import "@/styles/globals.css";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import { useEffect, useState } from "react";
import Head from "next/head";
import { ChakraProvider } from "@chakra-ui/react";

export default function App({ Component, pageProps }) {
  <Head>
    <meta
      name="viewport"
      content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0"
    />
  </Head>;
  useEffect(() => {
  }, []);

  const [cart, setCart] = useState([]);
  const [reloadKey, setReloadKey] = useState(1);
  // Add to Cart
  const addToCart = (item, qty, price, id) => {
    let newCart = cart;
    let added;
    newCart.forEach((item, index) => {
      if (item["menu-item"] === id) {
        newCart[index].quantity++;
        added = "true";
      }
    });
    if (!added) {
      newCart.push({ item, price, quantity: qty, ["menu-item"]: id });
    }
    setCart(newCart);
    setReloadKey(Math.random());
  };

  // Remove from Cart
  const removeFromCart = (id) => {
    let newCart = cart;
    newCart.forEach((item, index) => {
      if (item["menu-item"] === id && item.quantity > 1) {
        newCart[index].quantity--;
      } else if (item["menu-item"] === id && item.quantity === parseInt(1)) {
        newCart.splice(index, 1);
      }
    });
    setCart(newCart);
    setReloadKey(Math.random());
  };

  // Clear Cart
  const clearCart = () => {
    setCart([]);
  };
  return (
    <>
      <ChakraProvider>
        <NavBar key={reloadKey} cart={cart} />
        <Component
          cart={cart}
          removeFromCart={removeFromCart}
          addToCart={addToCart}
          clearCart={clearCart}
          {...pageProps}
        />
        <Footer />
      </ChakraProvider>
    </>
  );
}
