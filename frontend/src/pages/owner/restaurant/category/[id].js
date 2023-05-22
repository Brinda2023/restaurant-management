import React, { useEffect, useState } from "react";
import NavBar from "../../../../../components/NavBar";
import Footer from "../../../../../components/Footer";
import { useRouter } from "next/router";
import axios from "axios";
import Link from "next/link";

const MenuItem = () => {
  const router = useRouter();
  const [categoryData, setCategoryData] = useState(null);
  const categoryId = router.query.id;
  console.log(categoryId);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    console.log(token);

    if (token && categoryId) {
      const options = {
        method: "GET",
        url: `http://localhost:1337/api/categories/${categoryId}?populate=*`,
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      };
      axios
        .request(options)
        .then((response) => {
          if (response.status == 200) {
            console.log(response.data);
            setCategoryData(response.data.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  useEffect(() => {
    fetchData();
  }, [categoryId]);

  console.log(categoryData);
  return (
    <>
      <NavBar />
      <div className="container mx-auto px-4">
        {JSON.stringify(categoryData)}
        <section className="text-gray-600 body-font">
          <div className="container px-5 md:py-24 mx-auto">
            <div className="flex flex-wrap w-full md:mb-20">
              <div className="lg:w-1/2 w-full mb-6 lg:mb-0">
                <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-400">
                  Category List - {categoryData && categoryData.attributes.name}
                </h1>
              </div>
            </div>
            <div className="h-1 w-21 bg-slate-200 rounded"></div>
            <div className="h-5"></div>
            <div className="flex flex-wrap -m-4">
              {categoryData &&
                categoryData.attributes.menu_items.data.map((menu_item) => {
                  return (
                    <div className="xl:w-1/4 md:w-1/2 p-4" key={menu_item.id}>
                      <div className="bg-gray-100 p-6 rounded-lg">
                        <h2 className="text-lg text-slate-800 font-medium title-font mb-4">
                          {menu_item.attributes.name}
                        </h2>
                        <Link href={`menu-item/${menu_item.id}`}>
                          <button className="my-2 text-white bg-slate-500 border-0 py-1 md:py-2 px-2 md:px-4 focus:outline-none hover:bg-slate-600 rounded text-sm">
                            Go to {menu_item.attributes.name} - {`>`}
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

export default MenuItem;
