import React from "react";
import { useRouter } from "next/router";
import { PinInput, PinInputField, HStack } from "@chakra-ui/react";
import { Form, Toast } from "react-bootstrap";
import axios from "axios";
import { useState } from "react";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";

const VerifyOtp = () => {
  const router = useRouter();
  const [otp, setOtp] = useState(0);
  const handleFormSubmit = async (e) => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    e.preventDefault();
    await axios
      .post(`http://localhost:1337/api/customers/verify`, {
        data: {
          email: userInfo.email,
          otp: parseInt(otp),
        },
      })
      .then((response) => {
        if (response.status === 200) {
          localStorage.setItem("token", response.data.token);
          // const resId = localStorage.getItem("resId");
          // router.push("/restaurant/"+resId);
          router.push("/checkout");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <>
      <NavBar />
      <div>
        <section className="text-gray-600 body-font relative">
          <Form onSubmit={handleFormSubmit}>
            <div className="container px-5 py-24 mx-auto">
              <div
                className="flex flex-col text-center w-full mb-12"
                style={{ alignItems: "center" }}
              >
                <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">
                  OTP
                </h1>
                <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
                  {
                    "You've received your login OTP on your registered Email & Phone"
                  }
                </p>
                <HStack className="my-10">
                  <PinInput onChange={(e) => setOtp(e)}>
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                  </PinInput>
                </HStack>
              </div>
              <div className="p-2 w-full">
                <button
                  disabled={otp.length !== 6}
                  className="flex mx-auto text-white bg-slate-800 border-0 my-15 py-2 px-8 focus:outline-none hover:bg-slate-600 rounded text-lg"
                >
                  Login
                </button>
              </div>
            </div>
          </Form>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default VerifyOtp;
