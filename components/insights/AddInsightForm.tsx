"use client";

import { useGetTopicsQuery } from "../../api/topic-api";
import { Insight, InsightFormData } from "@/types/insight";
import dynamic from "next/dynamic";
import Image from "next/image";
import { FC, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAddInsightMutation } from "@/api/insight-api";
import { AddInsightFormData, AddInsightSchema } from "@/types/form-data";
import { Topic } from "@/types/topic";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/router";
import { MultiSelect } from "react-multi-select-component";

import "react-quill/dist/quill.snow.css";

// Dynamically import ReactQuill with SSR disabled
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

interface AddInsightFormProps {
  insight?: Insight;
  selectedTopic?: string;
}

type Option = { label: string; value: string };

const AddInsightForm: FC<AddInsightFormProps> = ({
  insight,
  selectedTopic,
}) => {
  const router = useRouter();

  const trimesterOptions = [
    { label: "Trimester 1", value: "1" },
    { label: "Trimester 2", value: "2" },
    { label: "Trimester 3", value: "3" },
  ];

  const weekRanges: Record<string, { label: string; value: string }[]> = {
    "1": Array.from({ length: 12 }, (_, i) => ({
      label: `Week ${i + 1}`,
      value: `${i + 1}`,
    })),
    "2": Array.from({ length: 15 }, (_, i) => ({
      label: `Week ${i + 13}`,
      value: `${i + 13}`,
    })),
    "3": Array.from({ length: 13 }, (_, i) => ({
      label: `Week ${i + 28}`,
      value: `${i + 28}`,
    })),
  };

  const [selectedTrimester, setSelectedTrimester] = useState<Option[]>([]);
  const [selectedWeeks, setSelectedWeeks] = useState<Option[]>([]);

  // Get the weeks based on the selected trimesters
  const availableWeeks: Option[] = selectedTrimester
    .flatMap((trimester) => weekRanges[trimester.value] || [])
    .sort((a, b) => parseInt(a.value) - parseInt(b.value)); // Ensure sorted order
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AddInsightFormData>({
    mode: "onBlur",
    resolver: zodResolver(AddInsightSchema),
  });

  const [image, setImage] = useState("");
  const [insightData, setInsightData] = useState<InsightFormData>({
    thumbnailImageFile: undefined,
    topic: insight?.topic || "",
    rank: insight?.rank || 1,
    title: insight?.versions?.[0]?.title || "",
    description: insight?.versions?.[0]?.content || "",
    titleAmh: "",
    descriptionAmh: "",
    category: "653fbf4852ea4317df8b0241",
    reference: ["Doctor"],
    trimesters: [],
    pregnancyWeeks: [],

    reviewer: "654dce5811de6889bc7d5bc6",
  });

  // const { data, isSuccess } = useGetAllTopicsQuery();
  // const { data: topicResponse, isSuccess } = useGetSortedTopicsQuery({
  // 	page: 1,
  // 	limit: 1000,
  // });

  const { data: topicResponse, isSuccess } = useGetTopicsQuery();
  const [createInsight, { isLoading: addInsightLoading }] =
    useAddInsightMutation();

  const showSuccessMessage = () => {
    toast.success("You have successfully created an insight!", {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  const showErrorMessage = () => {
    toast.error("Insight creation failed. Please try again.", {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  let topics: Topic[] = [];

  if (isSuccess) {
    topics = topicResponse.data;
  }

  useEffect(() => {
    if (insightData.thumbnailImageFile) {
      const imageUrl = URL.createObjectURL(insightData.thumbnailImageFile);
      setImage(imageUrl);
    } else {
      setImage("");
    }
  }, [insightData.thumbnailImageFile]);

  const removeImage = () => {
    setInsightData({ ...insightData, thumbnailImageFile: undefined });
    setImage("");
  };

  const registerInsight = async (data: AddInsightFormData) => {
    const dataToSend = new FormData();
    dataToSend.append("topic", data.topic);
    dataToSend.append("category", insightData.category);
    dataToSend.append("rank", data.rank.toString());
    dataToSend.append("file", data.thumbnailImageFile[0]); // Make sure to handle file input correctly
    dataToSend.append("reviewer", insightData.reviewer.toString());

    // Iterate over reference values and append them
    for (const referenceValue of insightData.reference) {
      dataToSend.append("reference[]", referenceValue);

      // Ensure correct field names and append trimester values
      data.trimesters?.forEach((trimester: string) => {
        dataToSend.append("trimesters[]", String(Number(trimester)));
      });

      // Append pregnancy week values
      data.pregnancyWeeks?.forEach((week: string) => {
        dataToSend.append("pregnancyWeeks[]", String(Number(week)));
      });

      dataToSend.append("versions[0][content]", data.description);
      dataToSend.append("versions[0][language]", "English");
      dataToSend.append("versions[0][title]", data.title);

      dataToSend.append("versions[1][content]", data.descriptionAmh);
      dataToSend.append("versions[1][language]", "Amharic");
      dataToSend.append("versions[1][title]", data.titleAmh);

      try {
        const res: any = createInsight({ data: dataToSend });

        if (res.data?.statusCode == "204") {
          showSuccessMessage();
          setTimeout(() => {
            router.push("/insights");
          }, 2000);
        } else {
          showSuccessMessage();
          setTimeout(() => {
            router.push("/insights");
          }, 2000);
        }
      } catch (error) {
        console.error("Error submitting insight: ", error);
        showErrorMessage();
      }
    }
  };

  return (
    <div className="flex w-full text-sm text-secondary flex-col items-center sm:justify-center">
      <ToastContainer />
      <div className="w-full rounded-md bg-white px-6 py6">
        <form onSubmit={handleSubmit(registerInsight)}>
          <div className="w-full mb-6 mt-2">
            <label
              htmlFor="rank"
              className="mb-2 block font-normal text-[15px]"
            >
              Rank
              <span className="text-red-500"> *</span>
            </label>
            <div className="flex flex-col items-start">
              <input
                type="number"
                placeholder="Eg. 2"
                className={`block w-1/4 ${
                  errors.rank ? "ring-1 ring-red-400" : ""
                } rounded-lg border border-gray-300 p-2.5 placeholder-gray-300 focus:border-gray-600  bg-gray-50 `}
                {...register("rank")}
                value={insightData.rank}
                onChange={(e) => {
                  setInsightData({
                    ...insightData,
                    rank: parseInt(e.target.value),
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
          <div className="flex mb-6 mt-2 gap-4">
            {/* Trimester Selection */}
            <div className="w-1/2">
              <label className="mb-2 block font-normal text-[15px]">
                Trimester <span className="text-red-500">*</span>
              </label>
              <Controller
                control={control}
                name="trimesters"
                rules={{ required: "Trimester selection is required" }}
                render={({ field }) => (
                  <MultiSelect
                    options={trimesterOptions}
                    value={selectedTrimester}
                    onChange={(selected: Option[]) => {
                      setSelectedTrimester(selected);
                      setSelectedWeeks([]); // Reset weeks when trimester changes
                      field.onChange(
                        selected.map((trimester) => trimester.value)
                      );
                    }}
                    labelledBy="Select Trimester"
                  />
                )}
              />

              {errors.trimesters && (
                <span className="text-xs text-red-400 ml-2 mt-1">
                  {errors.trimesters.message}
                </span>
              )}
            </div>

            {/* Week Selection */}
            <div className="w-1/2">
              <label className="mb-2 block font-normal text-[15px]">
                Weeks <span className="text-red-500">*</span>
              </label>
              <Controller
                control={control}
                name="pregnancyWeeks"
                rules={{ required: "Week selection is required" }}
                render={({ field }) => (
                  <MultiSelect
                    options={availableWeeks}
                    value={selectedWeeks}
                    onChange={(selected: Option[]) => {
                      setSelectedWeeks(selected);
                      field.onChange(selected.map((week) => week.value));
                    }}
                    labelledBy="Select Week"
                  />
                )}
              />
              {errors.pregnancyWeeks && (
                <span className="text-xs text-red-400 ml-2 mt-1">
                  {errors.pregnancyWeeks.message}
                </span>
              )}
            </div>
          </div>

          <div className="group grid grid-cols-2 gap-x-4 gap-y-8">
            <div>
              <label htmlFor="fullName" className="mb-2 block">
                Insight title <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-col items-start">
                <input
                  aria-hidden="true"
                  {...register("title")}
                  type="text"
                  placeholder="Please write the title of your insight in English here."
                  value={insightData.title}
                  className={`block w-full ${
                    errors.title ? "ring-1 ring-red-400" : ""
                  } border-1 border-gray-300 focus:border-primary focus:outline-none rounded-lg p-2.5 placeholder-gray-300 bg-gray-50 `}
                  required
                  onChange={(e) => {
                    setInsightData({
                      ...insightData,
                      title: e.target.value,
                    });
                  }}
                />
                {/* <Controller
									name="title"
									control={control}
									defaultValue=""
									render={({ field }) => (
										<ReactQuill
											value={field.value}
											onChange={field.onChange}
											className={`block w-full ${
												errors.title ? "ring-1 ring-red-400" : ""
											} rounded-lg placeholder-gray-300 focus:border-gray-600`}
											placeholder="Please write the title of your category in English here."
										/>
									)}
								/> */}
              </div>
              {errors.title && (
                <span className="text-xs text-red-400 ml-2 mt-1">
                  {errors.title.message}
                </span>
              )}
            </div>

            <div className="">
              <label htmlFor="fullName" className="mb-2 block text-[15px]">
                የግንዛቤ ርዕስ <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-col items-start">
                <input
                  type="text"
                  {...register("titleAmh")}
                  required
                  placeholder="እባክዎ የመደብ ርዕስ በአማርኛ እዚህ ይጻፉ።"
                  className={`block w-full ${
                    errors.titleAmh ? "ring-1 ring-red-400" : ""
                  } border-1 border-gray-300 focus:border-primary focus:outline-none rounded-lg p-2.5 placeholder-gray-300 bg-gray-50 `}
                  value={insightData.titleAmh}
                  onChange={(e) => {
                    setInsightData({
                      ...insightData,
                      titleAmh: e.target.value,
                    });
                  }}
                />
                {/* <Controller
									name="titleAmh"
									control={control}
									defaultValue=""
									render={({ field }) => (
										<ReactQuill
											value={field.value}
											onChange={field.onChange}
											className={`block w-full ${
												errors.titleAmh ? "ring-1 ring-red-400" : ""
											} placeholder-gray-300 focus:border-gray-600`}
											placeholder="እባክዎ የመደብ ርዕስ በአማርኛ እዚህ ይጻፉ።"
										/>
									)}
								/> */}
              </div>
              {errors.titleAmh && (
                <span className="text-xs text-red-400 ml-2 mt-1">
                  {errors.titleAmh.message}
                </span>
              )}
            </div>

            <div className="row-span-2">
              <label htmlFor="description" className="mb-2 block text-[15px]">
                Detail <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-col items-start">
                <Controller
                  name="description"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <ReactQuill
                      className="h-80 w-full"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
              {errors.description && (
                <span className="text-xs text-red-400 ml-2 mt-1">
                  {errors.description.message}
                </span>
              )}
            </div>

            <div>
              <label
                htmlFor="descriptionAmh"
                className="mb-2 block text-[15px]"
              >
                ዝርዝር <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-col items-start">
                <Controller
                  name="descriptionAmh"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <ReactQuill
                      className="h-80 w-full"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
              {errors.descriptionAmh && (
                <span className="text-xs text-red-400 ml-2 mt-1">
                  {errors.descriptionAmh.message}
                </span>
              )}
            </div>

            <div className="col-span-2">
              <label
                htmlFor="thumbnailImageFile"
                className="block text-gray-700"
              >
                Upload insight photo <span className="text-red-500">*</span>
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
                            setInsightData({
                              ...insightData,
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
                          format up to 2MB.
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
                        {insightData.thumbnailImageFile?.name}
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
              htmlFor="topics"
              className="block mb-2 col-span-2 text-sm text-gray-900 dark:text-white"
            >
              Select a topic
              <span className="text-red-500"> *</span>
            </label>
            <select
              id="topics"
              {...register("topic")}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            >
              {topics
                .filter((topic) =>
                  topic.versions.some(
                    (version) => version.language.toLowerCase() === "english"
                  )
                )
                .map((topic) => {
                  const englishVersion = topic.versions.find(
                    (version) => version.language.toLowerCase() === "english"
                  );
                  return (
                    <option key={topic._id} value={topic._id}>
                      {englishVersion?.title}
                    </option>
                  );
                })}
            </select>
            <div className="mt-6 mr-auto flex items-center col-span-2">
              <Button
                onClick={() => {
                  router.push("/insights");
                }}
                className="mt-2 mr-4 px-8 h-10.5 bg-white rounded-xl border-2 border-primary py-2.5 text-center font-medium text-primary"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="mt-2 px-8 h-10.5 rounded-xl bg-primary py-3 text-center font-medium text-white"
                disabled={addInsightLoading}
              >
                {insight !== undefined ? "Edit " : "Create "}
                Insight
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddInsightForm;
