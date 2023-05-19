import React, { useEffect, useState, Fragment } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/router";
import { Menu, Transition } from "@headlessui/react";
import classNames from "classnames";
import logo from "./../src/assets/restaurant-logo.png";

const NavBar = (props) => {
  const [token, setToken] = useState("");
  const [restaurantId, setRestaurantId] = useState(null);

  useEffect(() => {
    if (typeof window !== undefined) {
      setToken(localStorage.getItem("token"));
      setRestaurantId(localStorage.getItem("resId"));
    }
  }, []);

  const router = useRouter();
  const [restData, setRestData] = useState(null);
  const fetchData = async () => {
    const { data } = await axios.get(
      `http://localhost:1337/api/restaurants/${restaurantId}?populate=*`
    );
    setRestData(data);
  };
  useEffect(() => {
    if (restaurantId) {
      fetchData();
    }
  }, [restaurantId]);
  const logout = async () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo.identifier) {
      localStorage.removeItem("resId");
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
      return;
    } else {
      const options = {
        method: "POST",
        url: `http://localhost:1337/api/customers/logout`,
        headers: {
          Token: token,
          "Content-Type": "application/json",
        },
      };
      axios
        .request(options)
        .then((response) => {
          console.log(response);
          if (response.status == 200) {
            localStorage.removeItem("token");
            localStorage.removeItem("userInfo");
          }
        })
        .catch((error) => {});
    }
  };
  let cartSize = 0;
  if (props.cart) {
    props.cart.map((item) => {
      cartSize += item.quantity;
    });
  }

  return (
    <div>
      <header className="text-white body-font bg-[#1e293b]">
        <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
          <Link
            href="#"
            className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0"
          >
            <img className="w-16" src={logo.src} alt="" />
            <span className="ml-3 text-white text-xl">
              {restData && restData.data.attributes.name
                ? restData && restData.data.attributes.name
                : "MyRestaurant"}
            </span>
          </Link>
          <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
            <Link href="/checkout" className="mr-5 hover:text-slate-400 flex">
              <svg
                fill="currentColor"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="0"
                className="w-8 h-8"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="none"
                  d="M10 19.5c0 .829-.672 1.5-1.5 1.5s-1.5-.671-1.5-1.5c0-.828.672-1.5 1.5-1.5s1.5.672 1.5 1.5zm3.5-1.5c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5c0-.828-.672-1.5-1.5-1.5zm1.336-5l1.977-7h-16.813l2.938 7h11.898zm4.969-10l-3.432 12h-12.597l.839 2h13.239l3.474-12h1.929l.743-2h-4.195z"
                ></path>
                <circle cx="4" cy="4" r="2" stroke="none"></circle>
              </svg>
              <div>({cartSize})</div>
            </Link>
          </nav>
          {!token ? (
            <>
              <button
                onClick={() => {
                  router.push("/login");
                }}
                className="my-2 text-white bg-slate-400 border-0 py-1 md:py-2 px-2 md:px-4 focus:outline-none hover:bg-slate-600 rounded text-sm"
              >
                Login
              </button>
              <button
                onClick={() => {
                  router.push("/signup");
                }}
                className="my-2 text-white bg-slate-400 border-0 mx-2 py-1 md:py-2 px-2 md:px-4 focus:outline-none hover:bg-slate-600 rounded text-sm"
              >
                Signup
              </button>
            </>
          ) : (
            <>
              <Menu as="div" className="relative ml-3">
                <div>
                  <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <span className="sr-only">Open user menu</span>
                    <img
                      className="h-8 w-8 rounded-full"
                      src="child.jpeg"
                      alt=""
                    />
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          href="/profile"
                          className={classNames(
                            active ? "bg-gray-100" : "",
                            "block px-4 py-2 text-sm text-gray-700"
                          )}
                        >
                          Your Profile
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={classNames(
                            active ? "bg-gray-100" : "",
                            "block px-4 py-2 text-sm text-gray-700"
                          )}
                          onClick={logout}
                        >
                          Sign out
                        </a>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            </>
          )}
        </div>
      </header>
    </div>
  );
};

export default NavBar;
