import React, { useEffect, useState } from "react";
import NavBar from "../../../../../components/NavBar";
import Footer from "../../../../../components/Footer";
import { useRouter } from "next/router";
import axios from "axios";
import edit_icon from "./../../../../assets/edit.svg";
import delete_icon from "./../../../../assets/delete.svg";
import create_icon from "./../../../../assets/create.png";
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

// Create Menu Item CRUD page
const MenuItem = () => {
  const router = useRouter();
  const [categoryData, setCategoryData] = useState(null);
  const categoryId = router.query.id;
  const [userData, setUserData] = useState(null);
  const [value, setValue] = useState({});

  // Fetch Current User
  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    const options = {
      method: "GET",
      url: `http://localhost:1337/api/users/me?populate=*`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    };
    axios
      .request(options)
      .then((response) => {
        setUserData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Fetch all menu items of clicked category
  const fetchData = async () => {
    const token = localStorage.getItem("token");

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
            setCategoryData(response.data.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  // Fetch Data
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo.identifier !== "brindad@zignuts.com") {
      fetchUser();
    } else {
      setUserData({ role: { type: "authenticated" } });
    }
    if (categoryId) {
      fetchData();
    }
  }, [categoryId]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = React.useRef(null);

  // Create Menu item
  const onCreate = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      const options = {
        method: "POST",
        url: `http://localhost:1337/api/menu-items`,
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        data: {
          data: {
            name: value.name,
            price: value.price,
            categoryId: categoryId,
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

  // Update Menu item
  const onUpdate = async (id) => {
    const token = localStorage.getItem("token");

    if (token) {
      const options = {
        method: "PUT",
        url: `http://localhost:1337/api/menu-items/${id}`,
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        data: {
          data: { name: value.name, price: value.price },
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


  // Delete Menu-item
  const onDelete = async (id) => {
    const token = localStorage.getItem("token");

    if (token) {
      const options = {
        method: "DELETE",
        url: `http://localhost:1337/api/menu-items/${id}`,
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


  // Create Model body
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
        <FormControl mt={6}>
          <FormLabel>Price</FormLabel>
          <Input
            placeholder="Price"
            onChange={(e) => setValue({ ...value, price: e.target.value })}
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
          <FormLabel>Price</FormLabel>
          <Input
            placeholder="Price"
            onChange={(e) => setValue({ ...value, price: e.target.value })}
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
          <ModalHeader>{method} Menu-Item</ModalHeader>
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
            <div className="flex flex-wrap justify-between w-full md:mb-20">
              <div className="lg:w-3/4 mb-6 lg:mb-0">
                <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-400">
                  Menu-Items of {categoryData && categoryData.attributes.name}
                </h1>
              </div>
              {(userData && userData.role.type === "restaurant_owner") ||
              (userData && userData.role.type === "restaurant_manager") ||
              (userData && userData.role.type === "authenticated") ? (
                <div
                  onClick={() => {
                    method = "Create";
                    onOpen();
                  }}
                  className="w-10 h-10 bg-slate-500 hover:bg-black ml-5 inline-flex items-center justify-center rounded  hover:bg-white mb-4"
                >
                  <img src={create_icon.src} alt="" />
                </div>
              ) : null}
            </div>
            <div className="h-1 w-21 bg-slate-200 rounded"></div>
            <div className="h-5"></div>
            <div className="flex flex-wrap -m-4">
              {categoryData &&
                categoryData.attributes.menu_items.data.map((menu_item) => {
                  return (
                    <div className="xl:w-1/4 md:w-1/2 p-4" key={menu_item.id}>
                      <div className="bg-gray-100 p-6 rounded-lg hover:bg-gray-200">
                        <div className="flex flex-wrap justify-between items-center">
                          {/* <Link href={`menu-item/${menu_item.id}`}> */}
                          <h2 className="text-lg text-slate-800 hover:bg-white rounded px-5 py-2 font-medium title-font">
                            {menu_item.attributes.name} - ₹
                            {menu_item.attributes.price}
                          </h2>
                          {/* </Link> */}
                          <div className="flex flex-wrap">
                            {(userData &&
                              userData.role.type === "restaurant_owner") ||
                            (userData &&
                              userData.role.type === "restaurant_manager") ||
                            (userData &&
                              userData.role.type === "authenticated") ? (
                              <div
                                onClick={() => {
                                  method = "Update";
                                  setValue({ ...value, id: menu_item.id });
                                  onOpen();
                                }}
                                className="w-6 h-6 inline-flex items-center justify-center rounded  hover:bg-white mb-4"
                              >
                                <img src={edit_icon.src} alt="" />
                              </div>
                            ) : null}
                            {(userData &&
                              userData.role.type === "restaurant_owner") ||
                            (userData &&
                              userData.role.type === "restaurant_manager") ||
                            (userData &&
                              userData.role.type === "authenticated") ? (
                              <div
                                onClick={() => {
                                  method = "Delete";
                                  setValue({ ...value, id: menu_item.id });
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

export default MenuItem;
