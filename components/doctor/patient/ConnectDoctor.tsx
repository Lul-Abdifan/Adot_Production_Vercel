import React, { useState } from "react";
import { useDeleteDoctorMutation } from "@/api/doctor-api";
import MessageCard from "@/components/common/MessageCard";

interface ConnectDoctorProps {
  isOpen: boolean;
  onClose: () => void;
  onPress: () => void;
}

const ConnectDoctor: React.FC<ConnectDoctorProps> = ({
  isOpen,
  onClose,

  onPress,
}) => {
  return (
    <div>
      (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg w-[90%] max-w-3xl">
          <div className="flex justify-between border-b p-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Confirm Connection
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
              Are you sure you want to connect to this Doctor ?
              <strong>
                {/* {doctorToDelete?.firstName} {doctorToDelete?.lastName} */}
              </strong>
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
                onPress();
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

export default ConnectDoctor;
