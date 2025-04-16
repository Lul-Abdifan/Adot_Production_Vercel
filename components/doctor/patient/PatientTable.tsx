import React, { Key, useCallback, useEffect, useMemo, useState } from "react";
import {
  useGetPatientsForDoctorQuery,
  useConnectToDoctorMutation,
  useDisConnectPatientForDoctorMutation,
} from "@/api/doctor-api";
import Link from "next/link";
import { PatientData, Patient } from "@/types/patient";
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md";

import {
  Avatar,
  Button,
  Input,
  Pagination,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Spinner,
  Checkbox,
} from "@nextui-org/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";
import successImg from "../../../public/common/success-img.png";
import errorImg from "../../../public/common/error-img.png";

import { useRouter } from "next/router";
import { Chip } from "@nextui-org/react";
import { QueryActionCreatorResult } from "@reduxjs/toolkit/query";
import MessageCard from "@/components/common/MessageCard";
import ConnectDoctor from "./ConnectDoctor";
import { BsThreeDots } from "react-icons/bs";
import { HiDotsHorizontal } from "react-icons/hi";
import { SingleSelect } from "@/types/select";

interface PatientListProps {
  patientList: PatientData[];
  refetch?: () => Promise<QueryActionCreatorResult<any>>;
  loading: boolean;
  count?: number;
  doctor?: any;
  pages?: number;
  setSearchPeriod?: React.Dispatch<React.SetStateAction<boolean>>;
  onNextPage?: Function;
  onPageChange?: Function;
  onPreviousPage?: Function;
  currentPage?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  onSortChange?: (field: string, order: "asc" | "desc") => void;
}

export default function PatientTable({
  patientList,
  currentPage,
  loading,
  onNextPage,
  onPageChange,
  count,
  doctor,
  pages,
  onPreviousPage,
  setSearchPeriod,
  refetch,
  sortBy,
  sortOrder,
  onSortChange,
}: PatientListProps) {
  const router = useRouter();
  const { id } = router.query;
  const doctorId = Array.isArray(id) ? id[0] : id || "default-id";

  const [isModalOpen, setIsModalOpen] = useState(false);

  const onCloseConnect = () => setIsModalOpen(false);
  const onOpenConnect = () => setIsModalOpen(false);


   const filters: SingleSelect[] = [
          {
              _id: "1",
              name: "All",
              value: "all",
          },
          {
              _id: "3",
              name: "Active",
              value: "false",
          },
          {
              _id: "2",
              name: "Archived",
              value: "true",
          },
      ];

  const [isResponseModal, setIsResponseModal] = useState(false);
  const [isdelPatient, setIsDelPatientModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<PatientData | null>(
    null
  );

  const [connectToDoctor, { isLoading, isSuccess, isError }] =
    useConnectToDoctorMutation();

  const [disconnectPatientsFromDoctor] =
    useDisConnectPatientForDoctorMutation();
  const messages = {
    success: {
      detail: "Succeeded!",
      img: successImg,
      textColor: "text-success",
      bgColor: "bg-[#DBF7E0]",
    },
    error: {
      detail: "An error has occured!",
      img: errorImg,
      textColor: "text-red-500",
      bgColor: "bg-red-50",
    },
  };
  const [message, setMessage] = useState(messages.error);

  const updateErrorToBackened = (backendError: string) => {
    if (backendError) {
      messages.error.detail = backendError;
    }
  };

  const [isPatLoading, SetPatIsLoading] = useState(false);
  const [selectedPatients, setSelectedPatients] = useState<string[]>([]);
  const handleSelectAll = (isChecked: boolean) => {
    isChecked
      ? setSelectedPatients(patientList.map((pat) => pat._id))
      : setSelectedPatients([]);
    // isChecked ? patientList.forEach((pat) => handleSelectPatient(pat._id,true)) : setSelectedPatients([]);
  };

  const handleSelectPatient = (patientId: string, isChecked: boolean) => {
    setSelectedPatients((prev) =>
      isChecked ? [...prev, patientId] : prev.filter((id) => id !== patientId)
    );
  };

  const handleOpenDelPatModal = () => {
    if (selectedPatients.length === 0) {
      setMessage({
        ...messages.error,
        detail: "Please select at least one patient to disconnect.",
      });
      setIsResponseModal(true);
    } else {
      setIsDelPatientModal(true);
    }
  };

  const handleDisconnectPatients = async () => {
    SetPatIsLoading(() => true);
    console.log("patients", selectedPatients);
    console.log("doctorId", doctorId);

    try {
      // Trigger Mutation
      await disconnectPatientsFromDoctor({
        patientId: selectedPatients,
        doctorId,
      }).unwrap();
      refetch?.();
      setSelectedPatients([]);

      setMessage({
        ...messages.success,
        detail: ` Successfully disconnected ${selectedPatients.length} patient(s) from the doctor.`,
      });
      setIsResponseModal(true);
    } catch (error: any) {
      setMessage({
        ...messages.error,
        detail:
          "Error: Unable to process your request. Please try again later.",
      });
      setIsResponseModal(true);
    } finally {
      setTimeout(() => setIsResponseModal(false), 5000);
      setIsDelPatientModal(false);
      SetPatIsLoading(false);
    }
  };

  // useEffect(()=>{
  //   console.log(patientList)
  //    if(selectedPatients.length){
  //     // setButt(true)
  //    }
  // },[isPatLoading,selectedPatients])

  // console.log(butt,selectedPatients)

  const handleShowModal = () => {
    setIsResponseModal(true); // Set it to true
    setTimeout(() => {
      setIsResponseModal(false); // Change to false after 5 seconds
    }, 5000); // 5000 milliseconds = 5 seconds
  };

  const addToDoctor = async (patientId: any) => {
    try {
      // Trigger the mutation
      const result = await connectToDoctor({ doctorId, patientId }).unwrap();

      refetch?.();
      setIsModalOpen(false);

      setSearchPeriod?.(false);
      setMessage(messages.success);

      handleShowModal();
    } catch (error: any) {
      if (error?.data?.message) {
        updateErrorToBackened(error?.data?.message);
      }
      setMessage(messages.error);

      handleShowModal();
    }
  };

  const handleOpenModal = (patient: PatientData) => {
    setSelectedPatient(patient);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedPatient(null);
    setIsModalOpen(false);
  };

  const tHeads = [
    { name: "", uid: "checkbox", canbesorted: false, sortable: false },
    {
      name: "Patient Name",
      uid: "patientName",
      canbesorted: true,
      sortable: false,
    },
    { name: "Trimester", uid: "trimester", canbesorted: false, sortable: false },
    {
      name: "Pregnancy /week",
      uid: "weekOfPregnancy",
      canbesorted: true,
      sortable: false,
    },
    { name: "Phone Number", uid: "phone", canbesorted: false, sortable: false },
    { name: "Status", uid: "status", canbesorted: false, sortable: false },
    { name: "Action", uid: "action", canbesorted: false, sortable: false },
  ];

  const bottomContent = useMemo(() => {
    const totalPages = Math.ceil((count || 0) / 7) || 1;

    return (
      <div className=" bg-white   flex justify-between items-center">
        {/* Display total patient count */}
        <span className="w-[30%] text-small text-default-400">
          {selectedPatients.length > 0
            ? `${selectedPatients.length} Patients Selected`
            : ` ${count} patients in total`}
        </span>

        {/* Pagination Component */}
        {onPageChange && (
          <Pagination
            isCompact
            showControls
            showShadow
            color="primary"
            page={currentPage}
            total={pages ?? 0}
            onChange={(e) => onPageChange(e)}
          />
        )}

        {/* Cancel and Remove Buttons */}
        {selectedPatients.length > 0 ? (
          <div className="hidden sm:flex w-[30%] justify-end gap-2">
            <Button
              size="sm"
              variant="flat"
              onPress={() => handleSelectAll(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-red-500 text-white "
              size="sm"
              variant="flat"
              onPress={handleOpenDelPatModal}
            >
              Remove
            </Button>
          </div>
        ) : (
          <div className="hidden sm:flex w-[30%] justify-end gap-2">
            <Button
              isDisabled={currentPage === 1} // Disable "Previous" on the first page
              size="sm"
              variant="flat"
              onPress={onPreviousPage ? () => onPreviousPage() : undefined}
            >
              Previous
            </Button>
            <Button
              isDisabled={currentPage === totalPages} // Disable "Next" on the last page
              size="sm"
              variant="flat"
              onPress={onNextPage ? () => onNextPage() : undefined}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    );
  }, [
    count,
    currentPage,
    onNextPage,
    onPreviousPage,
    onPageChange,
    selectedPatients,
  ]);

  const t: any = {
    patientName: "",
    name: "",
    timester: "",
    email: "",
    phoneNumber: "",
    updatedAt: "",
  };

  const shimmers = [t, t, t, t, t];

  const renderCell = useCallback(
    (isPatient: boolean, pat: PatientData, columnKey: Key) => {
      switch (columnKey) {
        case "checkbox":
          // console.log(selectedPatients.filter(id => id === pat._id).length > 0)
          const isChecked = selectedPatients.includes(pat?._id);
          return (
            <div className="transform scale-150 pl-10">
              <Checkbox
                size="lg"
                className="checked:bg-primary"
                checked={isChecked}
                key={pat._id}
                onChange={(e) => handleSelectPatient(pat._id, e.target.checked)}
              />
            </div>
          );
        case "patientName":
          return (
            <>
              {isPatient ? (
                <div className="flex gap-6">
                  {pat?.profileImage ? (
                    <div className="bg-gray-200 rounded-full w-fit h-fit">
                      <Avatar
                        src={pat?.profileImage}
                        alt="Profile"
                        className="w-10 h-10 rounded-full"
                      />
                    </div>
                  ) : (
                    <Avatar name={pat?.firstName} />
                  )}
                  <div className="flex flex-col gap-2font-normal text-[.85rem]">
                    {pat && pat?.firstName} {pat && pat?.lastName}
                    <p className="text-blue-500 hover:underline">
                      {pat?.email ? pat?.email : "No Email"}
                    </p>
                  </div>
                </div>
              ) : (
                <Skeleton className="h-10 w-10 rounded-full" />
              )}
            </>
          );

        case "weekOfPregnancy":
          return (
            <>
              {isPatient ? (
                <div className="text-[.82rem] text-[#D88D04] font-normal">
                  <span className="w-12 h-12 flex items-center justify-center bg-[#D88D04] bg-opacity-20 rounded-full">
                    {pat && pat?.weekOfPregnancy ? pat?.weekOfPregnancy : "NA"}
                  </span>
                </div>
              ) : (
                <div className="mr-32 w-full">
                  <Skeleton className="h-3 mb-2 w-4/5 rounded-full" />
                </div>
              )}
            </>
          );

        case "phone":
          return (
            <>
              {isPatient ? (
                <div className="text-[.82rem] text-title font-normal">
                  {pat && pat?.phoneNumber != "" && pat && pat.phoneNumber
                    ? pat?.phoneNumber
                    : "No Phone No."}
                </div>
              ) : (
                <div className="mr-32 w-full">
                  <Skeleton className="h-3 mb-2 w-4/5 rounded-full" />
                </div>
              )}
            </>
          );

        case "action":
          return (
            <div>
              <HiDotsHorizontal size={28} />
            </div>
          );
        case "trimester":
          return (
            <>
              {isPatient ? (
                <div className="text-[.82rem] text-primary font-normal">
                  <span className="w-12 h-12 flex items-center justify-center bg-primary bg-opacity-20 rounded-full">
                    {pat?.trimester || "NA"}
                  </span>
                </div>
              ) : (
                <div className="mr-32 w-full">
                  <Skeleton className="h-3 mb-2 w-4/5 rounded-full" />
                </div>
              )}
            </>
          );

        case "status":
          return (
            <>
              {isPatient ? (
                <div className="text-[.82rem] text-title font-normal">
                  {pat &&
                  pat.requestStatus !== undefined &&
                  pat.requestStatus !== null ? (
                    pat.requestStatus === true ? (
                      <Chip
                        className="capitalize pr-2"
                        color="success"
                        size="sm"
                        variant="flat"
                      >
                        Active
                      </Chip>
                    ) : (
                      <Chip
                        className="capitalize pr-2"
                        color="warning"
                        size="sm"
                        variant="flat"
                      >
                        Pending
                      </Chip>
                    )
                  ) : (
                    <button
                      onClick={() => handleOpenModal(pat)}
                      className="bg-primary text-white font-medium text-xs px-4 py-2 rounded-2xl flex items-center"
                    >
                      Connect
                    </button>
                  )}
                </div>
              ) : (
                <div className="mr-32 w-full">
                  <Skeleton className="h-3 mb-2 w-4/5 rounded-full" />
                </div>
              )}
            </>
          );

        default:
          return <div></div>;
      }
    },
    [router, selectedPatients]
  );
  return (
    <div className="">
      <Table
        aria-label="Example table with custom cells, pagination and sorting"
        isHeaderSticky
        {...(!setSearchPeriod && { bottomContent: bottomContent })}
        bottomContentPlacement="inside"
        topContentPlacement="outside"
        removeWrapper={true}
        className=""
      >
        <TableHeader columns={tHeads} className="bg-white border-none border-0">
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting={column.sortable}
              className="py-4 bg-white border-none border-collapse"
            >
              {column.uid === "checkbox" ? (
                <div className="transform scale-150 pl-10">
                  <Checkbox
                    size="lg"
                    type="checkbox"
                    className="w-6 h-6 chekced:bg-primary"
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    checked={selectedPatients.length > 0}
                  />
                </div>
              ) : (
                <div className="flex items-center gap-4 text-lg text-[#202430]">
                  {column.name}
                  {column.canbesorted && (
                    <div
                      className="flex flex-col gap-0 cursor-pointer"
                      onClick={() => {
                        if (column.uid === "weekOfPregnancy") {
                          onSortChange?.(
                            "dueDate",
                            sortOrder === "asc" ? "desc" : "asc"
                          );
                        }
                        if (column.uid === "patientName") {
                          onSortChange?.(
                            "name",
                            sortOrder === "asc" ? "desc" : "asc"
                          );
                        }
                      }}
                    >
                      {/* Up Arrow - Ascending Sort */}
                      <MdKeyboardArrowUp size={20} />

                      {/* Down Arrow - Descending Sort */}
                      <MdKeyboardArrowDown size={20} />
                    </div>
                  )}
                </div>
              )}
            </TableColumn>
          )}
        </TableHeader>

        {loading ? (
          <TableBody>
            {shimmers.map((topic, i) => (
              <TableRow key={i}>
                {(columnKey) => (
                  <TableCell>{renderCell(false, topic, columnKey)}</TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        ) : (
          <TableBody>
            {patientList.map((pat: PatientData) => (
              <TableRow
                key={pat?._id}
                className={` border-white border-[6px] cursor-pointer bg-[#F8F6FB] h-24 ${
                  selectedPatients.includes(pat?._id) && "bg-[#EDE7EC]"
                }`}
              >
                {(columnKey) => (
                  <TableCell>{renderCell(true, pat, columnKey)} </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>

      {/* Modal */}
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className={"text-primary"}>
                  {`Are you sure you want to add ${selectedPatient?.firstName} ${selectedPatient?.lastName}?`}
                </ModalHeader>

                <ModalFooter>
                  <Button color="danger" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button
                    color="primary"
                    onPress={() => {
                      addToDoctor(selectedPatient?._id);
                      onClose();
                    }}
                  >
                    Confirm
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      )}

      {isResponseModal && (
        <Modal
          isOpen={isResponseModal}
          onOpenChange={setIsResponseModal}
          // className="w-80 h-56"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader
                  className={"text-primary flex justify-center items-center"}
                >
                  <MessageCard
                    img={message.img}
                    textColor={message.textColor}
                    detail={message.detail}
                  />
                </ModalHeader>
              </>
            )}
          </ModalContent>
        </Modal>
      )}

      {isdelPatient && (
        <Modal isOpen={isdelPatient} onOpenChange={setIsDelPatientModal}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="text-lg text-primary font-bold pb-0 px-8">
                  Confirm Disconnection
                </ModalHeader>

                <ModalBody className="px-8 ">
                  <p className="text-gray-700">
                    You are about to disconnect{" "}
                    <strong>{selectedPatients.length} patients</strong> from{" "}
                    <strong>{`${doctor.firstName} ${doctor.lastName}`}</strong>.
                    This action is irreversible. Are you sure you want to
                    proceed?
                  </p>
                </ModalBody>

                <ModalFooter className="flex justify-left gap-4 pb-4">
                  <Button
                    className="bg-gray-200 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-300"
                    onPress={onClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600"
                    onPress={handleDisconnectPatients}
                    disabled={isPatLoading}
                  >
                    {isPatLoading ? (
                      <>
                        processing <Spinner size="sm" color="warning" />{" "}
                      </>
                    ) : (
                      "Remove"
                    )}
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      )}
    </div>
  );
}
