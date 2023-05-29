import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";

const Checkout = ({ cart, clearCart }) => {
  const router = useRouter();
  const [subtotal, setSubtotal] = useState(0);

  useEffect(() => {
    let myTotal = 0;
    for (let index = 0; index < cart.length; index++) {
      myTotal = myTotal + (cart[index].price * cart[index].quantity);
    }
    setSubtotal(myTotal);
  }, []);

  // Place Order
  const placeOrder = async (e) => {
    e.preventDefault();
    const cartData = cart;

    // Check if User is Login or not
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/signup");
    } else {
      const restaurant = localStorage.getItem("resId");
      const options = {
        method: "POST",
        url: `http://localhost:1337/api/restaurant/orders`,
        headers: {
          Token: token,
          "Content-Type": "application/json",
        },
        data: {
          data: {
            restaurant,
            items: cartData,
            tableNumber: 0,
          },
        },
      };
      axios
        .request(options)
        .then((response) => {
          if (response.status == 200) {
            clearCart();
            router.push(`/thankyou/${response.data.id}`);
          }
        })
        .catch((error) => {
          router.push("/failed");
        });
    }
  };

  return (
    <>
      <NavBar />
      <div>
        <section className="text-black body-font relative">
          <div className="container px-5 py-24 mx-auto min-h-screen">
            <div className="flex flex-col w-full mb-12">
              <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-black">
                Checkout
              </h1>
              <h2 className="text-2xl font-medium">Cart</h2>
              <div className="cart my-2">
                {cart.length
                  ? `Your cart details are as follows`
                  : `Your cart is Empty!`}
              </div>
              <ul className="list-decimal px-8">
                {cart.map((item) => {
                  return (
                    // eslint-disable-next-line react/jsx-key
                    <li>
                      Product {item.item} with a price of ₹{item.price} |
                      Quantity : {item.quantity} | Menu-Item : {item.menuItem}
                    </li>
                  );
                })}
              </ul>
              <div className="font-bold my-10">Subtotal:{subtotal}</div>
            </div>

            <div className="">
              <div className="flex flex-wrap -m-2">
                <div className="p-2 w-full">
                  <button
                    onClick={placeOrder}
                    className="flex text-white bg-slate-800 border-0 py-2 px-8 focus:outline-none hover:bg-slate-600 rounded text-lg"
                    disabled={cart.length ? false : true}
                  >
                    Place Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Checkout;
