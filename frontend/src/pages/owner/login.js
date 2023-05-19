import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import React from "react";
import { Form } from "react-bootstrap";

const Login = () => {
  const router = useRouter();
  const initialValues = {
    username: "",
    password: "",
  };
  const handleFormSubmit = async (values) => {
    await axios
      .post(`http://localhost:1337/api/auth/local`, {
        data: { ...values },
      })
      .then((response) => {
        if (response.status === 200) {
          localStorage.setItem("userInfo", JSON.stringify(values));
          localStorage.setItem("token", response.data.token);
          router.push("/dashboard");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const { handleSubmit, handleChange, values } = useFormik({
    initialValues,
    onSubmit: handleFormSubmit,
  });
  return (
    <div>
      <section className="text-gray-600 body-font relative">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-col text-center w-full mb-12">
            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">
              LogIn
            </h1>
            <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
              Login owner
            </p>
          </div>
          <Form onSubmit={handleSubmit}>
            <div className="lg:w-1/2 md:w-2/3 mx-auto">
              <div className="flex flex-wrap -m-2">
                <div className="p-2 w-full">
                  <div className="relative">
                    <label
                      for="username"
                      className="leading-7 text-sm text-gray-600"
                    >
                      Username
                    </label>
                    <input
                      type="username"
                      onChange={handleChange}
                      value={values.username}
                      id="username"
                      name="username"
                      required
                      className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                    />
                  </div>
                </div>
                <div className="p-2 w-full">
                  <div className="relative">
                    <label
                      for="password"
                      className="leading-7 text-sm text-gray-600"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      onChange={handleChange}
                      value={values.password}
                      id="password"
                      name="password"
                      required
                      className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                    />
                  </div>
                </div>
                <div className="p-2 w-full">
                  <button
                    type="submit"
                    className="flex mx-auto text-white bg-indigo-500 border-0 my-20 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
                  >
                    Log In
                  </button>
                </div>
              </div>
            </div>
          </Form>
        </div>
      </section>
    </div>
  );
};

export default Login;
