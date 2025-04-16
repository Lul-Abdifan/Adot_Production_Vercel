"use client";

import { FC, useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/router";

interface EditMaterialFormProps {
  material?: {
    id: string;
    rank: number;
    title: string;
    description: string;
    titleAmh: string;
    descriptionAmh: string;
    thumbnailImage?: string;
    topic: string;
  };
}

const EditMaterialForm: FC<EditMaterialFormProps> = ({ material }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    rank: material?.rank || 0,
    title: material?.title || "",
    description: material?.description || "",
    titleAmh: material?.titleAmh || "",
    descriptionAmh: material?.descriptionAmh || "",
    topic: material?.topic || "",
    thumbnailImageFile: undefined as File | undefined,
  });

  const [previewUrl, setPreviewUrl] = useState<string | undefined>(
    material?.thumbnailImage
  );

  const showSuccessMessage = () => {
    toast.success("Material updated successfully!", {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  const showErrorMessage = () => {
    toast.error("Update failed. Please try again.", {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  useEffect(() => {
    if (formData.thumbnailImageFile) {
      const imageUrl = URL.createObjectURL(formData.thumbnailImageFile);
      setPreviewUrl(imageUrl);
    } else {
      setPreviewUrl(material?.thumbnailImage);
    }
  }, [formData.thumbnailImageFile, material?.thumbnailImage]);

  const handleImageRemove = () => {
    setFormData({ ...formData, thumbnailImageFile: undefined });
    setPreviewUrl("");
  };

  const handleFormSubmit = () => {
    setLoading(true);

    // Simulate form submission
    setTimeout(() => {
      setLoading(false);
      showSuccessMessage();
      router.push("/materials");
    }, 1000);
  };

  return (
    <div className="flex w-full text-sm text-secondary flex-col items-center sm:justify-center">
      <ToastContainer />
      <div className="w-full rounded-md bg-white px-6 py-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleFormSubmit();
          }}
        >
          {/* Title Field */}
          <div className="w-full mb-6">
            <label htmlFor="title" className="mb-2 block font-normal text-[15px]">
              Material Title <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-col items-start">
              <input
                type="text"
                placeholder="Enter title in English"
                className="block w-full rounded-lg border border-gray-300 p-2.5 placeholder-gray-300 bg-gray-50 focus:outline-none focus:border-primary"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>
          </div>

          {/* Description Field */}
          <div className="w-full mb-6">
            <label htmlFor="description" className="mb-2 block font-normal text-[15px]">
              Detail (English) <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-col items-start">
              <ReactQuill
                value={formData.description}
                onChange={(value) =>
                  setFormData({ ...formData, description: value })
                }
                className="w-full h-40"
              />
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="w-full mb-6 mt-[60px]">
            <label htmlFor="thumbnailImageFile" className="mb-2 block font-normal text-[15px]">
              Upload Material Images <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-col items-start">
              <div className="w-full overflow-hidden mb-4 h-56 bg-gray-50 border-dashed border-2 border-gray-300 rounded-lg items-center mx-auto text-center cursor-pointer">
                {!previewUrl && (
                  <div className="m-6 my-10">
                    <input
                      id="thumbnailImageFile"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          thumbnailImageFile: e.target.files?.[0],
                        })
                      }
                    />
                    <label htmlFor="thumbnailImageFile" className="cursor-pointer">
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
                    </label>
                  </div>
                )}
                {previewUrl && (
                  <Image
                    className="mx-auto mt-0.5 object-contain"
                    src={previewUrl}
                    alt="Preview"
                    width={400}
                    height={150}
                  />
                )}
              </div>
              {previewUrl && (
                <button
                  type="button"
                  onClick={handleImageRemove}
                  className="text-red-500 mt-2"
                >
                  Remove Image
                </button>
              )}
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
              isLoading={loading}
            >
              Submit Change
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMaterialForm;