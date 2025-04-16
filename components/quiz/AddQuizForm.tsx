
import { Button } from "@nextui-org/react";
import React, { FC, useEffect, useMemo, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {
  useAddQuizMutation,
  useGetQuizCategoryQuery,
  useUpdateQuizMutation,
} from "@/api/quiz-api";
import { QuizCategory } from "@/types/quiz";
import { Question } from "@/types/quiz";
import Image from "next/image";
interface AddQuizProps {
  quizQuestion?: Question;
  isEdit?: boolean;
}
const AddQuizForm: FC<AddQuizProps> = ({ quizQuestion, isEdit }) => {
  const [question, setQuestion] = useState(
    quizQuestion?.question.English || ""
  );
  const [questionAmh, setQuestionAmh] = useState(
    quizQuestion?.question.Amharic || ""
  );
  const [choiceA, setChoiceA] = useState(
    quizQuestion?.choices?.choiceA.English || ""
  );
  const [choiceAAmh, setChoiceAAmh] = useState(
    quizQuestion?.choices?.choiceA.Amharic || ""
  );
  const [choiceB, setChoiceB] = useState(
    quizQuestion?.choices?.choiceB.English || ""
  );
  const [choiceBAmh, setChoiceBAmh] = useState(
    quizQuestion?.choices?.choiceB.Amharic || ""
  );
  const [choiceC, setChoiceC] = useState(
    quizQuestion?.choices?.choiceC?.English || ""
  );
  const [choiceCAmh, setChoiceCAmh] = useState(
    quizQuestion?.choices?.choiceC?.Amharic || ""
  );
  const [choiceD, setChoiceD] = useState(
    quizQuestion?.choices?.choiceD?.English || ""
  );
  const [choiceDAmh, setChoiceDAmh] = useState(
    quizQuestion?.choices?.choiceD?.Amharic || ""
  );
  const [explanation, setExplanation] = useState(
    quizQuestion?.explanation.English || ""
  );
  const [explanationAmh, setExplanationAmh] = useState(
    quizQuestion?.explanation.Amharic || ""
  );
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(
    quizQuestion?.explanationImage
  );


  const [fileName, setFileName] = useState<string | undefined>();
  const [file, setFile] = useState<File | null | string>(null);
  const [selectedAnswer, setSelectedAnswer] = useState(
    quizQuestion?.answer || ""
  );

  const [selectedCategory, setSelectedCategory] = useState(
    quizQuestion?.relatedCategory || ""
  );

  const [addQuestion] = useAddQuizMutation();
  const [editQuestion] = useUpdateQuizMutation();

  const handleChange = (file?: File) => {
    if (!file) {
      return;
    }
    setFile(file);
    setFileName(file.name);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setFileName(undefined);
    setPreviewUrl(undefined);
  };

  const showSuccessMessage = () => {
    isEdit ? toast.success("You have successfully updated a quiz question!", {
      position: toast.POSITION.TOP_RIGHT,
    }) :
      toast.success("You have successfully created a quiz question!", {
        position: toast.POSITION.TOP_RIGHT,
      });
  };

  const showErrorMessage = () => {
    toast.error("Creation failed. Please try again.", {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  const handleCategoryChange = (e: any) => {
    setSelectedCategory(e.target.value);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const dataToSend = new FormData();
    dataToSend.append("question[English]", question);
    dataToSend.append("question[Amharic]", questionAmh);
    dataToSend.append("choices[choiceA][English]", choiceA);
    dataToSend.append("choices[choiceA][Amharic]", choiceAAmh);
    dataToSend.append("choices[choiceB][English]", choiceB);
    dataToSend.append("choices[choiceB][Amharic]", choiceBAmh);
    if (choiceC !== "") {
      dataToSend.append("choices[choiceC][English]", choiceC);
      dataToSend.append("choices[choiceC][Amharic]", choiceCAmh);
      dataToSend.append("choices[choiceD][English]", choiceD);
      dataToSend.append("choices[choiceD][Amharic]", choiceDAmh);
    }
    dataToSend.append("explanation[English]", explanation);
    dataToSend.append("explanation[Amharic]", explanationAmh);
    dataToSend.append("answer", "choiceA");
    dataToSend.append("relatedCategory", selectedCategory);

    if (file) {
      dataToSend.append("file", file);
    }
    if (isEdit) {
      const res: any = await editQuestion({
        data: dataToSend,
        id: quizQuestion?._id || "",
      });

      if (res.data.statusCode == "200") {
        showSuccessMessage();
      } else {
        showErrorMessage();
      }
    } else {
      const res: any = await addQuestion({ data: dataToSend });

      if (res.data.statusCode == "200") {
        showSuccessMessage();
      } else {
        showErrorMessage();
      }
    }
  };

  const { data, isLoading, error, isSuccess } = useGetQuizCategoryQuery();

  let categories: any = useMemo(() => [], []);

  if (isSuccess) {
    categories = data.data.categories;
  }

  useEffect(() => {
    if (isSuccess && categories.length > 0) {
      setSelectedCategory(categories[0]._id);
    }
  }, [isSuccess, categories]);

  console.log("Categories", data?.data.categories);

  if (categories.length > 0) {
    return (
      <div className="flex w-full text-sm text-secondary flex-col items-center sm:justify-center">
        <ToastContainer />
        <div className="w-full rounded-md bg-white px-6 py6">
          <form onSubmit={handleSubmit}>
            <div className="group grid grid-cols-2">
              <div className="cols-span-1 mr-8 ">
                <label htmlFor="fullName" className="mb-2 block">
                  Question
                  <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-col items-start">
                  <textarea
                    id="question"
                    required
                    placeholder="Please write the question"
                    className="block w-full rounded-lg border border-gray-300 p-2.5 placeholder-gray-300 focus:border-gray-600  bg-gray-50 "
                    onChange={(e) => setQuestion(e.target.value)}
                    value={question}
                  />
                </div>
              </div>
              <div className={""}>
                <label htmlFor="question" className="mb-2 block">
                  የግንዛቤ ርዕስ <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-col items-start">
                  <textarea
                    placeholder="እባክዎ የመደብ ርዕስ በአማርኛ እዚህ ይጻፉ።"
                    required
                    className="block w-full rounded-lg border border-gray-300 p-2.5 placeholder-gray-300 focus:border-gray-600  bg-gray-50 "
                    value={questionAmh}
                    onChange={(e) => setQuestionAmh(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="flex my-6 ">
              <div className=" text-lg text-secondary ">Options</div>{" "}
            </div>

            <div className="group grid grid-cols-2">
              <div className="cols-span-1 mr-8">
                <label htmlFor="fullName" className="mb-2 block">
                  Choice A<span className="text-red-500">*</span>
                </label>
                <div className="flex flex-col items-start">
                  <input
                    id="question"
                    required
                    className="block w-full rounded-lg border border-gray-300 p-2.5 placeholder-gray-300 focus:border-gray-600  bg-gray-50 "
                    onChange={(e) => setChoiceA(e.target.value)}
                    value={choiceA}
                  />
                </div>
              </div>

              <div className={""}>
                <label htmlFor="question" className="mb-2 block">
                  አማራጭ A <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-col items-start">
                  <input
                    required
                    className="block w-full rounded-lg border border-gray-300 p-2.5 placeholder-gray-300 focus:border-gray-600  bg-gray-50 "
                    value={choiceAAmh}
                    onChange={(e) => setChoiceAAmh(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="group grid grid-cols-2 mt-4">
              <div className="cols-span-1 mr-8">
                <label htmlFor="fullName" className="mb-2 block">
                  Choice B<span className="text-red-500">*</span>
                </label>
                <div className="flex flex-col items-start">
                  <input
                    id="question"
                    required
                    className="block w-full rounded-lg border border-gray-300 p-2.5 placeholder-gray-300 focus:border-gray-600  bg-gray-50 "
                    onChange={(e) => setChoiceB(e.target.value)}
                    value={choiceB}
                  />
                </div>
              </div>

              <div className={""}>
                <label htmlFor="question" className="mb-2 block">
                  አማራጭ B <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-col items-start">
                  <input
                    required
                    className="block w-full rounded-lg border border-gray-300 p-2.5 placeholder-gray-300 focus:border-gray-600  bg-gray-50 "
                    value={choiceBAmh}
                    onChange={(e) => setChoiceBAmh(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="group grid grid-cols-2 mt-4">
              <div className="cols-span-1 mr-8">
                <label htmlFor="fullName" className="mb-2 block">
                  Choice C
                </label>
                <div className="flex flex-col items-start">
                  <input
                    id="question"
                    className="block w-full rounded-lg border border-gray-300 p-2.5 placeholder-gray-300 focus:border-gray-600  bg-gray-50 "
                    onChange={(e) => setChoiceC(e.target.value)}
                    value={choiceC}
                  />
                </div>
              </div>

              <div className={""}>
                <label htmlFor="question" className="mb-2 block">
                  አማራጭ C
                </label>
                <div className="flex flex-col items-start">
                  <input
                    className="block w-full rounded-lg border border-gray-300 p-2.5 placeholder-gray-300 focus:border-gray-600  bg-gray-50 "
                    value={choiceCAmh}
                    onChange={(e) => setChoiceCAmh(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="group grid grid-cols-2 mt-4">
              <div className="cols-span-1 mr-8">
                <label htmlFor="fullName" className="mb-2 block">
                  Choice D
                </label>
                <div className="flex flex-col items-start">
                  <input
                    id="question"
                    className="block w-full rounded-lg border border-gray-300 p-2.5 placeholder-gray-300 focus:border-gray-600  bg-gray-50 "
                    onChange={(e) => setChoiceD(e.target.value)}
                    value={choiceD}
                  />
                </div>
              </div>

              <div className={""}>
                <label htmlFor="question" className="mb-2 block">
                  አማራጭ D
                </label>
                <div className="flex flex-col items-start">
                  <input
                    className="block w-full rounded-lg border border-gray-300 p-2.5 placeholder-gray-300 focus:border-gray-600  bg-gray-50 "
                    value={choiceDAmh}
                    onChange={(e) => setChoiceDAmh(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="group grid grid-cols-2 my-6">
              <div className="cols-span-1 mr-8">
                <label htmlFor="fullName" className="mb-2 block">
                  Question Explanation
                  <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-col items-start">
                  <textarea
                    id="explanation"
                    required
                    placeholder="Please write the explanation for the question"
                    className="block w-full rounded-lg border border-gray-300 p-2.5 placeholder-gray-300 focus:border-gray-600  bg-gray-50 "
                    onChange={(e) => setExplanation(e.target.value)}
                    value={explanation}
                  />
                </div>
              </div>
              <div className={""}>
                <label htmlFor="explanationamh" className="mb-2 block">
                  የጥያቄ ማብራሪያ <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-col items-start">
                  <textarea
                    placeholder="እባክዎን ለጥያቄው ማብራሪያ ይጻፉ።"
                    required
                    className="block w-full rounded-lg border border-gray-300 p-2.5 placeholder-gray-300 focus:border-gray-600  bg-gray-50 "
                    value={explanationAmh}
                    onChange={(e) => setExplanationAmh(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <label className="block mb-2">Choose the answer:</label>
            <div className="flex space-x-4">
              {["A", "B", "C", "D"].map((choice) => (
                <label key={choice} className="flex items-center">
                  <input
                    type="radio"
                    name="answer"
                    value={choice}
                    checked={selectedAnswer === `choice${choice}`}
                    onChange={() => setSelectedAnswer(`choice${choice}`)}
                    className="form-radio text-primary bg-primary h-4 w-4"
                  />
                  <span className="ml-2">{`${choice}`}</span>
                </label>
              ))}
            </div>
            <div className="mt-6 col-span-2">
              <label
                aria-hidden="true"
                htmlFor="email"
                className="mt-2 block text-gray-700"
              >
                Upload insight photo <span className="text-red-500">*</span>
              </label>
              <section
                aria-hidden="true"
                className="container w-full mx-auto items-center"
              >
                <div className="pb-6 pt-4">
                  <div
                    id="image-preview"
                    className={`w-full overflow-hidden mb-4 h-56 bg-gray-50 
                                            border-dashed border-2 border-gray-300
                                     rounded-lg items-center mx-auto text-center cursor-pointer`}
                  >
                    {!previewUrl ? (
                      <div className="m-6 my-10">
                        <input
                          aria-hidden="true"
                          id="upload"
                          type="file"
                          onChange={(e) => {
                            const files = e.target.files || [];

                            handleChange(files[0]);
                          }}
                          className="hidden"
                          accept="image/*"
                        />
                        <label
                          aria-hidden="true"
                          htmlFor="upload"
                          className="cursor-pointer"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-8 h-8 text-gray-700 mx-auto mb-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                            />
                          </svg>
                          <h5
                            aria-hidden="true"
                            className="mb-2 text-xl font-medium tracking-tight text-gray-700"
                          >
                            Choose a picture to upload
                          </h5>
                          <p className="font-light text-sm text-gray-400 md:px-6">
                            <b className="text-gray-600">JPG, PNG, or JPEG</b>{" "}
                            format upto 2MB.
                          </p>
                        </label>
                      </div>
                    ) : (
                      <Image
                        aria-hidden="true"
                        className="mx-auto mt-0.5"
                        src={previewUrl}
                        alt={""}
                        width={400}
                        height={150}
                      />
                    )}
                  </div>

                  {previewUrl && (
                    <button
                      aria-hidden="true"
                      onClick={removeImage}
                      className="flex justify-center w-fit items-center m-1 font-medium py-1 px-2 bg-white rounded-full text-primary border border-primary"
                    >
                      <div className="text-xs font-normal leading-none flex-initial">
                        {fileName}
                      </div>
                      <div className="flex flex-auto flex-row-reverse">
                        <div>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="100%"
                            height="100%"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-x cursor-pointer hover:text-indigo-400 rounded-full w-4 h-4 ml-2"
                          >
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </div>
                      </div>
                    </button>
                  )}
                </div>
              </section>
            </div>

            <label
              htmlFor="quizCategories"
              className="block mb-2 col-span-2 text-sm "
            >
              Select a Category
              <span className="text-red-500"> *</span>
            </label>
            <select
              id="quizCategory"
              className="bg-gray-50 w-[50%] border border-gray-300 text-gray-900 text-sm rounded-lg block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              {categories.map((category: QuizCategory) => (
                <option
                  key={category._id}
                  value={category._id}
                  className="text-secondary"
                >
                  {category.titles.English}
                </option>
              ))}
            </select>

            <Button
              type="submit"
              className="mt-10 px-8 h-10.5 rounded-xl bg-primary py-3 text-center font-medium text-white"
            >
              Submit
            </Button>
          </form>
        </div>
      </div>
    );
  } else {
    return <div>Loading...</div>;
  }
};

export default AddQuizForm;