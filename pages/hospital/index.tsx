import SearchBar from "@/components/common/SearchBar";
import RootLayout from "@/layouts/RootLayout";
import { useGetHospitalsDoctorQuery } from "@/api/doctor-api";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useGetProfileQuery } from "@/api/user-api";
import DoctorTable from "@/components/doctor/DoctorTable";
import { IoAddOutline } from "react-icons/io5";
import AddDoctorDialog from "@/components/doctor/AddDoctorForm";

export default function Hospital() {
  const [hospitalAdminId, setHosipitalAdmin] = useState("");
  const {
    data: userData,
    isSuccess: userSuccess,
    isLoading: userLoading,
  } = useGetProfileQuery();

  const [openAddDoctor, setOpenAddDoctor] = useState(false);
  let pageSize = 7;

  useEffect(() => {
    if (userSuccess && userData?.data?.user?.hospitalId) {
      setHosipitalAdmin(String(userData?.data?.user?.hospitalId));
    }
  }, [userSuccess, userData]);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const {
    data: doctorsList,
    isLoading: doctorLoading,
    isSuccess,
    refetch,
  } = useGetHospitalsDoctorQuery({
    hospitalAdmin: hospitalAdminId,
    pageNumber: currentPage,
    limit: pageSize,
  });

  const doctors = doctorsList?.data?.doctors

  console.log(doctors);

  const totalDoctors = doctorsList?.data?.count || 0; // Total count from the API
  const totalPages = Math.ceil(totalDoctors / pageSize);
  const onNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const onPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const onPageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <RootLayout>
      <div className="mx-16 my-6 h-full">
        <SearchBar text={"Doctors"} isVisible={true} />
        <div className="rounded-xl h-[82%] overflow-scroll">
          <div className="z-10 pb-6 px-4 sticky top-0">
            <div className="h-28 w-full rounded-lg bg-white shadow-sm">
              <div className="flex items-center justify-between pt-4 px-6">
                <div className="font-semibold text-xl text-subtitle">
                  Our Doctors
                </div>
                <button
                  onClick={() => setOpenAddDoctor(true)}
                  className="bg-primary text-white font-medium text-xs px-4 py-2 rounded-2xl flex items-center"
                >
                  <IoAddOutline className="mr-4 h-4 w-4" />
                  Add Doctor
                </button>
              </div>
            </div>
          </div>
          <div className="mx-4 my-1">
            <DoctorTable
              refetch={refetch}
              loading={doctorLoading}
              count={doctorsList?.data?.count || 0}
              doctors={doctors}
              onNextPage={onNextPage}
              onPageChange={onPageChange}
              onPreviousPage={onPreviousPage} doctorFilters={{
                page: 0,
                limit: 0,
                sortBy: "",
                sortOrder: "",
                status: "",
                keyword: ""
              }}            />
          </div>
          {openAddDoctor && (
            <AddDoctorDialog
              setAddDialogOpen={setOpenAddDoctor}
              refetch={refetch}
            />
          )}
        </div>
      </div>
    </RootLayout>
  );
}
