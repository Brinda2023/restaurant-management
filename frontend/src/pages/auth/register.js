import Link from "next/link.js";
import { useRouter } from "next/router.js";
import React from "react";

// layout for page

import Auth from "../../layouts/Auth.js";
import { useFormik } from "formik";
import { Form } from "react-bootstrap";
import axios from "axios";

export default function Register() {
  const router = useRouter();
  const initialValues = {
    username: "",
    email: "",
    password: "",
    role: 7,
    confirmed: true,
  };
  const handleFormSubmit = async (values) => {
    const options = {
      method: "POST",
      url: `http://localhost:1337/api/restaurant/orders`,
      headers: {
        Authorization: `Bearer d6e1c76d2b7e7564f577a72afcd37ffbafee5bd87aa3aa9a6f78872f17e0d894eda8b1e9e78c9dba453c86a700c06e2d0beb9e546b70f5ec846a52e0800fd2505b658806fe5ad57d23fc7d7dfbe0ef382ee0d0151895daac57be0273ed0638da4bccd375679d592eb3c44b53b12328b59343f21673464fa7549b4c5f21812e45`,
        "Content-Type": "application/json",
      },
      data: {
        ...values,
      },
    };
    axios
      .request(options)
      .then((response) => {
        if (response.status === 200) {
          localStorage.setItem("token", response.data.jwt);
          router.push("/auth/login");
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
          <div className="w-full lg:w-6/12 px-4">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-[#e2e8f0] border-0">
              <div className="rounded-t mb-0 px-6 py-6">
                <div className="text-center mb-3">
                  <h6 className="text-[#64748b] text-sm font-bold">Sign up</h6>
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
                      Username
                    </label>
                    <input
                      type="username"
                      onChange={handleChange}
                      value={values.username}
                      className="border-0 px-3 py-3 placeholder-[#cbd5e1] text-[#475569] bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Username"
                      required
                      id="username"
                      name="username"
                    />
                  </div>

                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-[#475569] text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      onChange={handleChange}
                      value={values.email}
                      className="border-0 px-3 py-3 placeholder-[#cbd5e1] text-[#475569] bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Email"
                      required
                      id="email"
                      name="email"
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
                        I agree with the{" "}
                        <a
                          href="#pablo"
                          className="text-[#28a5e9]"
                          onClick={(e) => e.preventDefault()}
                        >
                          Privacy Policy
                        </a>
                      </span>
                    </label>
                  </div>

                  <div className="text-center mt-6">
                    <button
                      className="bg-[#1e293b] text-white active:bg-[#475569] text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                      type="submit"
                    >
                      Create Account
                    </button>
                  </div>
                </Form>
              </div>
            </div>
            <div className="flex flex-wrap mt-6 relative">
              <div className="w-full text-center">
                <Link href="/auth/login" className="text-[#e2e8f0]">
                  Already Account?
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

Register.layout = Auth;
