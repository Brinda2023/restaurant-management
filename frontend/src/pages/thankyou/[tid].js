import { Box, Heading, Text } from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Success() {
  const [data, setData] = useState(null);
  const router = useRouter();
  const id = router.query.tid;

  useEffect(() => {
    const fetchData = async (id) => {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `http://localhost:1337/api/orders/${router.query.tid}`,
        {
          headers: {
            Token: token,
          },
        }
      );
      setData(data.data.attributes);
    };
    fetchData(id);
  }, [id]);
  return (
    <Box textAlign="center" py={10} px={6}>
      <CheckCircleIcon boxSize={"50px"} color={"green.500"} />
      <Heading as="h2" size="xl" mt={6} mb={2}>
        Your order id {id}
      </Heading>
      <Text color={"gray.500"}>
        Details
        {data && JSON.stringify(data)}
      </Text>
    </Box>
  );
}
