"use client";

import {
  useAddTopicMutation,
  useUpdateTopicMutation,
} from "../../api/topic-api";
import {
  useGetAllCategoriesQuery,
  useGetSortedCategoriesQuery,
} from "@/api/category-api";
import { Category } from "@/types/category";
import { Topic, TopicFormData } from "@/types/topic";
import Image from "next/image";
import { ChangeEvent, FC, SetStateAction, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AddTopicFormData, AddTopicSchema } from "@/types/form-data";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/router";
import { SubmitHandler, useForm } from "react-hook-form";

interface AddTopicFormProps {
  topic?: Topic;
  selectedCategory?: string;
}

export const AddTopicForm: FC<AddTopicFormProps> = ({
  selectedCategory,
  topic,
}) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddTopicFormData>({
    mode: "onBlur",
    resolver: zodResolver(AddTopicSchema),
  });

  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState("");

  const [topicData, setTopicData] = useState<TopicFormData>({
    thumbnailImageFile: undefined,
    rank: topic?.rank || "",
    title: topic?.versions?.[0].title || "",
    description: topic?.versions?.[0].description || "",
    titleAmh: "",
    descriptionAmh: "",
    category: topic?.category || "",
  });

  // const { data, isSuccess } = useGetAllCategoriesQuery();
  const { data, refetch, isSuccess } = useGetSortedCategoriesQuery({
    page: 1,
    limit: 100,
    sortBy: "rank",
    sortOrder: "asc",
    isArchived: "false",
    keyword: "",
  });
  const [createTopic] = useAddTopicMutation();
  const [updateTopic] = useUpdateTopicMutation();

  const showSuccessMessage = () => {
    toast.success("You have successfully created topic!", {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  const showErrorMessage = () => {
    toast.error("Creation failed. Please try again.", {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  let categories: Category[] = [];

  if (isSuccess) {
    categories = data.data.categories;
  }

  useEffect(() => {
    if (categories.length > 0 && !topicData.category) {
      setTopicData({
        ...topicData,
        category: categories[0]._id,
      });
    }
  }, [categories]);

  useEffect(() => {
    if (topicData.thumbnailImageFile) {
      const imageUrl = URL.createObjectURL(topicData.thumbnailImageFile);
      setImage(imageUrl);
    } else {
      setImage("");
    }
  }, [topicData.thumbnailImageFile]);

  const removeImage = () => {
    setTopicData({ ...topicData, thumbnailImageFile: undefined });
    setImage("");
  };

  const onSubmit = async () => {
    setLoading(true);
    toast.dismiss();

    if (!topicData.thumbnailImageFile) {
      return;
    }

    console.debug(topicData);

    const dataToSend = new FormData();
    dataToSend.append("category", topicData.category);
    dataToSend.append("rank", topicData.rank.toString());
    dataToSend.append("file", topicData.thumbnailImageFile);

    dataToSend.append("versions[0][description]", topicData.description);
    dataToSend.append("versions[0][language]", "English");
    dataToSend.append("versions[0][title]", topicData.title);

    dataToSend.append("versions[1][description]", topicData.descriptionAmh);
    dataToSend.append("versions[1][language]", "Amharic");
    dataToSend.append("versions[1][title]", topicData.titleAmh);

    const res: any =
      topic !== undefined
        ? await updateTopic({ data: dataToSend, id: topic._id })
        : await createTopic({ data: dataToSend });

    if (res?.data?.statusCode == "200") {
      showSuccessMessage();
      setTimeout(() => {
        router.push("/topic");
      }, 2000);
    } else {
      showErrorMessage();
    }

    setLoading(false);
  };

  return (
    <div className="flex w-full text-sm text-secondary flex-col items-center sm:justify-center">
      <ToastContainer />
      <div className="w-full rounded-md bg-white px-6 py6">
        {isSuccess && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="cols-span-2 mb-6 mt-2">
              <label
                htmlFor="fullName"
                className="mb-2 block font-normal text-sm"
              >
                Rank
                <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-col items-start">
                <input
                  type="text"
                  placeholder="Eg. 2"
                  className={`block w-1/4 ${
                    errors.rank ? "ring-1 ring-red-400" : ""
                  } rounded-lg border border-gray-300 p-2.5 placeholder-gray-300 focus:border-gray-600 bg-gray-50`}
                  {...register("rank")}
                  value={topicData.rank}
                  onChange={(e) => {
                    const inputValue = e.target.value;

                    if (inputValue === "") {
                      setTopicData({
                        ...topicData,
                        rank: "",
                      });
                    } else if (!isNaN(parseInt(inputValue))) {
                      setTopicData({
                        ...topicData,
                        rank: inputValue,
                      });
                    }
                  }}
                />
              </div>
              {errors.rank && (
                <span className="text-xs text-red-400 ml-2 mt-1">
                  {errors.rank.message}
                </span>
              )}
            </div>
            <div className="group grid grid-cols-2">
              <div className="cols-span-1 mr-8">
                <label htmlFor="fullName" className="mb-2 block">
                  Topic title <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-col items-start">
                  <input
                    type="text"
                    id="title"
                    {...register("title")}
                    placeholder="Please write the title of your category in English here."
                    className={`block w-full ${
                      errors.title ? "ring-1 ring-red-400" : ""
                    } rounded-lg border border-gray-300 p-2.5 placeholder-gray-300 bg-gray-50`}
                    onChange={(e) => {
                      setTopicData({
                        ...topicData,
                        title: e.target.value,
                      });
                    }}
                    value={topicData.title}
                  />
                </div>
                {errors.title && (
                  <span className="text-xs text-red-400 ml-2 mt-1">
                    {errors.title.message}
                  </span>
                )}
              </div>
              <div className={""}>
                <label htmlFor="fullName" className="mb-2 block">
                  የመደብ ርዕስ <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-col items-start">
                  <input
                    type="text"
                    id="titleAmh"
                    {...register("titleAmh")}
                    placeholder="እባክዎ የመደብ ርዕስ በአማርኛ እዚህ ይጻፉ።"
                    className={`block w-full ${
                      errors.titleAmh ? "ring-1 ring-red-400" : ""
                    } rounded-lg border border-gray-300 p-2.5 placeholder-gray-300 bg-gray-50`}
                    onChange={(e) => {
                      setTopicData({
                        ...topicData,
                        titleAmh: e.target.value,
                      });
                    }}
                    value={topicData.titleAmh}
                  />
                </div>
                {errors.titleAmh && (
                  <span className="text-xs text-red-400 ml-2 mt-1">
                    {errors.titleAmh.message}
                  </span>
                )}
              </div>
              <div className="mt-4 mr-8">
                <label htmlFor="email" className="mb-2 block">
                  Detail <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-col items-start">
                  <textarea
                    id="description"
                    placeholder="Details..."
                    rows={6}
                    {...register("description")}
                    className={`block w-full ${
                      errors.description ? "ring-1 ring-red-400" : ""
                    } rounded-lg border border-gray-300 bg-gray-50 p-2.5 placeholder-gray-300`}
                    autoComplete="off"
                    onChange={(e) => {
                      setTopicData({
                        ...topicData,
                        description: e.target.value,
                      });
                    }}
                    value={topicData.description}
                  />
                </div>
                {errors.description && (
                  <span className="text-xs text-red-400 ml-2 mt-1">
                    {errors.description.message}
                  </span>
                )}
              </div>

              <div className="mt-4">
                <label htmlFor="email" className="mb-2 block">
                  ዝርዝር <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-col items-start">
                  <textarea
                    id="descriptionAmh"
                    placeholder="ዝርዝሮችን እዚህ ይጻፉ።"
                    rows={6}
                    {...register("descriptionAmh")}
                    className={`block w-full ${
                      errors.descriptionAmh ? "ring-1 ring-red-400" : ""
                    } rounded-lg border border-gray-300 bg-gray-50 p-2.5 placeholder-gray-300`}
                    autoComplete="off"
                    onChange={(e) => {
                      setTopicData({
                        ...topicData,
                        descriptionAmh: e.target.value,
                      });
                    }}
                    value={topicData.descriptionAmh}
                  />
                </div>
                {errors.descriptionAmh && (
                  <span className="text-xs text-red-400 ml-2 mt-1">
                    {errors.descriptionAmh.message}
                  </span>
                )}
              </div>

              <div className="mt-6 col-span-2">
                <label htmlFor="email" className="mt-2 block text-gray-700">
                  Upload topic photo <span className="text-red-500">*</span>
                </label>
                <section className="container w-full mx-auto items-center">
                  <div className="pb-6 pt-4">
                    <div
                      id="image-preview"
                      className={`w-full overflow-hidden mb-4 h-56 bg-gray-50  ${
                        errors.thumbnailImageFile
                          ? "border-dashed border-1 border-red-400"
                          : "border-dashed border-2 border-gray-300"
                      } rounded-lg items-center mx-auto text-center cursor-pointer`}
                    >
                      <div className={`m-6 ${image ? "hidden" : ""} my-10`}>
                        <input
                          id="upload"
                          type="file"
                          {...register("thumbnailImageFile", {
                            onChange: (e: any) => {
                              setTopicData({
                                ...topicData,
                                thumbnailImageFile: e.target.files[0],
                              });
                            },
                          })}
                          className="hidden"
                          accept="image/*"
                        />
                        <label htmlFor="upload" className="cursor-pointer">
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
                          <h5 className="mb-2 text-xl font-medium tracking-tight text-gray-700">
                            Choose a photo
                          </h5>
                          <p className="font-light text-sm text-gray-400 md:px-6">
                            <b className="text-gray-600">JPG, PNG, or JPEG</b>{" "}
                            format upto 2MB.
                          </p>
                        </label>
                      </div>

                      {image && (
                        <Image
                          className="mx-auto mt-0.5"
                          src={image}
                          alt={""}
                          width={400}
                          height={150}
                        />
                      )}
                    </div>

                    {errors.thumbnailImageFile && (
                      <span className="text-xs text-red-400 ml-2 mt-1">
                        {errors.thumbnailImageFile.message?.toString()}
                      </span>
                    )}

                    {image && (
                      <button
                        onClick={removeImage}
                        className="flex justify-center w-fit items-center m-1 font-medium py-1 px-2 bg-white rounded-full text-primary border border-primary"
                      >
                        <div className="text-xs font-normal leading-none flex-initial">
                          {topicData.thumbnailImageFile?.name}
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
                htmlFor="categories"
                className="block mb-2 col-span-2 text-sm text-gray-900 dark:text-white"
              >
                Select a category
                <span className="text-red-500"> *</span>
              </label>
              <select
                id="categories"
                {...register("category")}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                  setTopicData({
                    ...topicData,
                    category: e.target.value,
                  });
                }}
              >
                {categories.map((category: Category) => (
                  <option
                    key={category._id}
                    value={category._id}
                    selected={selectedCategory == category._id}
                    className="text-secondary"
                  >
                    {category.versions
                      .filter((version) => version.language === "English")
                      .map((version) => version.title)}
                  </option>
                ))}
              </select>
              {errors.category && (
                <span className="text-xs text-red-400 ml-2 mt-1">
                  {errors.category.message}
                </span>
              )}

              <div className="mt-4 ml-auto flex items-center col-span-2">
                <Button
                  onClick={() => {
                    router.push("/topic");
                  }}
                  className="mt-2 mx-4 px-8 h-10.5 bg-white rounded-xl border-2 border-primary py-2.5 text-center font-medium text-primary"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isDisabled={Object.keys(errors).length > 0}
                  className="mt-2 px-8 h-10.5 rounded-xl bg-primary py-3 text-center font-medium text-white"
                  isLoading={loading}
                >
                  {topic !== undefined ? "Edit " : "Create "}
                  Topic
                </Button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
export default AddTopicForm;
