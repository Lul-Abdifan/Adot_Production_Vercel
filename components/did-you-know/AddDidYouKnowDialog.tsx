import successImg from "../../public/common/success-img.png";
import { useAddCategoryMutation, useEditCategoryMutation, useGetSortedCategoriesQuery } from "@/api/category-api";
import { useAddFactMutation, useUpdateFactMutation } from "@/api/did-you-know";
import { Category } from "@/types/category";
import { DidYouKnowFormData, DidYouKnowFormSchema } from "@/types/form-data";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/react";
import Image from "next/image";
import React, { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IoIosCloseCircleOutline } from "react-icons/io";


interface AddDidYouKnowDialogProps {
  setOpen: Function;
  editData?: any;
}

export const AddDidYouKnowDialog: FC<AddDidYouKnowDialogProps> = ({
  setOpen,
  editData,
}) => {
  const [loading, setLoading] = useState(false);
  const [isForm, setIsForm] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const {
    data: response,
    refetch,
    isSuccess,
  } = useGetSortedCategoriesQuery({
    page: 1,
    limit: 100,
    sortBy: "rank",
    sortOrder: "asc",
    isArchived: "false",
    keyword: "",
  });

  let categories: Category[] = [];
  if (isSuccess) {
    categories = response.data.categories;
  }

  const [createDidYouKnow] = useAddFactMutation();
  const [editDidYouKnow] =useUpdateFactMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<DidYouKnowFormData>({
    mode: "onBlur",
    resolver: zodResolver(DidYouKnowFormSchema),
  });

  useEffect(() => {
    if (editData) {
      if (editData) {
        console.log(editData);
        setValue("text", { en: editData.text.en });
        setValue("category", editData.category.en); // Set initial category from editData
        // console.log(editData.category.en);
        setValue("trimester", editData.trimester);
        setValue("day", editData.day);
      }
    }
  }, [editData, setValue]);

  const formData = watch();

  const submitForm = async (data: DidYouKnowFormData) => {
    console.log("Form data being submitted:", data);

    setLoading(true);
    setError(null);

    const dataToSend = {
      category: { en: data.category },
      trimester: data.trimester,
      day: data.day,
      text: { en: data.text.en },
    };

    try {
      const res: any = editData
        ? await editDidYouKnow({ data: dataToSend, id: editData._id })
        : await createDidYouKnow({ data: dataToSend });

      if (res?.data?.statusCode === "200") {
        setIsForm(false);
        setTimeout(() => {
          setOpen(false);
        }, 2000);
      } else {
        setError("Failed to save data. Please try again.");
      }
    } catch (err) {
      console.error("Error during form submission:", err);
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-full my-6 mx-auto max-w-lg rounded-2xl">
          <div className="rounded-2xl shadow-lg relative flex p-10 text-gray-500 flex-col w-full bg-bgTile outline-none focus:outline-none">
            <button
              onClick={() => setOpen(false)}
              className="ml-auto -mt-4 -mr-4"
            >
              <IoIosCloseCircleOutline className="h-7 w-7" />
            </button>
            {isForm ? (
              <form
                onSubmit={handleSubmit(submitForm)}
                className="relative flex flex-col w-full"
              >
                <div className="px-6 w-full font-semibold text-xl text-primary">
                 {editData ? "Edit did you know" : "Add Did You Know"} 
                </div>

                {error && (
                  <p className="text-red-500 text-center mt-2">{error}</p>
                )}

                <div className="mx-6 mt-4">
                  <label
                    htmlFor="categories"
                    className="block mb-2 text-sm text-gray-900"
                  >
                    Select a category
                    <span className="text-red-500"> *</span>
                  </label>
            <select
  id="categories"
  {...register("category")}
  value={formData.category} // Controlled value
  onChange={(e) => setValue("category", e.target.value)} // Update form value on change
  className="bg-gray-50 border text-gray-900 text-sm rounded-lg block w-full p-2.5"
>
  {categories.map((category: Category) => {
    const categoryName = category.versions.find(
      (version) => version.language === "English"
    )?.title || "Unnamed";

    return (
      <option key={category._id} value={categoryName}>
        {categoryName}
      </option>
    );
  })}
</select>



                </div>

                <div className="mx-6 mt-4">
                  <label className="mb-2 block font-normal text-sm">
                    Trimester
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="3"
                    placeholder="Enter trimester"
                    className={`block w-full ${
                      errors.trimester ? "ring-1 ring-red-400" : ""
                    } rounded-lg border p-2.5 bg-gray-50`}
                    {...register("trimester", { valueAsNumber: true })}
                  />
                  {errors.trimester && (
                    <p className="text-red-500 mt-1 text-sm">
                      {errors.trimester.message}
                    </p>
                  )}
                </div>

                <div className="mx-6 mt-4">
                  <label className="mb-2 block font-normal text-sm">
                    Day
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    placeholder="Enter day"
                    className={`block w-full ${
                      errors.day ? "ring-1 ring-red-400" : ""
                    } rounded-lg border p-2.5 bg-gray-50`}
                    {...register("day", { valueAsNumber: true })}
                  />
                  {errors.day && (
                    <p className="text-red-500 mt-1 text-sm">
                      {errors.day.message}
                    </p>
                  )}
                </div>

                <div className="mx-6 mt-4">
                  <label className="mb-2 block font-normal text-sm">
                    Text (English)
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter fact in English"
                    className={`block w-full ${
                      errors.text ? "ring-1 ring-red-400" : ""
                    } rounded-lg border p-2.5 bg-gray-50`}
                    {...register("text.en")}
                  />
                  {errors.text?.en && (
                    <p className="text-red-500 mt-1 text-sm">
                      {errors.text.en.message}
                    </p>
                  )}
                </div>

                <div className="mt-10 flex items-center mx-auto">
                  <Button
                    onClick={() => setOpen(false)}
                    className="mt-2 mx-4 px-5 rounded-xl border-2 bg-white border-primary py-1.5 text-primary"
                  >
                    Cancel
                  </Button>
                  <Button
                    isLoading={loading}
                    type="submit"
                    className="mt-2 px-9 rounded-xl bg-primary py-2 text-white"
                  >
                    Save
                  </Button>
                </div>
              </form>
            ) : (
              <div>
                <Image
                  className="relative mt-12 mx-auto"
                  src={successImg}
                  alt="Success Image"
                  width={140}
                  height={100}
                  priority
                />
                <div className="px-6 py-3 mx-auto text-center">
                  <p className="my-4 text-success text-lg">Success!</p>
                  <p className="text-gray-400 text-sm">
                    {editData
                      ? "Fact has been updated successfully."
                      : "Fact has been added successfully."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="opacity-50 fixed inset-0 z-40 bg-black"></div>
    </div>
  );
};

export default AddDidYouKnowDialog;