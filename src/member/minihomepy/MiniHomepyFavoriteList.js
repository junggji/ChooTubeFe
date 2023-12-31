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
  useDisclosure,
  useToast,
  Text,
  Flex,
  Tooltip,
  WrapItem,
  Image,
  Spinner,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { config } from "../config/apikey";
import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons";
import YoutubeInfo from "../../component/YoutubeInfo";
import { useNavigate } from "react-router-dom";

export function MiniHomepyFavoriteList({
  member_id,
  loginMember,
  youtuberInfo,
  addYoutuber,
  setAddYoutuber,
  setIsYoutuberDeleted,
}) {
  const API_KEY = config.apikey;

  const [isSubmitting, setIsSubmitting] = useState(false);
  let toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toolModal = useDisclosure();
  const navigate = useNavigate();
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  function handleAddYoutuberList() {
    setIsSubmitting(true);
    axios
      .get("https://youtube.googleapis.com/youtube/v3/channels", {
        params: {
          part: "snippet,statistics",
          id: addYoutuber,
          key: API_KEY,
        },
      })
      .then((response) => {
        const item = response.data.items[0];
        axios
          .post("/api/member/minihomepy/addYoutuber", {
            member_id: loginMember,
            title: item.snippet.title,
            country: item.snippet.country,
            customUrl: item.snippet.customUrl,
            publishedAt: item.snippet.publishedAt,
            description: item.snippet.description,
            thumbnails: item.snippet.thumbnails.medium.url,
            subscriberCount: item.statistics.subscriberCount,
            videoCount: item.statistics.videoCount,
            viewCount: item.statistics.viewCount,
          })
          .then(() => {
            toast({
              description: "등록이 완료됐습니다.",
              status: "success",
            });
            setAddYoutuber("");
            onClose();
          });
      })
      .catch((error) => {
        toast({
          description: "해당 유튜버는 존재하지 않습니다.",
          status: "warning",
        });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  function handleDeleteFavoriteList(id) {
    setIsSubmitting(true);
    axios
      .delete("/api/member/minihomepy/deleteYoutuber", {
        params: {
          id: id,
        },
      })
      .finally(() => {
        setIsSubmitting(false);
        setIsYoutuberDeleted(true);
      });
  }

  return (
    <>
      <Box
        w={"100%"}
        h={"100%"}
        bg="transparent"
        pt={10}
        maxHeight={"100%"}
        fontFamily={"'Jua', sans-serif"}
        sx={{
          overflowY: "scroll",
          "::-webkit-scrollbar": {
            width: "10px",
          },
          "::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "::-webkit-scrollbar-thumb": {
            background: "transparent",
            borderRadius: "10px",
          },
          ":hover::-webkit-scrollbar-thumb": {
            background: "#dcdcdc",
          },
        }}
      >
        <Box
          w={"100%"}
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
          mb={5}
          fontFamily={"'Jua', sans-serif"}
        >
          <Box fontSize={"35px"} color={"#dcdcdc"}>
            구독정보
          </Box>
          {member_id === loginMember ? (
            <>
              <Button
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                onClick={() => {
                  onOpen();
                }}
                bg={"transparent"}
                variant={"link"}
              >
                <FontAwesomeIcon icon={faPlus} color="#dcdcdc" />
                <Text ml={2} fontSize="20px" color={"#dcdcdc"} mr={5}>
                  NEW
                </Text>
              </Button>
            </>
          ) : (
            <></>
          )}
        </Box>
        <Modal
          initialFocusRef={initialRef}
          isOpen={isOpen}
          onClose={onClose}
          bg={"transparent"}
        >
          <ModalOverlay />
          <ModalContent bg="black" color={"#dcdcdc"}>
            <ModalHeader>좋아하는 유튜버를 추가하세요!</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={3}>
              <FormControl mt={2}>
                <Flex alignItems={"center"} pb={3}>
                  <Text mr={2}>채널 ID 입력</Text>
                  <WrapItem>
                    <Tooltip label="채널 ID 확인 방법" hasArrow arrowSize={15}>
                      <FontAwesomeIcon
                        icon={faCircleQuestion}
                        onClick={toolModal.onOpen}
                      />
                    </Tooltip>
                  </WrapItem>
                </Flex>
                <Input
                  placeholder="채널 ID를 입력해주세요"
                  value={addYoutuber}
                  onChange={(e) => {
                    setAddYoutuber(e.target.value);
                  }}
                />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              {isSubmitting ? (
                <Spinner />
              ) : (
                <Button
                  bg="trnasparnet"
                  color="#dcdcdc"
                  variant={"link"}
                  mr={3}
                  onClick={handleAddYoutuberList}
                >
                  등록
                </Button>
              )}
              <Button
                bg="trnasparnet"
                color="#dcdcdc"
                variant={"link"}
                onClick={onClose}
              >
                취소
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Modal w="100px" isOpen={toolModal.isOpen} onClose={toolModal.onClose}>
          <ModalOverlay />
          <ModalContent bg={"black"} color={"white"}>
            <ModalHeader>유튜버 채널ID 확인 방법</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Box>1. 좋아하는 유튜버의 채널로 접속한다</Box>
              <Box>2. 채널 프로필 우측, 채널 정보를 클릭한다.</Box>
              <Box>3. 맨 아래에 채널 공유 버튼을 누른다.</Box>
              <Box>4. 채널 ID 복사를 클릭한다.</Box>
            </ModalBody>

            <ModalFooter>
              <Button
                bg="trnasparnet"
                color="#dcdcdc"
                variant={"link"}
                mr={1}
                onClick={toolModal.onClose}
              >
                닫기
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/*  컨텐츠  -----------------------------------------*/}
        <Box
          w={"100%"}
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
          alignItems={"center"}
          color={"#dcdcdc"}
          mb={10}
          fontFamily={"'Jua', sans-serif"}
        >
          {youtuberInfo !== null &&
            youtuberInfo.map((youtuberInfo) => (
              <Box display={"flex"}>
                <Box
                  p={"15px"}
                  w="100%"
                  bgGradient="linear(to right, black,transparent)"
                  borderRadius={"20px"}
                  key={youtuberInfo.id}
                  mt={1.5}
                  mb={1.5}
                  onClick={() => {
                    window.location.href =
                      "https://www.youtube.com/" + youtuberInfo.customUrl;
                  }}
                >
                  <Flex w="100%" alignItems={"center"}>
                    <Box>
                      <Flex w={"100%"}>
                        <Box borderRadius={"20px"} mr={5}>
                          <Image
                            src={youtuberInfo.thumbnails}
                            borderRadius={"80px"}
                            w={"160px"}
                            minWidth={"160px"}
                            h={"160px"}
                            minHeight={"160px"}
                          />
                        </Box>

                        <Box minWidth={"590px"}>
                          <Box color={"#dcdcdc"} fontSize={"25px"}>
                            채널명 :{" "}
                            <Text display={"inline"} color={"tomato"}>
                              {youtuberInfo.title.length > 25
                                ? `${youtuberInfo.title.slice(0, 25)}..`
                                : youtuberInfo.title}
                            </Text>
                          </Box>
                          <Box color={"#dcdcdc"} fontSize={"20px"}>
                            정보 :
                            {youtuberInfo.description.length > 40
                              ? `${youtuberInfo.description.slice(0, 40)}..`
                              : youtuberInfo.description}
                          </Box>
                          <Box color={"#a0a0a0"} fontSize={"18px"}>
                            국적: {youtuberInfo.country}
                          </Box>
                          <Flex alignItems={"center"}>
                            <Box color={"#a0a0a0"} fontSize={"18px"}>
                              구독자: {youtuberInfo.subscriberCount}
                            </Box>

                            <Box
                              mr={2}
                              ml={2}
                              h={"4px"}
                              w={"4px"}
                              borderRadius={"2px"}
                              bg={"#a0a0a0"}
                              border={"1px solid #dcdcdc"}
                            />
                            <Box color={"#a0a0a0"} fontSize={"18px"}>
                              누적 조회수: {youtuberInfo.viewCount}
                            </Box>
                          </Flex>
                          <Flex alignItems={"center"}>
                            <Box color={"#a0a0a0"} fontSize={"18px"}>
                              유튜브 시작일:{youtuberInfo.ago}
                            </Box>
                            <Box
                              mr={3}
                              ml={3}
                              h={"4px"}
                              w={"4px"}
                              borderRadius={"2px"}
                              bg={"#a0a0a0"}
                              border={"1px solid #dcdcdc"}
                            />
                            <Box color={"#a0a0a0"} fontSize={"18px"}>
                              동영상: {youtuberInfo.videoCount}
                            </Box>
                          </Flex>
                        </Box>
                      </Flex>
                    </Box>
                  </Flex>
                </Box>
                {member_id === loginMember &&
                  (isSubmitting ? (
                    <Spinner />
                  ) : (
                    <Box pt={5}>
                      <Button
                        bg={"transparent"}
                        color={"#dcdcdc"}
                        fontSize={"20px"}
                        variant={"link"}
                        onClick={(e) => {
                          handleDeleteFavoriteList(youtuberInfo.id);
                        }}
                      >
                        삭제
                      </Button>
                    </Box>
                  ))}
              </Box>
            ))}
        </Box>
      </Box>
    </>
  );
}
