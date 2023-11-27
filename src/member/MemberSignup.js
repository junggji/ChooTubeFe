import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Input,
  Radio,
  RadioGroup,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  defaultLength,
  defaultMessage,
  defaultPatterns,
  englishAndNumberOnly,
  validatePassword,
  validateEmail,
} from "./memberUtil/memberSignUpMethods";

function MemberSignup(props) {
  /* 회원 상태---------------------------------------------------------------------------------- */
  const [member_id, setMember_id] = useState("");
  const [password, setPassword] = useState("");
  const [password_check, setPassword_check] = useState("");
  const [gender, setGender] = useState("m");
  const [birth_date, setBirth_date] = useState(null);
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [phone_number, setPhone_number] = useState("");
  /* ID 검증---------------------------------------------------------------------------------- */

  const [checkIdResult, setCheckIdResult] = useState(false); // 중복 체크 결과
  const [idMessage, setIdMessage] = useState(defaultMessage);
  const [idDisable, setIdDisable] = useState(false); // 중복 체크 후 비활성화
  /* 닉네임 검증 ----------------------------------------------------------------------------------*/
  const [checkNicknameResult, setCheckNicknameResult] = useState(false); // 중복 체크 결과
  const [nicknameMessage, setNicknameMessage] = useState(defaultMessage);
  const [nickNameDisable, setNickNameDisable] = useState(false); // 중복 체크 후 비활성화
  /* 이메일 검증 ----------------------------------------------------------------------------------*/

  const [checkEmailResult, setCheckEmailResult] = useState(false); // 중복 체크 결과
  const [emailMessage, setEmailMessage] = useState(defaultMessage);
  const [emailDisable, setEmailDisable] = useState(false); // 중복 체크 후 비활성화

  /* 비밀번호 관련 메세지 ----------------------------------------------------------------------------------*/
  const [passwordTypeResult, setPasswordTypeResult] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState(defaultMessage);
  const [passwordCheckMessage, setPasswordCheckMessage] =
    useState("비밀번호가 일치하지 않습니다");

  const [timer, setTimer] = useState(null);

  const submitAvailable =
    checkIdResult &&
    checkNicknameResult &&
    true &&
    passwordTypeResult &&
    birth_date !== null &&
    phone_number.length > 12;

  /* ChakraUI*/
  const toast = useToast();
  const navigate = useNavigate();

  /* 회원 가입 요청 ----------------------------------------------------------------------------------*/
  function handleSignupForm() {
    axios
      .post("/api/member/signup", {
        member_id,
        password,
        gender,
        birth_date,
        nickname,
        email,
        phone_number,
      })
      .then(() => {
        toast({
          description: "회원가입이 완료되었습니다",
          status: "success",
        });
        navigate("/member/signup");
      })

      .catch((error) => {
        if (error.response.status === 400) {
          toast({
            description: "가입 정보를 확인해주세요",
            status: "warning",
          });
        } else {
          toast({
            description: "서버에 오류가 발생하였습니다.",
            status: "error",
          });
        }
      });
  }

  /* 중복 체크 메서드 ----------------------------------------------------------------------------------*/
  function handleDuplicated(itemName, item) {
    const params = new URLSearchParams();
    params.set(itemName, item);
    console.log(params);
    axios
      .get("/api/member/signup/check?" + params)
      .then((response) => {
        const result = response.data;
        toast({
          description: result,
          status: "success",
        });
        if (itemName === "member_id") {
          setCheckIdResult(true);
          setIdDisable(false);
        }
        if (itemName === "nickname") {
          setCheckNicknameResult(true);
          setNickNameDisable(false);
        }
        if (itemName === "email") {
          setCheckEmailResult(true);
          setEmailDisable(false);
        }
      })
      .catch((error) => {
        const result = error.response.data;
        toast({
          description: result,
          status: "warning",
        });
        if (itemName === "member_id") {
          setCheckIdResult(false);
          setIdMessage(result);
        }
        if (itemName === "nickname") {
          setCheckNicknameResult(false);
          setNicknameMessage(result);
        }
        if (itemName === "email") {
          setCheckEmailResult(false);
          setEmailMessage(result);
        }
      });
  }

  return (
    <>
      <Box>
        <Card w={"100%"} align={"center"}>
          <CardHeader>
            <Heading>사용자 가입</Heading>
          </CardHeader>
          <CardBody>
            {/* 아이디 폼  ---------------------------------------------------------------------------------- */}
            <Flex gap={6}>
              <Box>
                <FormControl
                  mt={4}
                  isRequired
                  isInvalid={
                    member_id.length === 0
                      ? false
                      : englishAndNumberOnly(member_id)
                        ? true
                        : !checkIdResult
                  }
                >
                  <FormLabel>아이디</FormLabel>
                  <Flex>
                    <Input
                      w={"xs"}
                      placeholder="아이디 입력 (6~40자)"
                      value={member_id}
                      maxLength={"40"}
                      onChange={(e) => {
                        if (!e.target.value.includes(" ")) {
                          setCheckIdResult(false);
                          setIdDisable(true);
                          setMember_id(e.target.value);
                          setIdMessage("6" + defaultLength);
                          if (e.target.value.length > 5) {
                            setIdMessage(defaultMessage);
                          }
                          if (englishAndNumberOnly(member_id)) {
                            setIdMessage(defaultPatterns);
                          }
                        }
                      }}
                    />
                    <Button
                      isDisabled={
                        member_id.length < 6 ||
                        englishAndNumberOnly(member_id) ||
                        !idDisable
                      }
                      onClick={() => {
                        handleDuplicated("member_id", member_id);
                      }}
                    >
                      중복확인
                    </Button>
                  </Flex>
                  <FormErrorMessage>{idMessage}</FormErrorMessage>
                </FormControl>
              </Box>
            </Flex>
            {/* 비밀번호 폼 ---------------------------------------------------------------------------------- */}
            <Flex gap={5}>
              <FormControl
                mt={4}
                isRequired
                isInvalid={password.length === 0 ? false : !passwordTypeResult}
              >
                <FormLabel>비밀번호</FormLabel>
                <Input
                  w={"xs"}
                  type="password"
                  maxLength={"20"}
                  placeholder="비밀번호 입력( 8~20자, 특수기호 포함)"
                  value={password}
                  onChange={(e) => {
                    if (!e.target.value.includes(" ")) {
                      setPasswordTypeResult(false);
                      setPasswordMessage("8" + defaultLength);
                      setPassword(e.target.value);
                      if (e.target.value.length > 7) {
                        setPasswordMessage("안전검사가 필요합니다");
                      }
                    }
                  }}
                />

                <FormErrorMessage>{passwordMessage}</FormErrorMessage>
              </FormControl>
              {/* 비밀번호 재확인 ---------------------------------------------------------------------------------- */}
              <FormControl
                mt={4}
                isRequired
                isInvalid={
                  password_check.length === 0
                    ? false
                    : password === password_check
                      ? !passwordTypeResult
                      : true
                }
              >
                <FormLabel>비밀번호 재확인</FormLabel>
                <Flex gap={1}>
                  <Input
                    w={"xs"}
                    type="password"
                    maxLength={"20"}
                    placeholder="비밀번호 재확인"
                    value={password_check}
                    onChange={(e) => {
                      if (!e.target.value.includes(" ")) {
                        setPasswordTypeResult(false);
                        setPassword_check(e.target.value);
                        if (password === e.target.value) {
                          setPasswordCheckMessage("안전검사가 필요합니다");
                        } else {
                          setPasswordCheckMessage(
                            "비밀번호가 일치하지 않습니다",
                          );
                        }
                      }
                    }}
                  />
                  <Button
                    isDisabled={
                      password.length < 7 || password !== password_check
                    }
                    onClick={() => {
                      if (validatePassword(password)) {
                        setPasswordTypeResult(true);
                        toast({
                          description: "안전한 비밀번호입니다",
                          status: "success",
                        });
                      } else {
                        setPasswordTypeResult(false);
                        setPasswordMessage(
                          "형식이 올바르지 않습니다. 영문자(대,소문자)와 숫자, 특수기호를 모두 포함해주세요",
                        );
                        setPasswordCheckMessage("");
                      }
                    }}
                  >
                    안전검사
                  </Button>
                </Flex>
                <FormErrorMessage size={"sm"}>
                  {passwordCheckMessage}
                </FormErrorMessage>
              </FormControl>
            </Flex>
            {/* 닉네임 폼 ---------------------------------------------------------------------------------- */}
            <FormControl
              mt={4}
              isRequired
              isInvalid={nickname.length === 0 ? false : !checkNicknameResult}
            >
              <FormLabel>닉네임</FormLabel>
              <Flex>
                <Input
                  w={"xs"}
                  placeholder="닉네임 입력 (3~20자)"
                  maxLength={"20"}
                  value={nickname}
                  onChange={(e) => {
                    if (!e.target.value.includes(" ")) {
                      setNickNameDisable(true);
                      setNicknameMessage(true);
                      setCheckNicknameResult(false);
                      setNicknameMessage("3" + defaultLength);
                      setNickname(e.target.value);
                      if (e.target.value.length > 2) {
                        setNicknameMessage(defaultMessage);
                      }
                    }
                  }}
                />
                <Button
                  isDisabled={nickname.length < 2 || !nickNameDisable}
                  onClick={() => {
                    handleDuplicated("nickname", nickname);
                  }}
                >
                  중복확인
                </Button>
              </Flex>
              <FormErrorMessage>{nicknameMessage}</FormErrorMessage>
            </FormControl>
            {/* 이메일 폼 -----------------------------------------------------------------------------------*/}
            <FormControl
              mt={4}
              isRequired
              isInvalid={email.length === 0 ? false : !checkEmailResult}
            >
              <FormLabel>이메일</FormLabel>
              <Flex>
                <Input
                  w={"xs"}
                  type="email"
                  maxLength={"30"}
                  placeholder="이메일 입력"
                  onChange={(e) => {
                    if (!e.target.value.includes(" ")) {
                      setCheckEmailResult(false);
                      setEmailDisable(true);
                      setEmail(e.target.value);
                      if (timer) clearTimeout(timer); // 기존 타이머가 있으면 초기화
                      const newTimer = setTimeout(() => {
                        // 함수 호출을 지연시키는 메서드
                        if (validateEmail(e.target.value)) {
                          setEmailMessage(defaultMessage);
                        } else {
                          setEmailMessage("이메일 형식이 맞지 않습니다");
                        }
                      }, 500); // 500ms 후에 유효성 검사
                      setTimer(newTimer);
                    }
                  }}
                />

                <Button
                  isDisabled={!emailDisable || !validateEmail(email)}
                  onClick={(e) => {
                    if (validateEmail(email)) {
                      handleDuplicated("email", email);
                    }
                  }}
                >
                  중복확인
                </Button>
              </Flex>
              <FormErrorMessage>{emailMessage}</FormErrorMessage>
            </FormControl>
            {/* 생년월일 ---------------------------------------------------------------------------------- */}
            <FormControl mt={4} isRequired>
              <FormLabel>생년월일</FormLabel>
              <Input
                w={"xs"}
                type="date"
                onChange={(e) => {
                  console.log(e.target.value);
                  setBirth_date(e.target.value);
                }}
              />
            </FormControl>
            <FormControl>
              <RadioGroup defaultValue="m" onChange={setGender}>
                <HStack spacing="24px">
                  <Radio value="m">남자</Radio>
                  <Radio value="w">여자</Radio>
                </HStack>
              </RadioGroup>
            </FormControl>
            {/* 전화번호 ---------------------------------------------------------------------------------- */}
            <FormControl mt={4} isRequired>
              <FormLabel>휴대폰 번호</FormLabel>
              <Input
                type="tel"
                placeholder="전화번호"
                maxLength={"15"}
                onChange={(e) => {
                  setPhone_number(
                    (e.target.value = e.target.value
                      .replace(/[^0-9]/g, "")
                      .replace(
                        /(^02.{0}|^01.{1}|[0-9]{3,4})([0-9]{3,4})([0-9]{4})/g,
                        "$1-$2-$3",
                      )),
                  );
                }}
              />
            </FormControl>
          </CardBody>
          <CardFooter gap={6}>
            <Button
              size={"lg"}
              isDisabled={!submitAvailable}
              onClick={handleSignupForm}
            >
              가입
            </Button>
            <Button
              colorScheme="red"
              size={"lg"}
              onClick={() => {
                navigate("/");
              }}
            >
              취소
            </Button>
          </CardFooter>
        </Card>
      </Box>
    </>
  );
}

export default MemberSignup;