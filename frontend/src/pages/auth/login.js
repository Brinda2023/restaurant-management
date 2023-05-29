import React from "react";

// layout for page

import Auth from "../../layouts/Auth.js";
import { useRouter } from "next/router.js";
import { useFormik } from "formik";
import { Form } from "react-bootstrap";
import axios from "axios";

//Create login page for Retaurant Users and Admin
export default function Login() {
  const router = useRouter();
  const initialValues = {
    identifier: "",
    password: "",
  };
 
  
  const handleFormSubmit = async (values) => {
    localStorage.setItem("userInfo", JSON.stringify(values));
    await axios
      .post(`http://localhost:1337/api/auth/local`, {
        ...values,
      })
      .then((response) => {
        if (response.status === 200) {
          localStorage.setItem("token", response.data.jwt);
          const userInfo = JSON.parse(localStorage.getItem("userInfo"));
          if (userInfo.identifier === "brindad@zignuts.com") {
            router.push("/owner");
          } else {
            router.push("/owner/restaurant");
          }
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
    <>
      <div className="container mx-auto px-4 h-full">
        <div className="flex content-center items-center justify-center h-full">
          <div className="w-full lg:w-4/12 px-4">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-[#e2e8f0] border-0">
              <div className="rounded-t mb-0 px-6 py-6">
                <div className="text-center mb-3">
                  <h6 className="text-[#64748b] text-sm font-bold">Sign in</h6>
                </div>
                <hr className="mt-6 border-b-1 border-[#cbd5e1]" />
              </div>
              <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                <Form onSubmit={handleSubmit}>
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-[#475569] text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Email
                    </label>
                    <input
                      type="identifier"
                      onChange={handleChange}
                      value={values.identifier}
                      className="border-0 px-3 py-3 placeholder-[#cbd5e1] text-[#475569] bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Email"
                      required
                      id="identifier"
                      name="identifier"
                    />
                  </div>

                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-[#475569] text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      onChange={handleChange}
                      value={values.password}
                      className="border-0 px-3 py-3 placeholder-[#cbd5e1] text-[#475569] bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Password"
                      required
                      id="password"
                      name="password"
                    />
                  </div>
                  <div>
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        id="customCheckLogin"
                        type="checkbox"
                        className="form-checkbox border-0 rounded text-[#334155] ml-1 w-5 h-5 ease-linear transition-all duration-150"
                      />
                      <span className="ml-2 text-sm font-semibold text-[#475569]">
                        Remember me
                      </span>
                    </label>
                  </div>

                  <div className="text-center mt-6">
                    <button
                      className="bg-[#1e293b] text-white active:bg-[#475569] text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                      type="submit"
                    >
                      Sign In
                    </button>
                  </div>
                </Form>
              </div>
            </div>
            {/* <div className="flex flex-wrap mt-6 relative">
              <div className="w-1/2">
                <a
                  href="#pablo"
                  onClick={(e) => e.preventDefault()}
                  className="text-[#e2e8f0]"
                >
                  <small>Forgot password?</small>
                </a>
              </div>
              <div className="w-1/2 text-right">
                <Link href="/auth/register" className="text-[#e2e8f0]">
                  Create new account
                </Link>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
}

Login.layout = Auth;
