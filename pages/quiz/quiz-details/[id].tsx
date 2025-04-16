import { useRouter } from "next/router";
import { useGetQuestionQuery } from "@/api/quiz-api";
import Head from "next/head";
import { FiChevronLeft, FiEdit2, FiTrash2 } from "react-icons/fi";
import Image from "next/image";
import RootLayout from "@/layouts/RootLayout";
import { useSession } from "next-auth/react";
import { useDeleteQuestionMutation } from "@/api/quiz-api";
import { Skeleton } from "@nextui-org/react";
import { IconButton } from "@material-tailwind/react";

const QuestionDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [deleteQuestion] = useDeleteQuestionMutation();

  const {
    data: questionData,
    isLoading,
    isError,
  } = useGetQuestionQuery({ id: typeof id === "string" ? id : "" });

  const userData: any = useSession();

  const user = {
    name: "",
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    profileImage: "",
  };

  if (userData.status === "authenticated") {
    user.name = userData.data.profile.name;
    user.firstName = userData.data.profile.firstName;
    user.lastName = userData.data.profile.lastName;
    user.email = userData.data.profile.email;
    user.role = userData.data.profile.role;
    if (userData.data.profile.profileImage)
      user.profileImage = userData.data.profile.profileImage;
  }

  if (isLoading) {
    return (
      <RootLayout>
        <div className="mx-16 mt-6 h-full">
          {/* Shimmer Loading Effect */}
          <Skeleton className="h-20 w-full mb-4 rounded-3xl" />
          <div className="mx-5 mt-10 h-[82%] rounded-xl overflow-scroll no-scrollbar">
            <Skeleton className="h-10 w-20 mb-4" />
            <Skeleton className="h-8 mb-4" />
            <Skeleton className="h-24 mb-6 rounded-lg" />
            <Skeleton className="h-24 mb-6 rounded-lg" />
            <Skeleton className="h-24 mb-6 rounded-lg" />
            <Skeleton className="h-24 mb-6 rounded-lg" />
            <Skeleton className="h-40 rounded-md" />
          </div>
        </div>
      </RootLayout>
    );
  }

  if (isError || !questionData) {
    return <div>Error loading question data</div>;
  }

  const { question, choices, answer, explanation, explanationImage } =
    questionData.data;
  const choiceLabels: any = { 0: "A", 1: "B", 2: "C", 3: "D" };

  console.log("Choices", choices["choiceB"]);

  return (
    <RootLayout>
      <Head>
        <title>Adot Quiz Detail Page</title>
      </Head>
      <div className="mx-16 mt-6 h-full">
        <div className="flex items-center justify-between h-20 w-full mb-4 rounded-3xl bg-primary pr-14 pl-8">
          <div className="relative">
            <div className="text-white text-sm rounded-xl pt-0.5 w-96 h-full">
              <p>Quiz Detail Page</p>
            </div>
          </div>
          <div className="flex items-center text-right">
            <div className="mr-4">
              <p className="text-sm text-white font-medium">{user.name}</p>
              <p className="text-xs text-white text-opacity-70">{user.role}</p>
            </div>
            <div className="ring-1 rounded-full ring-[#f4e4f4] p-1">
              {user.profileImage ? (
                <Image
                  src={user.profileImage}
                  alt="Profile"
                  width={50}
                  height={50}
                  className="w-10 h-10 rounded-full"
                  // title={user.email}
                />
              ) : (
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-400">
                  <span className="font-medium text-xs leading-none text-white">
                    {user.firstName[0]}
                    {user.lastName[0]}
                  </span>
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mx-5 mt-10 h-[82%] rounded-xl overflow-scroll no-scrollbar">
          <div
            onClick={() => {
              router.push(`/quiz`);
            }}
            className="flex items-center mb-8 bg-primary text-white cursor-pointer hover:bg-lightPrimary hover:text-gray-600 hover:font-normal hover:shadow-md hover:shadow-primary transition duration-200 p-4 w-[20%] rounded-lg"
          >
            <FiChevronLeft className="mr-2" /> Back to Questions
          </div>

          <div className="mb-6 w-[75%]">
            <div className="text-gray-800 font-semibold text-lg mb-2">
              {question.English}
            </div>
            <div className="text-gray-500 text-lg">{question.Amharic}</div>
          </div>

          <div className="mb-6">
            {["choiceA", "choiceB", "choiceC", "choiceD"].map(
              (choice, index) => (
                <div
                  key={index}
                  className={`flex items-center my-2 rounded-lg px-8 py-4 transition-transform transform hover:scale-105 w-[50%] ${
                    answer === choice
                      ? "bg-green-200 border-l-6 border-green-500"
                      : "bg-gray-100"
                  }`}
                >
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-white font-bold mr-4">
                    {choiceLabels[index]}
                  </div>
                  <div>
                    <div className="text-gray-800 text-md">
                      {choices[choice]?.English}
                    </div>
                    <div className="text-gray-500 text-md">
                      {choices[choice]?.Amharic}
                    </div>
                  </div>
                </div>
              )
            )}
          </div>

          {/* <div className="flex ml-2 mt-8 space-x-4">
            <IconButton
              className="bg-primary text-white font-medium text-xs px-4 py-2 rounded-full flex items-center transition-transform transform hover:scale-105"
              onClick={() => {
                router.push(`/quiz/${id}`);
              }}
            >
              <FiEdit2 className="h-4 w-4" />
            </IconButton>
            <IconButton
              className="bg-primary text-white font-medium text-xs px-4 py-2 rounded-full flex items-center transition-transform transform hover:scale-105"
              onClick={() => {
                if (typeof id === "string") {
                  deleteQuestion({ id }); // Only call deleteQuestion if id is a string
                } else {
                  console.error("Invalid ID format");
                }
              }}
            >
              <FiTrash2 className="h-4 w-4" />
            </IconButton>
          </div> */}

          <div className="mb-6 mt-10 flex border border-primary p-4 rounded-lg">
            <div className="flex-1 flex flex-col text-gray-700">
              <h3 className="text-lg font-semibold mb-2 text-justify-start  bg-primary text-white rounded-lg p-2">
                Explanation - ማብራሪያ
              </h3>
              <p className="mt-4 text-justify-center text-[16px]">
                {explanation.English}
              </p>
              <p className="mt-8 text-justify-center text-[17px]">
                {explanation.Amharic}
              </p>
            </div>
            {explanationImage && (
              <div className="flex ml-4 w-1/2 justify-end items-center">
                <Image
                  src={explanationImage}
                  alt="Explanation Image"
                  width={400}
                  height={400}
                  className="rounded-md border border-primary transition-transform transform hover:scale-105"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </RootLayout>
  );
};

export default QuestionDetailPage;
