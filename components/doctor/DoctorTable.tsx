import React, { Key, useCallback, useEffect, useMemo, useState } from "react";
import { useGetSortedDoctorsQuery } from "@/api/doctor-api";
import Link from "next/link";
import { Doctor } from "@/types/doctor";
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Pagination,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { useRouter } from "next/router";
import { Chip } from "@nextui-org/react";
import { MdOutlineDelete } from "react-icons/md";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { useDeleteDoctorMutation } from "@/api/doctor-api";
import MessageCard from "../common/MessageCard";
import successImg from "../../public/common/success-img.png";
import errorImg from "../../public/common/error-img.png";

interface DoctorTableProps {
  setOpen?: Function;
  setSelectedDoctor?: Function;
  loading?: boolean;
  setLoading?: Function;
  setDoctors?: Function;
  refetch?: Function;
  pages?: number;
  doctorFilters: {
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: string;
    status: string;
    keyword: string;
  };
  setDoctorFilters?: Function;
  count?: number;
  doctors?: Doctor[];
  onPageChange?: Function;
  onPreviousPage?: any;
  onNextPage?: any;
  sortTable?: Function;
}

const DoctorTable: React.FC<DoctorTableProps> = ({
  setOpen,
  setSelectedDoctor,
  loading,
  doctorFilters,
  pages,
  count,
  doctors,
  onPageChange,
  onPreviousPage,
  onNextPage,
  sortTable,
  refetch,
}) => {
  const tHeads = [
    { name: "Image", uid: "image", sortable: true },
    { name: "Name", uid: "name", sortable: true },
    { name: "Email", uid: "email", sortable: false },
    { name: "PhoneNumber", uid: "phone", sortable: false },
    { name: "Sign-In Date", uid: "date", sortable: true },
    { name: "Year of Exp.", uid: "year", sortable: true },
    { name: "Status", uid: "status", sortable: false },
    { name: "Actions", uid: "action", sortable: false },
  ];

  const router = useRouter();


  const t: any = {
    _id: "",
    firstName: "",
    lastName: "",
    email: "",
    createdAt: "",
    updatedAt: "",
  };

  const shimmers = [t, t, t, t, t];

  const [deleteStatus, setDeleteStatus] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>("");
  const [deleteDoctor] = useDeleteDoctorMutation();

  const deleteModalOpen = (doctorId: string) => {
    setSelectedDoctorId(doctorId);
    setDeleteStatus(true);
  };

  const deleteModalClose = () => {
    setSelectedDoctorId("");
    setDeleteStatus(false);
  };

  const [message, setMessage] = useState({
    img: errorImg,
    textColor: "text-red",
    detail: "",
  });

  const [showMessage, setShowMessage] = useState(false);
  useEffect(() => {
    if (message.detail) {
      setShowMessage(true);
      const timer = setTimeout(() => setShowMessage(false), 5000);

      return () => clearTimeout(timer);
    }
  }, [message.detail]);

  const handleDelete = async () => {
    if (!selectedDoctorId) {
      return;
    }

    try {
      await deleteDoctor({ doctorId: selectedDoctorId }).unwrap();
      if (refetch) refetch();

      setMessage({
        img: successImg,
        textColor: "text-green-500",
        detail: "Doctor deleted successfully!",
      });

      deleteModalClose();
    } catch (err: any) {
      deleteModalClose();
      let errorMessage = "An unknown error occurred. Please try again.";

      if (err.name === "FetchError") {
        errorMessage = "Network error: Please check your internet connection.";
      } else if (err?.statusCode === 404) {
        errorMessage =
          "Doctor not found. Please refresh the page and try again.";
      } else if (err?.statusCode === 500) {
        errorMessage = "Internal server error. Please try again later.";
      } else if (err?.data?.message) {
        errorMessage = err.data.message;
      }

      setMessage({
        img: errorImg,
        textColor: "text-red-500",
        detail: errorMessage,
      });
    }
  };

  const calculateCircleColor = (percentage: number): string => {
    if (percentage <= 35) {
      return "#ff4d4f"; // Red color for 0% - 35%
    } else if (percentage <= 65) {
      return "#ffcc00"; // Yellow color for 36% - 65%
    } else {
      return "#73d13d"; // Green color for 66% and above
    }
  };

  const renderExperienceCircle = (year: number, maxYear: number) => {
    const percentage = (year / maxYear) * 100; // Calculate percentage
    const circleColor = calculateCircleColor(percentage); // Get the circle color

    // Full circle's circumference formula: 2 * PI * radius
    const radius = 20;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference; // Calculate strokeDashoffset to fill circle

    return (
      <div className="relative w-12 h-12 flex items-center justify-center">
        <svg width="48" height="48" className="absolute">
          <circle
            cx="24"
            cy="24"
            r={radius}
            fill="none"
            strokeWidth="4"
            stroke="lightgray" // Background circle color
          />
          <circle
            cx="24"
            cy="24"
            r={radius}
            fill="none"
            strokeWidth="4"
            strokeLinecap="round"
            stroke={circleColor} // Dynamic color based on percentage
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 24 24)" // Rotate the circle to start from the top
          />
        </svg>
        <div className="absolute text-xs font-medium text-gray-700">{year}</div>
      </div>
    );
  };

  const { data: allDocs } = useGetSortedDoctorsQuery({
    page: 1,
    limit: 100,
    sortBy: "year",
    sortOrder: "desc",
    keyword: "",
    status: "All",
  });

  const allDoctors: Doctor[] = allDocs?.data?.users || [];

  const maxYear: number = allDoctors[0]?.yearOfExperince; // Find the max year

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      year: "numeric",
    };
    const dateObject = new Date(dateString);
    return dateObject.toLocaleDateString("en-US", options);
  };

  const formatTime = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "numeric",
      hour12: false,
    };
    const dateObject = new Date(dateString);
    const time = dateObject.toLocaleDateString("en-US", options).split(",");
    return time[1];
  };

  const renderCell = useCallback(
    (isDoctor: boolean, doctor: Doctor, columnKey: Key) => {
      switch (columnKey) {
        case "image":
          return (
            <>
              {isDoctor ? (
                <>
                  {doctor.profileImage ? (
                    <div className="bg-gray-200 rounded-full w-fit h-fit">
                      <Avatar
                        src={doctor.profileImage}
                        alt="Profile"
                        className="w-10 h-10 rounded-full"
                      />
                    </div>
                  ) : (
                    <Avatar name={doctor.firstName[0]} />
                  )}
                </>
              ) : (
                <Skeleton className="h-10 w-10 rounded-full" />
              )}
            </>
          );
        case "name":
          return (
            <>
              {isDoctor ? (
                <div className="font-normal text-[.85rem]">
                  {doctor && doctor.firstName} {doctor && doctor.lastName}
                </div>
              ) : (
                <div className="mr-32 w-full">
                  <Skeleton className="h-3 mb-2 w-4/5 rounded-full" />
                </div>
              )}
            </>
          );
        case "email":
          return (
            <>
              {isDoctor ? (
                <div className="text-s text-title font-normal text-[.85rem]">
                  {doctor && (
                    <Link href={`mailto:${doctor.email}`} passHref>
                      <p className="text-blue-500 hover:underline">
                        {doctor.email}
                      </p>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="mr-32 w-full">
                  <Skeleton className="h-3 mb-2 w-4/5 rounded-full" />
                </div>
              )}
            </>
          );
        case "year":
          return (
            <>
              {isDoctor ? (
                <div className="flex justify-center pr-10">
                  {renderExperienceCircle(doctor.yearOfExperince ?? 0, maxYear)}
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
              {isDoctor ? (
                <div className="text-[.82rem] text-title font-normal">
                  {doctor && doctor.phoneNumber != ""
                    ? doctor.phoneNumber
                    : "No Phone No."}
                </div>
              ) : (
                <div className="mr-32 w-full">
                  <Skeleton className="h-3 mb-2 w-4/5 rounded-full" />
                </div>
              )}
            </>
          );
        case "date":
          return (
            <>
              {isDoctor ? (
                <div className="text-[.8rem] text-title font-normal">
                  {doctor && formatDate(doctor.createdAt)}
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
              {isDoctor ? (
                <>
                  {doctor.isVerified && (
                    <Chip
                      className="capitalize pr-2"
                      color={"success"}
                      size="sm"
                      variant="flat"
                    >
                      Active
                    </Chip>
                  )}
                  {!doctor.isVerified && (
                    <Chip
                      className="capitalize pr-2"
                      color={"warning"}
                      size="sm"
                      variant="flat"
                    >
                      Pending
                    </Chip>
                  )}
                </>
              ) : (
                <div className="mr-32 w-full">
                  <Skeleton className="h-3 mb-2 w-4/5 rounded-full" />
                </div>
              )}
            </>
          );
        case "action":
          return (
            <>
              {isDoctor ? (
                <div
                  className="text-[.8rem] text-title font-normal"
                  onClick={(event) => {
                    event.stopPropagation();
                    deleteModalOpen(doctor._id);
                  }}
                >
                  {doctor && <MdOutlineDelete size={25} color="warning" />}
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
    [router]
  );

  const bottomContent = useMemo(() => {
    return (
      <div className="pt-4 bg-white rounded-2xl px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {count} doctors in total
        </span>
        {onPageChange && (
          <Pagination
            isCompact
            showControls
            showShadow
            color="primary"
            page={doctorFilters?.page}
            total={pages ?? 0}
            initialPage={1}
            onChange={(e) => onPageChange(e)}
          />
        )}
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            Previous
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }, [doctorFilters, pages, onNextPage, onPageChange, onPreviousPage, count]);

  return (
    <div className="p-6 rounded-2xl shadow-sm">
      {deleteStatus && (
        <DeleteConfirmationModal
          isOpen={deleteStatus}
          onClose={deleteModalClose}
          onConfirm={handleDelete}
        />
      )}

      {showMessage && (
        <div className="absolute   top-1/3 w-[35%] rounded-3xl bg-white z-[60]">
          <MessageCard
            img={message.img}
            textColor={message.textColor}
            detail={message.detail}
          />
        </div>
      )}

      <Table
        aria-label="Example table with custom cells, pagination and sorting"
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="inside"
        sortDescriptor={{
          column: doctorFilters.sortBy,
          direction:
            doctorFilters.sortOrder == "asc" ? "ascending" : "descending",
        }}
        onSortChange={(e) => sortTable?.(e)}
        topContentPlacement="outside"
        removeWrapper={true}
        className="text-secondary w-full h-full"
      >
        <TableHeader columns={tHeads}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting={column.sortable}
            >
              {column.name}
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
            {(doctors ?? []).map((doctor: Doctor) => (
              <TableRow
                key={doctor._id}
                className="border-b border-gray-200 cursor-pointer"
                onClick={() => router.push(`hospital/${doctor._id}`)}
              >
                {(columnKey) => (
                  <TableCell>{renderCell(true, doctor, columnKey)}</TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
    </div>
  );
};

export default DoctorTable;
