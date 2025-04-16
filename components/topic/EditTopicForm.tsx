"use client";

import { FC, useState } from "react";
import { useGetSortedCategoriesQuery } from "@/api/category-api";
import Image from "next/image";
import { useUpdateTopicMutation } from "../../api/topic-api";
import { Topic, TopicFormData } from "@/types/topic";
import { Category } from "@/types/category";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import { Button } from "@nextui-org/react";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { EditTopicFormData, EditTopicSchema } from "@/types/form-data";
import { set } from "zod";

interface EditTopicFormProps {
  topic: Topic;
}

export const EditTopicForm: FC<EditTopicFormProps> = ({ topic }) => {
  const { data, refetch, isSuccess } = useGetSortedCategoriesQuery({
    page: 1,
    limit: 100,
    sortBy: "rank",
    sortOrder: "asc",
    isArchived: "false",
    keyword: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<EditTopicFormData>({
    mode: "onBlur",
    resolver: zodResolver(EditTopicSchema),
  });

  const showSuccessMessage = () => {
    toast.success("You have successfully updated topic!", {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  const showErrorMessage = () => {
    toast.error("Creation failed. Please try again.", {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  const strs = topic.thumbnailImage?.split("/");

  let categories: Category[] = [];

  if (isSuccess) {
    categories = data.data.categories;
  }

  const [topicData, setTopicData] = useState<TopicFormData>({
    thumbnailImageFile: undefined,
    category: topic ? topic.category : "",
    rank: topic ? topic.rank : "",
    title: topic ? topic.versions[0].title : "",
    description: topic ? topic.versions[0].description : "",
    titleAmh: topic ? topic.versions[1]?.title : "",
    descriptionAmh: topic ? topic.versions[1]?.description : "",
  });

  console.log(topicData);

  const [updateTopic] = useUpdateTopicMutation();
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(
    topic?.thumbnailImage
  );
  const [fileName, setFileName] = useState<string | undefined>(
    strs[strs.length - 1]
  );

  const handleChange = (file?: File) => {
    if (!file) {
      return;
    }
    setFileName(file.name);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const selectedCategory: Category[] = categories.filter(
    (category) => category._id == topicData.category
  );

  const removeImage = () => {
    setFileName(undefined);
    setPreviewUrl(undefined);
  };

  const onSubmit = async () => {
    setLoading(true);
    toast.dismiss();

    const dataToSend = new FormData();
    dataToSend.append("category", topicData.category);
    dataToSend.append("rank", topicData.rank.toString());

    if (topicData.thumbnailImageFile)
      dataToSend.append("file", topicData.thumbnailImageFile);

    dataToSend.append("versions[0][description]", topicData.description);
    dataToSend.append("versions[0][language]", "English");
    dataToSend.append("versions[0][title]", topicData.title);

    dataToSend.append("versions[1][description]", topicData.descriptionAmh);
    dataToSend.append("versions[1][language]", "Amharic");
    dataToSend.append("versions[1][title]", topicData.titleAmh);

    const res: any = await updateTopic({ data: dataToSend, id: topic._id });

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
      <ToastContainer aria-hidden="true" />
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
                  type="number"
                  placeholder="Eg. 2"
                  className={`block w-1/4 ${
                    errors.rank ? "ring-1 ring-red-400" : ""
                  } rounded-lg border border-gray-300 p-2.5 placeholder-gray-300 focus:border-gray-600  bg-gray-50 `}
                  {...register("rank")}
                  value={topicData.rank}
                  onChange={(e) => {
                    console.log(
                      !isNaN(parseInt(e.target.value)),
                      e.target.value,
                      topicData.rank
                    );
                    if (e.target.value === "") {
                      setTopicData({
                        ...topicData,
                        rank: "",
                      });
                    }
                    if (!isNaN(parseInt(e.target.value)))
                      setTopicData({
                        ...topicData,
                        rank: e.target.value,
                      });
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
                <label
                  aria-hidden="true"
                  htmlFor="fullName"
                  className="mb-2 block"
                >
                  Topic title <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-col items-start">
                  <input
                    aria-hidden="true"
                    type="text"
                    id="title"
                    {...register("title")}
                    placeholder="Please write the title of your category in English here."
                    className={`block w-full ${
                      errors.title ? "ring-1 ring-red-400" : ""
                    } rounded-lg border border-gray-300 p-2.5 placeholder-gray-300 focus:border-gray-600  bg-gray-50 :not(:placeholder-shown):not(:focus):invalid~span]:block invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-400 valid:[&:not(:placeholder-shown)]:border-green-500`}
                    defaultValue={topicData.title}
                    onChange={(e) => {
                      setTopicData({ ...topicData, title: e.target.value });
                    }}
                  />
                </div>
                {errors.title && (
                  <span className="text-xs text-red-400 ml-2 mt-1">
                    {errors.title.message}
                  </span>
                )}
              </div>
              <div className={""}>
                <label
                  aria-hidden="true"
                  htmlFor="fullName"
                  className="mb-2 block"
                >
                  የመደብ ርዕስ <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-col items-start">
                  <input
                    aria-hidden="true"
                    type="text"
                    id="titleAmh"
                    {...register("titleAmh")}
                    placeholder="እባክዎ የመደብ ርዕስ በአማርኛ እዚህ ይጻፉ።"
                    className={`block w-full ${
                      errors.titleAmh ? "ring-1 ring-red-400" : ""
                    } rounded-lg border border-gray-300 p-2.5 placeholder-gray-300 focus:border-gray-600  bg-gray-50 :not(:placeholder-shown):not(:focus):invalid~span]:block invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-400 valid:[&:not(:placeholder-shown)]:border-green-500`}
                    defaultValue={topicData.titleAmh}
                    onChange={(e) => {
                      setTopicData({ ...topicData, titleAmh: e.target.value });
                    }}
                  />
                </div>
                {errors.titleAmh && (
                  <span className="text-xs text-red-400 ml-2 mt-1">
                    {errors.titleAmh.message}
                  </span>
                )}
              </div>
              <div className="mt-4 mr-8">
                <label
                  aria-hidden="true"
                  htmlFor="email"
                  className="mb-2 block"
                >
                  Detail <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-col items-start">
                  <textarea
                    aria-hidden="true"
                    id="description"
                    {...register("description")}
                    placeholder="Details..."
                    rows={6}
                    className={`block w-full ${
                      errors.description ? "ring-1 ring-red-400" : ""
                    } rounded-lg border border-gray-300 bg-gray-50 p-2.5 placeholder-gray-300`}
                    autoComplete="off"
                    defaultValue={topicData.description}
                    onChange={(e) => {
                      setTopicData({
                        ...topicData,
                        description: e.target.value,
                      });
                    }}
                  />
                </div>
                {errors.description && (
                  <span className="text-xs text-red-400 ml-2 mt-1">
                    {errors.description.message}
                  </span>
                )}
              </div>
              <div className="mt-4">
                <label
                  aria-hidden="true"
                  htmlFor="email"
                  className="mb-2 block"
                >
                  ዝርዝር <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-col items-start">
                  <textarea
                    aria-hidden="true"
                    id="detail"
                    {...register("descriptionAmh")}
                    placeholder="ዝርዝሮችን እዚህ ይጻፉ።"
                    rows={6}
                    className={`block w-full ${
                      errors.descriptionAmh ? "ring-1 ring-red-400" : ""
                    } rounded-lg border border-gray-300 bg-gray-50 p-2.5 placeholder-gray-300`}
                    autoComplete="off"
                    defaultValue={topicData.descriptionAmh}
                    onChange={(e) => {
                      setTopicData({
                        ...topicData,
                        descriptionAmh: e.target.value,
                      });
                    }}
                  />
                </div>
                {errors.descriptionAmh && (
                  <span className="text-xs text-red-400 ml-2 mt-1">
                    {errors.descriptionAmh.message}
                  </span>
                )}
              </div>

              <div className="mt-6 col-span-2">
                <label
                  aria-hidden="true"
                  htmlFor="email"
                  className="mt-2 block text-gray-700"
                >
                  Upload topic photo <span className="text-red-500">*</span>
                </label>
                <section
                  aria-hidden="true"
                  className="container w-full mx-auto items-center"
                >
                  <div className="pb-6 pt-4">
                    <div
                      id="image-preview"
                      className={`w-full overflow-hidden mb-4 h-56 bg-gray-50  ${
                        errors.thumbnailImageFile
                          ? "border-dashed border-1 border-red-400"
                          : "border-dashed border-2 border-gray-300"
                      } rounded-lg items-center mx-auto text-center cursor-pointer`}
                    >
                      <div
                        className={`m-6 ${previewUrl ? "hidden" : ""} my-10`}
                      >
                        <input
                          aria-hidden="true"
                          id="upload"
                          type="file"
                          {...register("thumbnailImageFile")}
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
                            Choose a photo or drag and drop it here
                          </h5>
                          <p className="font-light text-sm text-gray-400 md:px-6">
                            <b className="text-gray-600">JPG, PNG, or JPEG</b>{" "}
                            format upto 2MB.
                          </p>
                        </label>
                      </div>
                      {previewUrl && (
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

                    {errors.thumbnailImageFile && (
                      <span className="text-xs text-red-400 ml-2 mt-1">
                        {errors.thumbnailImageFile.message?.toString()}
                      </span>
                    )}

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
                htmlFor="categories"
                className="block mb-2 col-span-2 text-sm text-gray-900 dark:text-white"
              >
                Select an category
                <span className="text-red-500"> *</span>
              </label>
              <select
                id="categories"
                {...register("category", {
                  onChange: (e) => {
                    setTopicData({ ...topicData, category: e.target.value });
                  },
                })}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              >
                {/* Placeholder option */}
                <option value="" disabled selected>
                  {selectedCategory.length > 0
                    ? selectedCategory[0].versions.filter(
                        (version) => version.language === "English"
                      )[0].title
                    : "Select a category"}
                </option>

                {/* Map through categories and render options */}
                {categories.map((category: Category) => (
                  <option
                    key={category._id}
                    value={category._id}
                    className="text-secondary"
                    selected={selectedCategory[0]._id == category._id}
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
                  aria-hidden="true"
                  onClick={() => {
                    router.push("/topic");
                  }}
                  className="mt-2 mx-4 px-8 h-10.5 bg-white rounded-xl border-2 border-primary py-2.5 text-center font-medium text-primary"
                >
                  Cancel
                </Button>
                <Button
                  aria-hidden="true"
                  type="submit"
                  isDisabled={Object.keys(errors).length > 0}
                  className="mt-2 px-8 h-10.5 rounded-xl bg-primary py-3 text-center font-medium text-white"
                  isLoading={loading}
                >
                  Update Topic
                </Button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
export default EditTopicForm;
