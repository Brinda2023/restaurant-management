import React, { useState, useEffect } from "react";
import NavBar from "../../../components/NavBar";
import Footer from "../../../components/Footer";
import Link from "next/link";
import axios from "axios";
import edit_icon from "./../../assets/edit.svg";
import delete_icon from "./../../assets/delete.svg";
import create_icon from "./../../assets/create.png";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
let method;

const Index = () => {
  const [restData, setRestData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [value, setValue] = useState({});

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
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo.identifier === "brindad@zignuts.com") {
      setUserData({ role: { type: "authenticated" } });
    }
    fetchData();
  }, []);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = React.useRef(null);

  const onCreate = async () => {
    const token = localStorage.getItem("token");
    console.log(token);

    if (token) {
      console.log(value);
      const options = {
        method: "POST",
        url: `http://localhost:1337/api/restaurants`,
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        data: {
          data: {
            name: value.name,
            address: value.address,
            rating: value.rating,
            timing: value.timing,
            status: value.status,
            serviceType: value.serviceType,
            username: value.username,
            email: value.email,
            password: value.password,
          },
        },
      };
      axios
        .request(options)
        .then((response) => {
          if (response.status === 200) {
            onClose();
            setValue("");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const onUpdate = async (id) => {
    const token = localStorage.getItem("token");
    console.log(token);
    console.log(id);
    console.log(value);

    if (token) {
      const options = {
        method: "PUT",
        url: `http://localhost:1337/api/restaurants/${id}`,
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        data: {
          data: {
            name: value.name,
            address: value.address,
            rating: value.rating,
            timing: value.timing,
            status: value.status,
            serviceType: value.serviceType,
            username: value.username,
            email: value.email,
            password: value.password,
          },
        },
      };
      axios
        .request(options)
        .then((response) => {
          if (response.status === 200) {
            onClose();
            setValue("");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const onDelete = async (id) => {
    const token = localStorage.getItem("token");
    console.log(token);

    if (token) {
      const options = {
        method: "DELETE",
        url: `http://localhost:1337/api/restaurants/${id}`,
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      };
      axios
        .request(options)
        .then((response) => {
          if (response.status === 200) {
            onClose();
            setValue("");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  let modalBody;

  if (method === "Create") {
    modalBody = (
      <ModalBody pb={6}>
        <FormControl>
          <FormLabel>Name</FormLabel>
          <Input
            ref={initialRef}
            placeholder="Name"
            onChange={(e) => setValue({ ...value, name: e.target.value })}
            isRequired={true}
          />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel>Address</FormLabel>
          <Input
            placeholder="Address"
            onChange={(e) => setValue({ ...value, address: e.target.value })}
            isRequired={true}
          />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel>Rating</FormLabel>
          <Input
            placeholder="Rating"
            onChange={(e) => setValue({ ...value, rating: e.target.value })}
            isRequired={true}
          />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel>Timing</FormLabel>
          <Input
            placeholder="Timing"
            onChange={(e) => setValue({ ...value, timing: e.target.value })}
            isRequired={true}
          />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel>Status</FormLabel>
          <Input
            placeholder="Status"
            onChange={(e) => setValue({ ...value, status: e.target.value })}
            isRequired={true}
          />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel>SeviceType</FormLabel>
          <Input
            placeholder="ServiceType"
            onChange={(e) =>
              setValue({ ...value, serviceType: e.target.value })
            }
            isRequired={true}
          />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel>Username</FormLabel>
          <Input
            placeholder="Username"
            onChange={(e) => setValue({ ...value, username: e.target.value })}
            isRequired={true}
          />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel>Email</FormLabel>
          <Input
            placeholder="Email"
            onChange={(e) => setValue({ ...value, email: e.target.value })}
            isRequired={true}
          />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel>Password</FormLabel>
          <Input
            placeholder="Password"
            onChange={(e) => setValue({ ...value, password: e.target.value })}
            isRequired={true}
          />
        </FormControl>
      </ModalBody>
    );
  }
  if (method === "Update") {
    modalBody = (
      <ModalBody pb={6}>
        <FormControl>
          <FormLabel>Name</FormLabel>
          <Input
            ref={initialRef}
            placeholder="Name"
            onChange={(e) => setValue({ ...value, name: e.target.value })}
            isRequired={true}
          />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel>Address</FormLabel>
          <Input
            placeholder="Address"
            onChange={(e) => setValue({ ...value, address: e.target.value })}
            isRequired={true}
          />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel>Rating</FormLabel>
          <Input
            placeholder="Rating"
            onChange={(e) => setValue({ ...value, rating: e.target.value })}
            isRequired={true}
          />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel>Timing</FormLabel>
          <Input
            placeholder="Timing"
            onChange={(e) => setValue({ ...value, timing: e.target.value })}
            isRequired={true}
          />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel>Status</FormLabel>
          <Input
            placeholder="Status"
            onChange={(e) => setValue({ ...value, status: e.target.value })}
            isRequired={true}
          />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel>SeviceType</FormLabel>
          <Input
            placeholder="ServiceType"
            onChange={(e) =>
              setValue({ ...value, serviceType: e.target.value })
            }
            isRequired={true}
          />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel>Username</FormLabel>
          <Input
            placeholder="Username"
            onChange={(e) => setValue({ ...value, username: e.target.value })}
            isRequired={true}
          />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel>Email</FormLabel>
          <Input
            placeholder="Email"
            onChange={(e) => setValue({ ...value, email: e.target.value })}
            isRequired={true}
          />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel>Password</FormLabel>
          <Input
            placeholder="Password"
            onChange={(e) => setValue({ ...value, password: e.target.value })}
            isRequired={true}
          />
        </FormControl>
      </ModalBody>
    );
  }
  if (method === "Delete") {
    modalBody = (
      <ModalBody pb={6}>
        <Text fontWeight="bold" mb="1rem">
          Are you sure you want to Delete this?
        </Text>
      </ModalBody>
    );
  }

  return (
    <>
      <NavBar />
      <Modal
        initialFocusRef={initialRef}
        blockScrollOnMount={true}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{method} Restaurant</ModalHeader>
          <ModalCloseButton />
          {modalBody}

          <ModalFooter>
            <Button
              onClick={
                method === "Delete"
                  ? () => {
                      onDelete(value.id);
                    }
                  : method === "Create"
                  ? () => onCreate()
                  : () => {
                      onUpdate(value.id);
                    }
              }
              colorScheme="blue"
              mr={3}
            >
              {method}
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <div className="container mx-auto px-4">
        <section className="text-gray-600 body-font">
          <div className="container px-5 md:py-24 mx-auto">
            <div className="flex flex-wrap w-full justify-between md:mb-20">
              <div className="lg:w-1/2 w-full mb-6 lg:mb-0">
                <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-400">
                  Restaurant List
                </h1>
              </div>
              {userData && userData.role.type === "authenticated" ? (
                <div
                  onClick={() => {
                    method = "Create";
                    onOpen();
                  }}
                  className="w-10 h-10 bg-slate-500 hover:bg-slate-900 ml-5 inline-flex items-center justify-center rounded  hover:bg-white mb-4"
                >
                  <img src={create_icon.src} alt="" />
                </div>
              ) : null}
            </div>
            <div className="h-1 w-21 bg-slate-200 rounded"></div>
            <div className="h-5"></div>
            <div className="flex flex-wrap -m-4">
              {restData &&
                restData.map((restaurant) => {
                  return (
                    <div className="xl:w-1/4 md:w-1/2 p-4" key={restaurant.id}>
                      <div className="bg-gray-100 p-6 rounded-lg hover:bg-gray-200">
                        <div className="flex flex-wrap justify-between items-center">
                          <Link
                            href={`owner/restaurant`}
                            onClick={() => {
                              setResId(restaurant.id);
                            }}
                          >
                            <h2 className="text-lg text-slate-800 hover:bg-white rounded px-5 py-2 font-medium title-font">
                              {restaurant.attributes.name}
                            </h2>
                          </Link>
                          <div className="flex flex-wrap">
                            {userData &&
                            userData.role.type === "authenticated" ? (
                              <div
                                onClick={() => {
                                  method = "Update";
                                  setValue({ ...value, id: restaurant.id });
                                  onOpen();
                                }}
                                className="w-6 h-6 inline-flex items-center justify-center rounded  hover:bg-white mb-4"
                              >
                                <img src={edit_icon.src} alt="" />
                              </div>
                            ) : null}
                            {userData &&
                            userData.role.type === "authenticated" ? (
                              <div
                                onClick={() => {
                                  method = "Delete";
                                  // onDelete(restaurant.id);
                                  setValue({ ...value, id: restaurant.id });
                                  onOpen();
                                }}
                                className="w-6 h-6 ml-5 inline-flex items-center justify-center rounded  hover:bg-white mb-4"
                              >
                                <img src={delete_icon.src} alt="" />
                              </div>
                            ) : null}
                          </div>
                        </div>
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
