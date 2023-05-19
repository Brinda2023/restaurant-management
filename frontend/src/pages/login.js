import React from "react";
import { useRouter } from "next/router";
import { Form, Toast } from "react-bootstrap";
import { useFormik } from "formik";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";

import axios from "axios";

const Login = () => {
  const router = useRouter();
  const initialValues = {
    phone: "",
    email: "",
  };
  const handleFormSubmit = async (values) => {
    localStorage.setItem("userInfo", JSON.stringify(values));
    await axios
      .post(`http://localhost:1337/api/customers/login`, {
        data: { ...values },
      })
      .then((response) => {
        if (response.status === 200) {
          router.push("/verifyotp");
        }
      })
      .catch((error) => {
        Toast({
          title: `${JSON.stringify(error)}`,
          status: "error",
          duration: 1000,
        });
      });
  };
  const { handleSubmit, handleChange, values } = useFormik({
    initialValues,
    onSubmit: handleFormSubmit,
  });
  return (
    <>
      <NavBar />
      <div>
        <section className="text-gray-600 body-font relative">
          <div className="container px-5 py-24 mx-auto">
            <div className="flex flex-col text-center w-full mb-12">
              <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">
                LogIn
              </h1>
              <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
                Get otp on your registered number & email
              </p>
            </div>
            <Form onSubmit={handleSubmit}>
              <div className="lg:w-1/2 md:w-2/3 mx-auto">
                <div className="flex flex-wrap -m-2">
                  <div className="p-2 w-full">
                    <div className="relative">
                      <label
                        for="phone"
                        className="leading-7 text-sm text-gray-600"
                      >
                        Phone
                      </label>
                      <input
                        type="phone"
                        onChange={handleChange}
                        value={values.phone}
                        id="phone"
                        name="phone"
                        required
                        className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                      />
                    </div>
                  </div>
                  <div className="p-2 w-full">
                    <div className="relative">
                      <label
                        for="email"
                        className="leading-7 text-sm text-gray-600"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        onChange={handleChange}
                        value={values.email}
                        id="email"
                        name="email"
                        required
                        className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                      />
                    </div>
                  </div>
                  <div className="p-2 w-full">
                    <button
                      type="submit"
                      className="flex mx-auto text-white bg-slate-800 border-0 my-20 py-2 px-8 focus:outline-none hover:bg-slate-600 rounded text-lg"
                    >
                      Get OTP
                    </button>
                  </div>
                </div>
              </div>
            </Form>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Login;
