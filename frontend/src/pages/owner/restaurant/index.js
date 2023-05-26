import React, { useState, useEffect } from "react";
import NavBar from "../../../../components/NavBar";
import Footer from "../../../../components/Footer";
import Link from "next/link";
import axios from "axios";
import edit_icon from "../../../assets/edit.svg";
import delete_icon from "../../../assets/delete.svg";
import create_icon from "../../../assets/create.png";
import {
  Box,
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
  Select,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
  useMultiStyleConfig,
  useTab,
} from "@chakra-ui/react";
let name;
let method;

const Index = () => {
  const [restaurantId, setRestaurantId] = useState(null);
  const [role, setRole] = useState(null);
  const [restData, setRestData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [value, setValue] = useState({});

  const fetchUser = async () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
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
        console.log(response.data);
        setUserData(response.data);
        setRestaurantId(response.data.restaurant.id);
        localStorage.setItem("resId", userData && userData.restaurant.id);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const fetchData = async () => {
    const { data } = await axios(
      `http://localhost:1337/api/restaurants/${restaurantId}?populate=*`,{
        method:'GET',
        headers:{
          Authorization:"Bearer "+localStorage.getItem('token')
        }
      }
    );
    setRestData(data.data);
  };
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo.identifier !== "brindad@zignuts.com") {
      fetchUser();
    } else {
      setRestaurantId(localStorage.getItem("resId"));
      setUserData({ role: { type: "authenticated" } });
    }
    if (restaurantId) {
      fetchData();
    }
  }, [restaurantId]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = React.useRef(null);

  const onCreate = async () => {
    const token = localStorage.getItem("token");
    console.log(token);

    if (token) {
      if (name === "Category") {
        console.log(value);
        const options = {
          method: "POST",
          url: `http://localhost:1337/api/categories`,
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
          data: {
            data: {
              name: value.name,
              restaurant: restaurantId,
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
      if (name === "User") {
        console.log(value);
        const options = {
          method: "POST",
          url: `http://localhost:1337/api/users`,
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
          data: {
            username: value.username,
            email: value.email,
            password: value.password,
            role: value.role,
            restaurant: restaurantId,
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
        onClose();
        setValue("");
      }
    }
  };

  const onUpdate = async (id) => {
    const token = localStorage.getItem("token");
    console.log(token);
    console.log(id);
    console.log(value);

    if (token) {
      if (name === "Category") {
        const options = {
          method: "PUT",
          url: `http://localhost:1337/api/categories/${id}`,
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
          data: {
            data: { name: value.name },
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
      if (name === "Order") {
        const options = {
          method: "PUT",
          url: `http://localhost:1337/api/orders/${id}`,
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
          data: {
            data: { status: value.status },
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
      if (name === "User") {
        const options = {
          method: "PUT",
          url: `http://localhost:1337/api/users/${id}`,
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
          data: {
            role: value.role,
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
    }
  };

  const onDelete = async (id) => {
    const token = localStorage.getItem("token");
    console.log(token);

    if (token) {
      if (name === "Category") {
        const options = {
          method: "DELETE",
          url: `http://localhost:1337/api/categories/${id}`,
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
    }
  };

  let modalBody;

  if (method === "Create" && name === "Category") {
    modalBody = (
      <ModalBody pb={6}>
        <FormControl>
          <FormLabel>Name</FormLabel>
          <Input
            ref={initialRef}
            placeholder="Name"
            onChange={(e) => setValue({ name: e.target.value })}
            isRequired={true}
          />
        </FormControl>
      </ModalBody>
    );
  }
  if (method === "Update" && name === "Category") {
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
      </ModalBody>
    );
  }
  if (method === "Delete" && name === "Category") {
    modalBody = (
      <ModalBody pb={6}>
        <Text fontWeight="bold" mb="1rem">
          Are you sure you want to Delete this?
        </Text>
      </ModalBody>
    );
  }
  if (method === "Update" && name === "Order") {
    modalBody = (
      <ModalBody pb={6}>
        <FormControl>
          <FormLabel>Status</FormLabel>
          <Input
            ref={initialRef}
            placeholder="Status"
            onChange={(e) => setValue({ ...value, status: e.target.value })}
            isRequired={true}
          />
        </FormControl>
      </ModalBody>
    );
  }
  if (method === "Create" && name === "User") {
    modalBody = (
      <ModalBody pb={6}>
        <FormControl>
          <FormLabel>Username</FormLabel>
          <Input
            ref={initialRef}
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
        <FormControl mt={4}>
          <FormLabel>Role</FormLabel>
          <Select
            placeholder="Select option"
            onChange={(e) => setValue({ ...value, role: e.target.value })}
          >
            {role &&
              role.map((r) => {
                if (userData && userData.role.type === "restaurant_owner") {
                  if (
                    r.type !== "authenticated" &&
                    r.type !== userData.role.type &&
                    r.type !== "public"
                  ) {
                    return (
                      <option value={r.id} key={r.id}>
                        {r.type}
                      </option>
                    );
                  }
                } else if (userData && userData.role.type === "authenticated") {
                  console.log(userData && userData.role.type);
                  if (r.type !== userData.role.type && r.type !== "public") {
                    return (
                      <option value={r.id} key={r.id}>
                        {r.type}
                      </option>
                    );
                  }
                } else if (
                  userData &&
                  userData.role.type === "restaurant_manager"
                ) {
                  if (r.type === "restaurant_worker") {
                    return (
                      <option value={r.id} key={r.id}>
                        {r.type}
                      </option>
                    );
                  }
                }
              })}
          </Select>
        </FormControl>
      </ModalBody>
    );
  }
  if (method === "Update" && name === "User") {
    modalBody = (
      <ModalBody pb={6}>
        <FormControl>
          <FormLabel>Role</FormLabel>
          <Select
            placeholder="Select option"
            onChange={(e) => setValue({ ...value, role: e.target.value })}
          >
            {role &&
              role.map((r) => {
                if (userData && userData.role.type === "restaurant_owner") {
                  if (
                    r.type !== "authenticated" &&
                    r.type !== userData.role.type &&
                    r.type !== "public"
                  ) {
                    return (
                      <option value={r.id} key={r.id}>
                        {r.type}
                      </option>
                    );
                  }
                } else if (userData && userData.role.type === "authenticated") {
                  console.log(userData && userData.role.type);
                  if (r.type !== userData.role.type && r.type !== "public") {
                    return (
                      <option value={r.id} key={r.id}>
                        {r.type}
                      </option>
                    );
                  }
                } else if (
                  userData &&
                  userData.role.type === "restaurant_manager"
                ) {
                  if (r.type === "restaurant_worker") {
                    return (
                      <option value={r.id} key={r.id}>
                        {r.type}
                      </option>
                    );
                  }
                }
              })}
          </Select>
        </FormControl>
      </ModalBody>
    );
  }

  const fetchRole = async () => {
    const token = localStorage.getItem("token");
    const options = {
      method: "GET",
      url: `http://localhost:1337/api/users-permissions/roles`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    };
    axios
      .request(options)
      .then((response) => {
        console.log(response.data.roles);
        console.log(userData);
        setRole(response.data.roles);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // eslint-disable-next-line react/display-name
  const CustomTab = React.forwardRef((props, ref) => {
    // 1. Reuse the `useTab` hook
    const tabProps = useTab({ ...props, ref });
    const isSelected = !!tabProps["aria-selected"];

    // 2. Hook into the Tabs `size`, `variant`, props
    const styles = useMultiStyleConfig("Tabs", tabProps);

    return (
      <Button __css={styles.tab} {...tabProps}>
        <Box as="span" mr="2">
          {isSelected ? "😎" : "😐"}
        </Box>
        {tabProps.children}
      </Button>
    );
  });
  console.log(userData && userData);
  return (
    <>
      <NavBar />
      <Tabs variant="enclosed" size="lg" isFitted>
        <TabList className="sticky top-24 z-10 bg-gray-100">
          <CustomTab>Category</CustomTab>
          <CustomTab>Order</CustomTab>
          <CustomTab>Customer</CustomTab>
          <CustomTab>User</CustomTab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <div className="container mx-auto min-h-screen px-4">
              <section className="text-gray-600 body-font">
                <div className="container px-5 md:py-24 mx-auto">
                  <div className="flex flex-wrap justify-between w-full ">
                    <div className="lg:w-3/4 mb-6 lg:mb-0">
                      <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-400">
                        Category
                      </h1>
                    </div>
                    {(userData && userData.role.type === "restaurant_owner") ||
                    (userData && userData.role.type === "restaurant_manager") ||
                    (userData && userData.role.type === "authenticated") ? (
                      <div
                        onClick={() => {
                          method = "Create";
                          name = "Category";
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
                    {restData &&
                      restData.attributes.categories.data.map((category) => {
                        return (
                          <div
                            className="xl:w-1/4 md:w-1/2 p-4"
                            key={category.id}
                          >
                            <div className="bg-gray-100 p-6 rounded-lg hover:bg-gray-200">
                              <div className="flex flex-wrap justify-between items-center">
                                <Link
                                  href={`restaurant/category/${category.id}`}
                                >
                                  <h2 className="text-lg text-slate-800 hover:bg-white rounded px-5 py-2 font-medium title-font">
                                    {category.attributes.name}
                                  </h2>
                                </Link>
                                <div className="flex flex-wrap">
                                  {(userData &&
                                    userData.role.type ===
                                      "restaurant_owner") ||
                                  (userData &&
                                    userData.role.type ===
                                      "restaurant_manager") ||
                                  (userData &&
                                    userData.role.type === "authenticated") ? (
                                    <div
                                      onClick={() => {
                                        method = "Update";
                                        name = "Category";
                                        setValue({ ...value, id: category.id });
                                        onOpen();
                                      }}
                                      className="w-6 h-6 inline-flex items-center justify-center rounded  hover:bg-white mb-4"
                                    >
                                      <img src={edit_icon.src} alt="" />
                                    </div>
                                  ) : null}
                                  {(userData &&
                                    userData.role.type ===
                                      "restaurant_owner") ||
                                  (userData &&
                                    userData.role.type ===
                                      "restaurant_manager") ||
                                  (userData &&
                                    userData.role.type === "authenticated") ? (
                                    <div
                                      onClick={() => {
                                        method = "Delete";
                                        name = "Category";
                                        setValue({ ...value, id: category.id });
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
          </TabPanel>
          <TabPanel>
            <div className="container mx-auto min-h-screen px-4">
              <section className="text-gray-600 body-font">
                <div className="container px-5 md:py-24 mx-auto">
                  <div className="lg:w-3/4 mb-6 lg:mb-0">
                    <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-400">
                      Order
                    </h1>
                  </div>

                  <div className="h-1 w-21 bg-slate-200 rounded"></div>
                  <div className="h-5"></div>
                  <div className="flex flex-wrap -m-4">
                    {restData &&
                      restData.attributes.orders.data.map((order) => {
                        return (
                          <div className="xl:w-1/4 md:w-1/2 p-4" key={order.id}>
                            <div className="bg-gray-100 p-6 rounded-lg hover:bg-gray-200">
                              <div className="flex flex-wrap justify-between ">
                                <h2 className="text-lg text-slate-800 font-medium title-font">
                                  Status - {order.attributes.status}
                                  <br />
                                  Amount - {order.attributes.totalAmount}
                                  <br />
                                  Items - {order.attributes.totalQuantity}
                                </h2>
                                {(userData &&
                                  userData.role.type === "restaurant_worker") ||
                                (userData &&
                                  userData.role.type === "authenticated") ? (
                                  <div
                                    onClick={() => {
                                      method = "Update";
                                      name = "Order";
                                      setValue({ ...value, id: order.id });
                                      onOpen();
                                    }}
                                    className="w-6 h-6 inline-flex items-center justify-center rounded  hover:bg-white mb-4"
                                  >
                                    <img src={edit_icon.src} alt="" />
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </section>
            </div>
          </TabPanel>
          <TabPanel>
            <div className="container mx-auto min-h-screen px-4">
              <section className="text-gray-600 body-font">
                <div className="container px-5 md:py-24 mx-auto">
                  <div className="lg:w-3/4 mb-6 lg:mb-0">
                    <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-400">
                      Customer
                    </h1>
                  </div>

                  <div className="h-1 w-21 bg-slate-200 rounded"></div>
                  <div className="h-5"></div>
                  <div className="flex flex-wrap -m-4">
                    {restData &&
                      restData.attributes.customers.data.map((customer) => {
                        return (
                          <div
                            className="xl:w-1/4 md:w-1/2 p-4"
                            key={customer.id}
                          >
                            <div className="bg-gray-100 p-6 rounded-lg hover:bg-gray-200">
                              <h2 className="text-lg text-slate-800 font-medium title-font">
                                {customer.attributes.username}
                              </h2>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </section>
            </div>
          </TabPanel>
          <TabPanel>
            <div className="container mx-auto min-h-screen px-4">
              <section className="text-gray-600 body-font">
                <div className="container px-5 md:py-24 mx-auto">
                  <div className="flex flex-wrap justify-between w-full">
                    <div className="lg:w-3/4 mb-6 lg:mb-0">
                      <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-400">
                        User
                      </h1>
                    </div>
                    {(userData && userData.role.type === "restaurant_owner") ||
                    (userData && userData.role.type === "authenticated") ? (
                      <div
                        onClick={() => {
                          fetchRole();
                          method = "Create";
                          name = "User";
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
                    {restData &&
                      restData.attributes.users.data.map((user) => {
                        return (
                          <div className="xl:w-1/4 md:w-1/2 p-4" key={user.id}>
                            <div className="bg-gray-100 p-6 rounded-lg hover:bg-gray-200">
                              <div className="flex flex-wrap justify-between">
                                <h2 className="text-lg text-slate-800 font-medium title-font">
                                  {user.attributes.username}
                                </h2>
                                {(userData &&
                                  userData.role.type === "restaurant_owner") ||
                                (userData &&
                                  userData.role.type === "authenticated") ? (
                                  <div
                                    onClick={() => {
                                      fetchRole();
                                      method = "Update";
                                      name = "User";
                                      setValue({ ...value, id: user.id });
                                      onOpen();
                                    }}
                                    className="w-6 h-6 inline-flex items-center justify-center rounded  hover:bg-white"
                                  >
                                    <img src={edit_icon.src} alt="" />
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </section>
            </div>
          </TabPanel>
        </TabPanels>
      </Tabs>
      <Modal
        initialFocusRef={initialRef}
        blockScrollOnMount={true}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {method} {name}
          </ModalHeader>
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
      <Footer />
    </>
  );
};

export default Index;
