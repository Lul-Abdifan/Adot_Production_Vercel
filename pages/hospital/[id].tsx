import {
  useGetPatientsForDoctorQuery,
  useGetSortedDoctorsQuery,
} from "@/api/doctor-api";
import { useSearchUserFromAdotQuery } from "@/api/doctor-api";
import CalendarToShow from "@/components/HospitalAdmin/CalendarToShow";
import SearchBar from "@/components/common/SearchBar";
import SearchBarLight from "@/components/common/SearchBarLight";
import AddNewPatientForm from "@/components/doctor/patient/AddPatientForm";
import PatientTable from "@/components/doctor/patient/PatientTable";
import RootLayout from "@/layouts/RootLayout";
import { Patient } from "@/types/patient";
import { Tabs, Tab, Card, CardBody, Avatar } from "@nextui-org/react";
import { QueryActionCreatorResult } from "@reduxjs/toolkit/query";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { IoAddOutline } from "react-icons/io5";
import { IoArrowBack } from "react-icons/io5";
import { BsThreeDots } from "react-icons/bs";
import { SelectButton } from "@/components/common/SelectSingle";
import { SingleSelect } from "@/types/select";

const Doctor = () => {
  const [activeTab, setActiveTab] = useState<string>("Patients");
  const [searchPeriod, setSearchPeriod] = useState<boolean>(false);

  const router = useRouter();
  const { id } = router.query;

  const { data: allDocs, isLoading: doctorLoading } = useGetSortedDoctorsQuery({
    page: 1,
    limit: 100,
    sortBy: "year",
    sortOrder: "desc",
    keyword: "",
    status: "All",
  });

  const doctor = allDocs?.data?.users?.find((doc) => doc._id === id);
  const [sortBy, setSortBy] = useState("dueDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleSortChange = (field: string, order: "asc" | "desc") => {
    setSortBy(field);
    setSortOrder(order);
  };
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 7; // Items per page

  const [open, setOpen] = useState(false);
  const filters: SingleSelect[] = [
    {
      _id: "1",
      name: "All",
      value: "All",
    },
    {
      _id: "3",
      name: "Active",
      value: "Active",
    },
    {
      _id: "2",
      name: "Pending",
      value: "Pending",
    },
  ];

  const [selectedFilter, setSelectedFilter] = useState<SingleSelect>(
    filters[0]
  );
  const {
    data: dataList,
    isLoading,
    refetch,
  } = useGetPatientsForDoctorQuery({
    page: currentPage,
    doctorId: id as string,
    limit: pageSize,
    sortBy,
    sortOrder,
    ...(selectedFilter.name !== "All" && { status: selectedFilter.name }),
  });
  const totalPatients = dataList?.data?.count || 0; // Total count from the API
  const totalPages = Math.ceil(totalPatients / pageSize);
  const patientList = Array.isArray(dataList?.data?.patient)
    ? dataList.data.patient.map((entry: any) => ({
        ...entry.patient,
        requestStatus: entry.requestStatus,
      }))
    : [];

  const handleAddPatient = () => {
    setOpen(true);
  };

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

  const [searchKeyword, setSearchKeyword] = useState<{
    name?: string;
    email?: string;
    phoneNumber?: string;
  }>({}); // Initialize with an empty object

  // State for storing search results across multiple searches
  const [searchHistory, setSearchHistory] = useState<any[]>([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState<number | null>(
    null
  );

  function searchAdotClients(keyword: string): void {
    // Regular expression to validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Regular expression to validate phone number (basic example)
    const phoneRegex = /^(0\d{9,10}|\+?[1-9]\d{1,14})$/;

    if (emailRegex.test(keyword)) {
      setSearchKeyword({ email: keyword }); // Input is an email
    } else if (phoneRegex.test(keyword)) {
      setSearchKeyword({ phoneNumber: keyword }); // Input is a phone number
    } else {
      setSearchKeyword({ name: keyword });
    }

    setSearchPeriod(true);

    // Save the current search result to the history
    setSearchHistory((prevHistory) => [
      ...prevHistory,
      { keyword, data: searchDatas },
    ]);

    // Set the current search index to the latest search result
    setCurrentSearchIndex(searchHistory.length);
  }

  const { data: searchData, isLoading: searchLoading } =
    useSearchUserFromAdotQuery(searchKeyword);
  const searchDatas = [searchData?.data];

  const changeFilter = async (e: string) => {
    const newFilter = filters.find((filter) => filter.name === e);

    if (newFilter) {
      setSelectedFilter(newFilter);
    }
  };

  // Function to handle the back button click
  const handleBackButtonClick = () => {
    if (currentSearchIndex === null || currentSearchIndex <= 0) {
      router.back();
    } else {
      setCurrentSearchIndex(currentSearchIndex - 1);
      const previousSearch = searchHistory[currentSearchIndex - 1];
      setSearchKeyword(previousSearch.keyword);
      refetch();
    }
  };

  // Watch for changes to the search history and update the current search index accordingly
  useEffect(() => {
    if (currentSearchIndex !== null) {
      const currentSearch = searchHistory[currentSearchIndex];
      setSearchKeyword(currentSearch.keyword);
    }
  }, [currentSearchIndex]);

  return (
    <RootLayout>
      <div className="overflow-y-auto ">
        <SearchBarLight text={"Adot Clients"} onSearch={searchAdotClients} />
        <div className="w-full h-2 bg-white" />
        <div className="flex justify-between mx-10 my-6 items-center">
          <div className="flex gap-4 ">
            <div className="flex items-center gap-2 text-gray-500 mr-4">
              <IoArrowBack
                className="h-8 w-8 cursor-pointer"
                onClick={() => {
                  if (searchPeriod) {
                    refetch(); // Refetch patients if in search mode
                    setSearchPeriod(false); // Reset search period state
                    // router.push(`/hospital/${id}`);
                  } else {
                    router.push("/hospital");
                  }
                }}
              />
            </div>
            {!doctorLoading ? (
              doctor?.profileImage ? (
                <Avatar
                  size="lg"
                  src={doctor.profileImage}
                  alt={`${doctor.firstName} ${doctor.lastName}`}
                />
              ) : (
                <Avatar name={doctor?.firstName[0]} />
              )
            ) : (
              ""
            )}
            <div className="flex flex-col gap-1">
              <h1 className="text-gray-500 font-bold">
                {!doctorLoading &&
                  `Dr. ${doctor?.firstName} ${doctor?.lastName}`}
              </h1>
              <h2 className="text-gray-500">{doctor?.fieldOfSpecialization}</h2>
            </div>
          </div>

          {activeTab === "Patients" && (
            <div className="flex gap-8 items-center">
              <SelectButton
                options={filters}
                functionTrigger={changeFilter}
                selectedFilter={selectedFilter}
              />
              <button
                onClick={handleAddPatient}
                className="bg-primary text-white font-medium text-xs mx-8 px-6 py-3 rounded-full flex justify-center items-center"
              >
                <IoAddOutline className="mr-2 h-6 w-6" />
                Connect new Patient
              </button>
            </div>
          )}
        </div>
        <div className="max-w-[240px] mx-6 flex justify-between px-2 py-2 my-6 bg-white  rounded-full">
          <div className="flex flex-col">
            <Tabs
              aria-label="Options"
              onSelectionChange={(key) => setActiveTab(key as string)}
              selectedKey={activeTab}
            >
              <Tab key="Patients" title="Patients"></Tab>
              <Tab key="Appointments" title="Appointments"></Tab>
            </Tabs>
          </div>
        </div>

        <div className="h-auto px-10 pt-6">
          {activeTab === "Patients" && (
            <Card className="h-full ">
              <CardBody className="">
                {searchPeriod ? (
                  <PatientTable
                    refetch={
                      refetch as unknown as () => Promise<
                        QueryActionCreatorResult<any>
                      >
                    }
                    patientList={searchDatas}
                    loading={searchLoading}
                    setSearchPeriod={setSearchPeriod}
                  />
                ) : (
                  <PatientTable
                    count={dataList?.data?.count || 0}
                    doctor={doctor}
                    onPageChange={onPageChange}
                    onPreviousPage={onPreviousPage}
                    onNextPage={onNextPage}
                    currentPage={currentPage}
                    pages={totalPages}
                    patientList={patientList}
                    loading={isLoading}
                    refetch={
                      refetch as unknown as () => Promise<
                        QueryActionCreatorResult<any>
                      >
                    }
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onSortChange={handleSortChange}
                  />
                )}
                {open && (
                  <AddNewPatientForm
                    setAddPatientDialogOpen={setOpen}
                    refetch={refetch}
                  />
                )}
              </CardBody>
            </Card>
          )}
          {activeTab === "Appointments" && (
            <Card className="lg:h-80 md:h-60 xl:h-[40rem]">
              <CardBody>
                <h1>
                  <CalendarToShow doctorId={id as string} />
                </h1>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </RootLayout>
  );
};

export default Doctor;
