import React, { useState, useEffect } from "react";
import NavBar from "../../../../components/NavBar";
import Footer from "../../../../components/Footer";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardText,
  CardTitle,
} from "reactstrap";
const cardStyle = { width: "18rem" };

const Index = () => {
  const router = useRouter();
  const [restaurantId, setRestaurantId] = useState(null);
  const [restData, setRestData] = useState(null);
  let userData;

  const fetchUser = async () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const { data } = await axios.get(
      `http://localhost:1337/api/users?filters[email]=${userInfo.identifier}&populate=*`
    );
    userData = data[0];
    console.log(userData);
    setRestaurantId(userData && userData.restaurant.id);
    localStorage.setItem("resId", userData && userData.restaurant.id);
  };
  const fetchData = async () => {
    const { data } = await axios.get(
      `http://localhost:1337/api/restaurants/${restaurantId}?populate=*`
    );
    setRestData(data.data);
  };
  useEffect(() => {
    fetchUser();
    if (restaurantId) {
      fetchData();
    }
  }, [restaurantId]);

  return (
    <>
      <NavBar />
      <div className="container mx-auto px-4">
        <section className="text-gray-600 body-font">
          <div className="container px-5 md:py-24 mx-auto">
            <div className="flex flex-wrap w-full md:mb-20">
              <div className="lg:w-1/2 w-full mb-6 lg:mb-0">
                <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-400">
                  Category List - {restData && restData.attributes.name}
                </h1>
              </div>
            </div>
            <div className="h-1 w-21 bg-slate-200 rounded"></div>
            <div className="h-5"></div>
            <div className="flex flex-wrap -m-4">
              {restData &&
                restData.attributes.categories.data.map((category) => {
                  return (
                    <div className="xl:w-1/4 md:w-1/2 p-4" key={category.id}>
                      <div className="bg-gray-100 p-6 rounded-lg">
                        {/* <h3 className="tracking-widest text-indigo-500 text-xs font-medium title-font">
                          {category.attributes.name}
                        </h3> */}
                        <h2 className="text-lg text-slate-800 font-medium title-font mb-4">
                          {category.attributes.name}
                        </h2>
                        <Link href={`/menu-item/${category.id}`}>
                          <button className="my-2 text-white bg-slate-500 border-0 py-1 md:py-2 px-2 md:px-4 focus:outline-none hover:bg-slate-600 rounded text-sm">
                            Menu Items - {`>`}
                          </button>
                        </Link>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </section>

        <section className="text-gray-600 body-font">
          <div className="container px-5 md:py-24 mx-auto">
            <div className="flex flex-wrap w-full md:mb-20">
              <div className="lg:w-1/2 w-full mb-6 lg:mb-0">
                <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-400">
                  Orders List - {restData && restData.attributes.name}
                </h1>
              </div>
            </div>
            <div className="h-1 w-21 bg-slate-200 rounded"></div>
            <div className="h-5"></div>
            <div className="flex flex-wrap -m-4">
              {restData &&
                restData.attributes.orders.data.map((order) => {
                  return (
                    <div className="xl:w-1/4 md:w-1/2 p-4" key={order.id}>
                      <div className="bg-gray-100 p-6 rounded-lg">
                        {/* <h3 className="tracking-widest text-indigo-500 text-xs font-medium title-font">
                          {category.attributes.name}
                        </h3> */}
                        <h2 className="text-lg text-slate-800 font-medium title-font mb-4">
                          Status - {order.attributes.status}
                          <br />
                          Amount - {order.attributes.totalAmount}
                          <br />
                          Items - {order.attributes.totalQuantity}
                        </h2>
                        <Link href={`/menu-item/${order.id}`}>
                          <button className="my-2 text-white bg-slate-500 border-0 py-1 md:py-2 px-2 md:px-4 focus:outline-none hover:bg-slate-600 rounded text-sm">
                            Edit Order - {`>`}
                          </button>
                        </Link>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </section>

        <section className="text-gray-600 body-font">
          <div className="container px-5 md:py-24 mx-auto">
            <div className="flex flex-wrap w-full md:mb-20">
              <div className="lg:w-1/2 w-full mb-6 lg:mb-0">
                <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-400">
                  Customer List - {restData && restData.attributes.name}
                </h1>
              </div>
            </div>
            <div className="h-1 w-21 bg-slate-200 rounded"></div>
            <div className="h-5"></div>
            <div className="flex flex-wrap -m-4">
              {restData &&
                restData.attributes.customers.data.map((customer) => {
                  return (
                    <div className="xl:w-1/4 md:w-1/2 p-4" key={customer.id}>
                      <div className="bg-gray-100 p-6 rounded-lg">
                        {/* <h3 className="tracking-widest text-indigo-500 text-xs font-medium title-font">
                          {category.attributes.name}
                        </h3> */}
                        <h2 className="text-lg text-slate-800 font-medium title-font mb-4">
                          {customer.attributes.username}
                        </h2>
                        {/* <Link href={`/menu-item/${category.id}`}>
                          <button className="my-2 text-white bg-slate-500 border-0 py-1 md:py-2 px-2 md:px-4 focus:outline-none hover:bg-slate-600 rounded text-sm">
                            Menu Items - {`>`}
                          </button>
                        </Link> */}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </section>

        <section className="text-gray-600 body-font">
          <div className="container px-5 md:py-24 mx-auto">
            <div className="flex flex-wrap w-full md:mb-20">
              <div className="lg:w-1/2 w-full mb-6 lg:mb-0">
                <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-400">
                  User List - {restData && restData.attributes.name}
                  {/* {JSON.stringify(restData && restData.attributes)} */}
                </h1>
              </div>
            </div>
            <div className="h-1 w-21 bg-slate-200 rounded"></div>
            <div className="h-5"></div>
            <div className="flex flex-wrap -m-4">
              {restData &&
                restData.attributes.users.data.map((user) => {
                  return (
                    <div className="xl:w-1/4 md:w-1/2 p-4" key={user.id}>
                      <div className="bg-gray-100 p-6 rounded-lg">
                        <h2 className="text-lg text-slate-800 font-medium title-font mb-4">
                          {user.attributes.username}
                        </h2>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Index;
