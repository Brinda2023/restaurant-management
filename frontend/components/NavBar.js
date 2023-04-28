import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/router";
import logo from "./../src/assets/restaurant-logo.png";
let restaurantId;

const NavBar = (props) => {
  console.log(logo);
  // console.log("props from NavBar")
  console.log(props);
  const router = useRouter();
  restaurantId = router.query.id;
  const [restData, setRestData] = useState(null);
  const fetchData = async () => {
    const { data } = await axios.get(
      `http://localhost:1337/api/restaurants/${restaurantId}?populate=*`
    );
    setRestData(data);
    localStorage.setItem('resId',data.data.id)
  };
  useEffect(() => {
    
    if (restaurantId) {
      fetchData();
    }
  }, [restaurantId]);
  console.log(restData);
  let cartSize = 0;
props.cart.map((item)=>{cartSize+=item.quantity})
  return (
    <div>
      <header className="text-gray-600 body-font">
        <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
          <Link
            href="#"
            className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0"
          >
            <img className="w-16" src={logo.src} alt="" />
            <span className="ml-3 text-xl">
              {restData && restData.data.attributes.name}
            </span>
          </Link>
          <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
            <Link href="/checkout" className="mr-5 hover:text-gray-900">
              Cart({cartSize})
            </Link>
          </nav>
          <button
            onClick={() => {
              router.push("/login");
            }}
            className="my-2 text-white bg-indigo-500 border-0 py-1 md:py-2 px-2 md:px-4 focus:outline-none hover:bg-indigo-600 rounded text-sm"
          >
            Login
          </button>
          <button
            onClick={() => {
              router.push("/signup");
            }}
            className="my-2 text-white bg-indigo-500 border-0 mx-2 py-1 md:py-2 px-2 md:px-4 focus:outline-none hover:bg-indigo-600 rounded text-sm"
          >
            Signup
          </button>
        </div>
      </header>
    </div>
  );
};

export default NavBar;
