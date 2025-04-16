import successImg from "../../public/common/success-img.png";
import { Button } from "@nextui-org/react";
import Image from "next/image";
import React, { FC, useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";

interface AddCategoryDialogProps {
  setOpen: Function;
  onConfirm: () => void; // Function to handle confirmation
}

export const AddCategoryDialog: FC<AddCategoryDialogProps> = ({
  setOpen,
  onConfirm,
}) => {
  const [loading, setLoading] = useState(false);
  const [isForm, setIsForm] = useState(true);

  const handleYesClick = () => {
    setLoading(true);

    // Simulate API call or mutation
    setTimeout(() => {
      setLoading(false);
      setIsForm(false);

      // Trigger the onConfirm function
      onConfirm();
    }, 1000);
  };

  return (
    <>
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
                <div className="relative flex flex-col w-full">
                  <div className="px-6 w-full font-semibold text-xl text-primary text-center">
                    Are you sure?
                  </div>
                  <div className="mt-14 flex items-center mx-auto">
                    <Button
                      onClick={handleYesClick} // Call handleYesClick on click
                      isLoading={loading}
                      className="mt-2 mx-4 px-5 rounded-xl bg-primary py-2 text-center font-medium text-white"
                    >
                      Yes
                    </Button>
                    <Button
                      onClick={() => setOpen(false)}
                      className="mt-2 mx-4 px-5 rounded-xl border-2 bg-white border-primary py-1.5 text-center font-medium text-primary"
                    >
                      No
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <Image
                    className="relative mt-12 mx-auto"
                    src={successImg}
                    alt="Success"
                    width={140}
                    height={100}
                    priority
                  />
                  <div className="relative px-6 py-3 mx-auto">
                    <p className="my-4 text-success text-center text-lg leading-relaxed">
                      Success!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="opacity-50 fixed inset-0 z-40 bg-black"></div>
      </div>
    </>
  );
};

export default AddCategoryDialog;
