import React, { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import child from "../../src/assets/child.jpeg";

const Profile = () => {
  const [token, setToken] = useState("");
  const [custData, setCustData] = useState(null);
  const [userData, setUserData] = useState(null);
  const fetchData = async () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo.identifier) {
      const { data } = await axios.get(
        `http://localhost:1337/api/users?populate=*&filters[email]=${userInfo.identifier}`
      );
      console.log("==================");
      console.log(data[0]);
      setUserData(data[0]);
    } else {
      console.log("==================");
      const { data } = await axios.get(
        `http://localhost:1337/api/customers?populate=*&filters[token]=${token}`
      );
      setCustData(data);
    }
  };
  useEffect(() => {
    if (typeof window !== undefined) {
      setToken(localStorage.getItem("token"));
    }
    if (token) {
      fetchData();
    }
  }, [token]);

  return (
    // <>
    //   <NavBar />
    //   <div>
    //     <section className="text-gray-600 body-font relative">
    //       <div className="container px-5 py-24 mx-auto">
    //         <div className="flex flex-col text-center w-full mb-12">
    //           <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">
    //             <br />
    //             <br />
    //             <br />
    //             {custData && custData.data[0].attributes.username}
    //           </h1>
    //           <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
    //             {custData && custData.data[0].attributes.token}
    //           </p>
    //         </div>
    //         <div className="lg:w-1/2 md:w-2/3 mx-auto">
    //           <div className="flex flex-wrap -m-2">
    //             <div className="p-2 w-full pt-8 mt-8 border-t border-gray-200 text-center">
    //               <a className="text-indigo-500">
    //                 {custData && custData.data[0].attributes.email}
    //               </a>
    //               <p className="leading-normal my-5">
    //                 {custData && custData.data[0].attributes.phone}
    //               </p>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </section>
    //   </div>
    //   <Footer />
    // </>
    <>
      <NavBar />
      <main className="profile-page">
        <section className="relative block h-[50vh]">
          <div className="absolute top-0 w-full h-full bg-center bg-cover bg-[url('https://images.unsplash.com/photo-1499336315816-097655dcfbda?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2710&q=80')]">
            <span
              id="blackOverlay"
              className="w-full h-full absolute opacity-50 bg-black"
            ></span>
          </div>
          <div
            className="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden h-16"
            style={{ transform: "translateZ(0)" }}
          >
            <svg
              className="absolute bottom-0 overflow-hidden"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              version="1.1"
              viewBox="0 0 2560 100"
              x="0"
              y="0"
            >
              <polygon
                className="text-[#e2e8f0] fill-current"
                points="2560 0 2560 100 0 100"
              ></polygon>
            </svg>
          </div>
        </section>
        <section className="relative py-16 bg-[#e2e8f0]">
          <div className="container mx-auto px-4">
            <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64">
              <div className="px-6">
                <div className="flex flex-wrap justify-center">
                  <div className="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center">
                    <div className="relative -m-1/2">
                      <img
                        className="h-auto w-auto rounded-full max-w-150-px  align-middle border-none shadow-xl -mt-[50%]"
                        src={child.src}
                        alt=""
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-4/12 px-4 lg:order-3 lg:text-right lg:self-center">
                    <div className="py-6 px-3 mt-32 sm:mt-0">
                      <button
                        className="bg-[#1e293b] active:bg-[#475569] uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150"
                        type="button"
                      >
                        Connect
                      </button>
                    </div>
                  </div>
                  <div className="w-full lg:w-4/12 px-4 lg:order-1">
                    <div className="flex justify-center py-4 lg:pt-4 pt-8">
                      <div className="mr-4 p-3 text-center">
                        <span className="text-xl font-bold block uppercase tracking-wide text-[#475569]">
                          22
                        </span>
                        <span className="text-sm text-[#9caabc]">Friends</span>
                      </div>
                      <div className="mr-4 p-3 text-center">
                        <span className="text-xl font-bold block uppercase tracking-wide text-[#475569]">
                          10
                        </span>
                        <span className="text-sm text-[#9caabc]">Photos</span>
                      </div>
                      <div className="lg:mr-4 p-3 text-center">
                        <span className="text-xl font-bold block uppercase tracking-wide text-[#475569]">
                          89
                        </span>
                        <span className="text-sm text-[#9caabc]">Comments</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center mt-12">
                  <h3 className="text-4xl font-semibold leading-normal mb-2 text-[#1e293b] mb-2">
                    {custData
                      ? custData && custData.data[0].attributes.username
                      : userData && userData.username}
                  </h3>
                  <div className="text-sm leading-normal mt-0 mb-2 text-[#9caabc] font-bold uppercase">
                    <i className="fas fa-map-marker-alt mr-2 text-lg text-[#9caabc]"></i>{" "}
                    LOS ANGELES, CALIFORNIA
                  </div>
                  <div className="mb-2 text-[#475569] mt-10">
                    <i className="fas fa-briefcase mr-2 text-lg text-[#9caabc]"></i>
                    {custData
                      ? custData && custData.data[0].attributes.email
                      : userData && userData.email}
                  </div>
                  <div className="mb-2 text-[#475569]">
                    <i className="fas fa-university mr-2 text-lg text-[#9caabc]"></i>
                    {custData
                      ? custData && custData.data[0].attributes.phone
                      : "NO PHONE"}
                  </div>
                </div>
                <div className="mt-10 py-10 border-t border-[#e2e8f0] text-center">
                  <div className="flex flex-wrap justify-center">
                    <div className="w-full lg:w-9/12 px-4">
                      <p className="mb-4 text-lg leading-relaxed text-[#1e293b]">
                        {custData
                          ? custData && custData.data[0].attributes.token
                          : token}
                      </p>
                      <a
                        href="#pablo"
                        className="font-normal text-[#29a6e9]"
                        onClick={(e) => e.preventDefault()}
                      >
                        Show more
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Profile;
