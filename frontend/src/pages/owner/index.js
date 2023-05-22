import React, { useState, useEffect } from "react";
import NavBar from "../../../components/NavBar";
import Footer from "../../../components/Footer";
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
  const [restData, setRestData] = useState(null);
  const fetchData = async () => {
    const token = localStorage.getItem("token");
    console.log(token);

    if (token) {
      const options = {
        method: "GET",
        url: `http://localhost:1337/api/restaurants`,
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      };
      axios
        .request(options)
        .then((response) => {
          if (response.status == 200) {
            setRestData(response.data.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  const setResId = async (id) => {
    localStorage.setItem("resId", id);
  };
  useEffect(() => {
    fetchData();
  }, []);

  console.log(restData);
  return (
    <>
      <NavBar />
      <div className="container mx-auto px-4">
        <section className="text-gray-600 body-font">
          <div className="container px-5 md:py-24 mx-auto">
            <div className="flex flex-wrap w-full md:mb-20">
              <div className="lg:w-1/2 w-full mb-6 lg:mb-0">
                <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-400">
                  Restaurant List
                </h1>
              </div>
            </div>
            <div className="h-1 w-21 bg-slate-200 rounded"></div>
            <div className="h-5"></div>
            <div className="flex flex-wrap -m-4">
              {restData &&
                restData.map((restaurant) => {
                  return (
                    <div className="xl:w-1/4 md:w-1/2 p-4" key={restaurant.id}>
                      <div className="bg-gray-100 p-6 rounded-lg">
                        <h2 className="text-lg text-slate-800 font-medium title-font mb-4">
                          {restaurant.attributes.name}
                        </h2>
                        <Link href={`owner/restaurant`}>
                          <button
                            className="my-2 text-white bg-slate-500 border-0 py-1 md:py-2 px-2 md:px-4 focus:outline-none hover:bg-slate-600 rounded text-sm"
                            onClick={() => setResId(restaurant.id)}
                          >
                            Go to {restaurant.attributes.name} - {`>`}
                          </button>
                        </Link>
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
