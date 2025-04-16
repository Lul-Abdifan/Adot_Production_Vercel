"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/router";
import { usePostMaterialMutation } from "@/api/material-api";
import Image from "next/image";
import "react-toastify/dist/ReactToastify.css";

interface AddMaterialFormData {
  title: string;
  description: string;
  thumbnailImageFile: File[];
  pdfFile: File[];
}

const AddMaterialForm: React.FC = () => {
  const router = useRouter();
  const [postMaterial, { isLoading }] = usePostMaterialMutation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<AddMaterialFormData>({
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      thumbnailImageFile: [],
      pdfFile: [],
    },
  });

  const [imagePreview, setImagePreview] = useState<string>("");
  const [pdfName, setPdfName] = useState<string>("");

  // Handle file changes
  const handleFileChange = (name: "thumbnailImageFile" | "pdfFile") => 
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setValue(name, [file], { shouldValidate: true });

        if (name === "thumbnailImageFile") {
          setImagePreview(URL.createObjectURL(file));
        } else {
          setPdfName(file.name);
        }
      } else {
        // Clear the file if no file is selected
        setValue(name, [], { shouldValidate: true });
        if (name === "thumbnailImageFile") {
          setImagePreview("");
        } else {
          setPdfName("");
        }
      }
    };

  const onSubmit = async (data: AddMaterialFormData) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);

      // Append cover image if provided
      if (data.thumbnailImageFile && data.thumbnailImageFile[0]) {
        formData.append("thumbnailImage", data.thumbnailImageFile[0]);
      }

      // Append PDF file if provided
      if (data.pdfFile && data.pdfFile[0]) {
        formData.append("document", data.pdfFile[0]);
      }

      await postMaterial({ data: formData }).unwrap();
      toast.success("Material created successfully!");
      router.push("/materials");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create material. Please try again.");
    }
  };

  return (
    <div className="flex w-full text-sm text-secondary flex-col items-center sm:justify-center">
      <ToastContainer />
      <div className="w-full rounded-md bg-white px-6 py-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Title Field */}
          <div className="w-full mb-6">
            <label htmlFor="title" className="mb-2 block font-normal text-[15px]">
              Title <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-col items-start">
              <input
                id="title"
                type="text"
                placeholder="Enter material title"
                className={`block w-full rounded-lg border p-2.5 ${
                  errors.title ? "border-red-400" : "border-gray-300"
                } focus:outline-none focus:border-primary`}
                {...register("title", {
                  required: "Title is required",
                  maxLength: {
                    value: 100,
                    message: "Title cannot exceed 100 characters",
                  },
                })}
              />
              {errors.title && (
                <span className="text-xs text-red-500">
                  {errors.title.message}
                </span>
              )}
            </div>
          </div>

          {/* Description Field */}
          <div className="w-full mb-6">
            <label htmlFor="description" className="mb-2 block font-normal text-[15px]">
              Brief Description <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-col items-start">
              <textarea
                id="description"
                placeholder="Enter detailed description..."
                rows={4}
                className={`block w-full rounded-lg border p-2.5 ${
                  errors.description ? "border-red-400" : "border-gray-300"
                } focus:outline-none focus:border-primary`}
                {...register("description", {
                  required: "Description is required",
                  maxLength: {
                    value: 500,
                    message: "Description cannot exceed 500 characters",
                  },
                })}
              />
              {errors.description && (
                <span className="text-xs text-red-500">
                  {errors.description.message}
                </span>
              )}
            </div>
          </div>

          {/* Cover Image Upload (Optional) */}
          <div className="w-full mb-6">
            <label htmlFor="thumbnailImageFile" className="mb-2 block font-normal text-[15px]">
              Cover Image
            </label>
            <div className="flex flex-col items-start">
              <div className={`w-full overflow-hidden mb-4 h-56 bg-gray-50 ${
                errors.thumbnailImageFile ? "border-red-400" : "border-gray-300"
              } border-dashed border-2 rounded-lg items-center mx-auto text-center cursor-pointer`}>
                <input
                  id="thumbnailImageFile"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  {...register("thumbnailImageFile")}
                  onChange={handleFileChange("thumbnailImageFile")}
                />
                <label htmlFor="thumbnailImageFile" className="cursor-pointer w-full h-full">
                  {!imagePreview && (
                    <div className="m-6 my-10">
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
                        <b className="text-gray-600">JPG, PNG, or JPEG</b> format up to 2MB.
                      </p>
                    </div>
                  )}
                  {imagePreview && (
                    <Image
                      className="mx-auto mt-0.5 object-contain"
                      src={imagePreview}
                      alt="Preview"
                      width={400}
                      height={150}
                    />
                  )}
                </label>
              </div>
            </div>
          </div>

          {/* PDF Upload (Optional) */}
          <div className="w-full mb-6">
            <label htmlFor="pdfFile" className="mb-2 block font-normal text-[15px]">
              PDF File
            </label>
            <div className="flex flex-col items-start">
              <div className={`w-full overflow-hidden mb-4 h-56 bg-gray-50 ${
                errors.pdfFile ? "border-red-400" : "border-gray-300"
              } border-dashed border-2 rounded-lg items-center mx-auto text-center cursor-pointer`}>
                <input
                  id="pdfFile"
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  {...register("pdfFile")}
                  onChange={handleFileChange("pdfFile")}
                />
                <label htmlFor="pdfFile" className="cursor-pointer w-full h-full">
                  {!pdfName && (
                    <div className="m-6 my-10">
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
                        Choose a PDF file
                      </h5>
                      <p className="font-light text-sm text-gray-400 md:px-6">
                        <b className="text-gray-600">PDF</b> format up to 5MB.
                      </p>
                    </div>
                  )}
                  {pdfName && (
                    <div className="p-4">
                      <p className="text-lg font-medium text-gray-700">
                        Selected PDF:
                      </p>
                      <p className="text-sm text-gray-600 mt-2">{pdfName}</p>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 mr-auto flex items-center">
            <Button
              onClick={() => router.push("/materials")}
              className="mt-2 mr-4 px-8 h-10.5 bg-white rounded-xl border-2 border-primary py-2.5 text-center font-medium text-primary"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="mt-2 px-8 h-10.5 rounded-xl bg-primary py-3 text-center font-medium text-white"
              isLoading={isLoading}
              isDisabled={!isValid}
            >
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMaterialForm;