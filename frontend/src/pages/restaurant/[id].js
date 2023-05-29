import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
} from "@chakra-ui/react";
import axios from "axios";
let restaurantId;
import {
  Card,
  CardHeader,
  CardBody,
  Stack,
  Heading,
  Button,
  Text,
} from "@chakra-ui/react";
import NavBar from "../../../components/NavBar";
import Footer from "../../../components/Footer";

const Restaurant = ({ cart, addToCart, removeFromCart }) => {
  const router = useRouter();
  restaurantId = router.query.id;
  const [catData, setCatData] = useState();
  const fetchData = async () => {
    const { data } = await axios.get(
      `http://localhost:1337/api/categories?populate=*&filters[restaurant]=${router.query.id}`
    );
    setCatData(data);
    localStorage.setItem("resId", restaurantId);
  };
  useEffect(() => {
    if (restaurantId) {
      fetchData();
    }
  }, [restaurantId]);

  return (
    <>
      <NavBar />
      <div>
        {/* {JSON.stringify(catData)} */}
        <section className="text-gray-600 body-font">
          <div className="container px-5 py-24 mx-auto">
            <Accordion defaultIndex={[0]} allowMultiple>
              {catData &&
                catData.data.map((item1) => {
                  return (
                    // eslint-disable-next-line react/jsx-key
                    <AccordionItem key={item1.id}>
                      <h2>
                        <AccordionButton>
                          <Box as="span" flex="1" textAlign="left">
                            {item1.attributes.name}
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                      </h2>
                      <AccordionPanel pb={4}>
                        <Stack spacing="4">
                          {item1.attributes.menu_items.data.map((item2) => (
                            <Card key={item2.id} size="md">
                              <div className="flex flex-wrap justify-around">
                                <CardHeader margin="auto">
                                  <Heading size="md">
                                    {item2.attributes.name} - ₹
                                    {item2.attributes.price}
                                  </Heading>
                                </CardHeader>
                                <CardBody
                                  className="flex justify-end"
                                  alignItems="center"
                                  sx={{
                                    "& > button": {
                                      minW: "36px",
                                    },
                                  }}
                                >
                                  <Button
                                    onClick={() => {
                                      removeFromCart(item2.id,fetchData);
                                    }}
                                  >
                                    -
                                  </Button>
                                  {cart.filter(
                                    (c) => c.menuItem == item2.id
                                  ).length ? (
                                    cart.map((c) => {
                                      if (c.menuItem == item2.id) {
                                        return (
                                          <>
                                            <Text padding="18px">
                                              {c.quantity}
                                            </Text>
                                          </>
                                        );
                                      }
                                    })
                                  ) : (
                                    <>
                                      <Text padding="18px">0</Text>
                                    </>
                                  )}
                                  <Button
                                    onClick={() => {
                                      addToCart(
                                        item2.attributes.name,
                                        1,
                                        item2.attributes.price,
                                        item2.id,
                                        fetchData
                                      );
                                    }}
                                  >
                                    +
                                  </Button>
                                </CardBody>
                              </div>
                            </Card>
                          ))}
                        </Stack>
                      </AccordionPanel>
                    </AccordionItem>
                  );
                })}
              <button
                onClick={() => {
                  router.push("/checkout");
                }}
                className="flex ml-auto text-white bg-slate-800 border-0 py-2 my-10 mx-2 px-2 focus:outline-none hover:bg-slate-600 rounded"
              >
                Checkout
              </button>
            </Accordion>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};
export default Restaurant;
