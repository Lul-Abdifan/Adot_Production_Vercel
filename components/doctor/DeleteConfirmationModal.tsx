import React, { useState } from "react";
import { useDeleteDoctorMutation } from "@/api/doctor-api";
import MessageCard from "../common/MessageCard";

interface DeleteConfirmationModalProps {
  isOpen:boolean,
  onClose:()=> void,
  onConfirm:()=> void,

}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  return (
    <div>
      (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg w-[90%] max-w-3xl">
            <div className="flex justify-between border-b p-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Confirm Deletion
              </h2>
              <button
                onClick={onClose}
                className="px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200"
              >
                X
              </button>
            </div>
            <div className="p-4">
              <p className="text-gray-600 text-lg">
                Are you sure you want to delete?
                <strong>
                  {/* {doctorToDelete?.firstName} {doctorToDelete?.lastName} */}
                </strong>
                This action cannot be
                <span className="text-primary"> undone.</span>
              </p>
            </div>
            <div className="flex justify-end gap-2 border-t p-4">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg "
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )
    </div>
  );
};

export default DeleteConfirmationModal;
