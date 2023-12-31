import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { defineStyle, defineStyleConfig } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";
import Pagination from "../page/Pagination";
import { DetectLoginContext } from "../component/LoginProvider";

function InquiryList(props) {
  const { token, handleLogout, loginInfo, validateToken } =
    useContext(DetectLoginContext);

  const [inquiryList, setInquiryList] = useState(null);
  const [pageInfo, setPageInfo] = useState([]);
  const [inquiryNotice, setInquiryNotice] = useState(null);

  const navigate = useNavigate();
  const [params] = useSearchParams();
  const location = useLocation();

  useEffect(() => {
    if (loginInfo !== null) {
      axios
        .post("/api/inquiry/list?" + params, {
          login_member_id: loginInfo.member_id,
          role_name: loginInfo.role_name,
        })
        .then((response) => {
          setInquiryList(response.data.inquiryList);
          setPageInfo(response.data.pageInfo);
          setInquiryNotice(response.data.inquiryNotice);
        })
        .catch();
    }
  }, [location, params, loginInfo]);

  // if (inquiryList == null || loginInfo == null) {
  //   return <Spinner />;
  // }

  // 로그인 안했을시 로그인화면으로 이동
  if (!token.detectLogin) {
    return (
      <Box w={"500px"} m={"auto"} mt={25} h={"300px"}>
        <Alert
          // colorScheme="red"
          status="warning"
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          height="100%"
        >
          <AlertIcon boxSize="40px" mr={0} />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            로그인이 필요한 서비스입니다!
          </AlertTitle>
          <AlertDescription maxWidth="sm">
            문의게시판의 글을 보시려면 로그인 하세요.
          </AlertDescription>
          <Button mt={5} onClick={() => navigate("/member/login")}>
            로그인
          </Button>
        </Alert>
      </Box>
    );
  }

  return (
    <Box width={"1000px"} m={"auto"} mt={10} h={"800px"}>
      <Box>
        <Box>
          <Heading mb={2}>문의게시판</Heading>
          <Flex
            width={"99%"}
            justifyContent={"space-between"}
            alignItems={"center"}
            mb={2}
          >
            <Box
              mt={3}
              fontSize={"0.9rem"}
              fontStyle={"italic"}
              color={"gray.500"}
            >
              문의하실 사항이 있으면 말씀해주세요
            </Box>
            {loginInfo && (
              <Button
                colorScheme="red"
                variant={"outline"}
                onClick={() => navigate("/inquiry/write")}
              >
                문의하기
              </Button>
            )}
          </Flex>
          <Divider />
        </Box>

        <Table mb={5}>
          <Thead>
            <Tr>
              <Th textAlign={"center"}>번호</Th>
              <Th textAlign={"center"}>카테고리</Th>
              <Th textAlign={"center"}>제목</Th>
              <Th textAlign={"center"}>작성자</Th>
              <Th textAlign={"center"}>작성일자</Th>
              <Th textAlign={"center"}>답변상태</Th>
            </Tr>
          </Thead>
          <Tbody>
            {inquiryNotice &&
              inquiryNotice.map((notice) => (
                <Tr
                  backgroundColor={"purple.100"}
                  _hover={{
                    cursor: "pointer",
                    backgroundColor: "purple.200",
                  }}
                  key={notice.id}
                  onClick={() => navigate("/inquiry/" + notice.id)}
                >
                  <Th textAlign={"center"}>notice</Th>
                  <Th textAlign={"center"}>공지사항</Th>
                  <Th textAlign={"center"}>{notice.title}</Th>
                  <Th textAlign={"center"}>관리자</Th>
                  <Th textAlign={"center"}>{notice.withOutTime}</Th>
                  <Th textAlign={"center"}>--</Th>
                </Tr>
              ))}
            {inquiryList &&
              inquiryList.map((inquiry) => (
                <Tr
                  textAlign={"center"}
                  key={inquiry.id}
                  _hover={{
                    cursor: "pointer",
                    backgroundColor: "gray.100",
                  }}
                  onClick={() => navigate("/inquiry/" + inquiry.id)}
                >
                  <Td textAlign={"center"}>{inquiry.id}</Td>
                  <Td textAlign={"center"}>{inquiry.inquiry_category}</Td>
                  <Td textAlign={"center"}>{inquiry.title}</Td>
                  <Td textAlign={"center"}>{inquiry.inquiry_member_id}</Td>
                  <Td textAlign={"center"}>{inquiry.ago}</Td>
                  {(inquiry.answer_status === "답변완료" && (
                    <Td
                      backgroundColor={"green.300"}
                      textAlign={"center"}
                      fontWeight="bold"
                    >
                      {inquiry.answer_status}
                    </Td>
                  )) || (
                    <Td
                      backgroundColor={"orange.300"}
                      textAlign={"center"}
                      fontWeight="bold"
                    >
                      {inquiry.answer_status}
                    </Td>
                  )}
                </Tr>
              ))}
          </Tbody>
        </Table>
        <Pagination pageInfo={pageInfo} />
      </Box>
    </Box>
  );
}

export default InquiryList;
