import DoctorTable from "@/components/doctor/DoctorTable";
import { IoAddOutline } from "react-icons/io5";
import { Doctor } from "@/types/doctor";
import RootLayout from "@/layouts/RootLayout";
import { useGetSortedDoctorsQuery } from "@/api/doctor-api";
import React, { useEffect, useState } from "react";
import SearchBar from "@/components/common/SearchBar";
import AddDoctorDialog from "@/components/doctor/AddDoctorForm";
import { SortDescriptor } from "@nextui-org/react";
import { useGetSortedCategoriesQuery } from "@/api/category-api";
import { useRouter } from "next/router";
import { SelectButton } from "@/components/common/SelectSingle";
import { SingleSelect } from "@/types/select";
import { set } from "zod";
import { useSession } from "next-auth/react";

function Categories() {
  const [open, setOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | undefined>(
    undefined
  );
  const [pages, setPages] = useState(1);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [doctorFilters, setDoctorFilters] = useState({
    page: Number(router.query.page) || 0,
    limit: 5,
    sortBy: router.query.sortBy?.toString() || "name",
    sortOrder: router.query.sortOrder?.toString() || "asc",
    status: router.query.status?.toString() || "Active",
    keyword: router.query.keyword?.toString() || "",
  });

  const updatePath = (filterData: any) => {
    const paramString = Object.entries(filterData)
      .map(([key, value]) => (value != null ? `${key}=${value}` : undefined))
      .filter((item) => item != null)
      .join("&");
    router.push(`/doctors?${paramString}`, undefined, {
      shallow: true,
    });
  };

  const changeFilter = async (e: string | boolean) => {
    setLoading(true);
    setDoctors([]);
    const newFilters = {
      ...doctorFilters,
      status: e.toString(),
    };
    setDoctorFilters(newFilters);
    updatePath(newFilters);
    await refetch();
    setLoading(false);
  };

  useEffect(() => {
    setDoctorFilters({
      page: Number(router.query.page) || 1,
      limit: 5,
      sortBy: router.query.sortBy?.toString() || "name",
      sortOrder: router.query.sortOrder?.toString() || "asc",
      status: router.query.status?.toString() || "Active",
      keyword: router.query.keyword?.toString() || "",
    });

    setSelectedFilter(
      filters.filter(
        (filter: SingleSelect) => filter.value == router.query.status
      )[0]
    );

    if (!router.query.page || Number(router.query.page) == 0) {
      const filters = {
        page: 1,
        limit: 5,
        sortBy: "name",
        sortOrder: "asc",
        status: "Active",
        keyword: "",
      };
      setDoctorFilters(filters);
      updatePath(filters);
    }
  }, [router.query]);

  const {
    data: res,
    refetch,
    isSuccess,
  } = useGetSortedDoctorsQuery({
    page: doctorFilters.page || 1,
    limit: 5,
    sortBy: doctorFilters.sortBy || "name",
    sortOrder: doctorFilters.sortOrder || "asc",
    keyword: doctorFilters.keyword || "",
    status: doctorFilters.status || "Active",
  });

  useEffect(() => {
    if (isSuccess) {
      setDoctors(res.data.users);
      setPages(Math.ceil(res.data.count / 5));
      setLoading(false);
    }
  }, [res, isSuccess]);

  useEffect(() => {
    refetch();
  }, [doctorFilters]);

  const searchDoctors = async (keyword: string) => {
    setLoading(true);
    setDoctors([]);
    const newFilters = {
      ...doctorFilters,
      keyword: keyword,
      page: 1,
    };
    setDoctorFilters(newFilters);
    updatePath(newFilters);
    await refetch();
    setLoading(false);
  };

  const sortTable = async (e: SortDescriptor) => {
    setLoading(true);
    setDoctors([]);
    const filters = {
      ...doctorFilters,
      sortBy: e.column?.toString() || "name",
      sortOrder: e.direction == "ascending" ? "asc" : "desc",
    };
    setDoctorFilters(filters);
    updatePath(filters);
    await refetch();
    setLoading(false);
  };

  const onNextPage = async () => {
    setLoading(true);
    if (doctorFilters.page < pages) {
      setDoctors([]);
      const filters = {
        ...doctorFilters,
        page: doctorFilters.page + 1,
      };
      setDoctorFilters(filters);
      updatePath(filters);
      await refetch();
    }
    setLoading(false);
  };

  const onPageChange = async (e: number) => {
    setLoading(true);
    setDoctors([]);
    const filters = {
      ...doctorFilters,
      page: e,
    };
    setDoctorFilters(filters);
    updatePath(filters);
    await refetch();
    setLoading(false);
  };

  const onPreviousPage = async () => {
    setLoading(true);
    if (doctorFilters.page > 1) {
      setDoctors([]);
      const filters = {
        ...doctorFilters,
        page: doctorFilters.page - 1,
      };
      setDoctorFilters(filters);
      updatePath(filters);
      await refetch();
    }
    setLoading(false);
  };

  const handleAddCategory = () => {
    setOpen(true);
    setSelectedDoctor(undefined);
  };

  const filters: SingleSelect[] = [
    {
      _id: "1",
      name: "All",
      value: "Active, Pending",
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

  return (
    <RootLayout>
      <div className="mx-16 my-6 h-full">
        <SearchBar text={"Doctors"} isVisible={true} onSearch={searchDoctors} />
        <div className="rounded-xl h-[82%] overflow-scroll">
          <div className="z-10 pb-6 px-4 sticky top-0">
            <div className="h-28 w-full rounded-lg bg-white shadow-sm">
              <div className="flex items-center justify-between pt-4 px-6">
                <div className="font-semibold text-xl text-subtitle">
                  Doctors
                </div>

                <div className="flex items-center space-x-8">
                  <button
                    onClick={handleAddCategory}
                    className="bg-primary text-white font-medium text-xs px-4 py-2 rounded-2xl flex items-center"
                  >
                    <IoAddOutline className="mr-4 h-4 w-4" />
                    Add Doctors
                  </button>

                  <SelectButton
                    options={filters}
                    functionTrigger={changeFilter}
                    selectedFilter={selectedFilter}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mx-4 my-1">
            <DoctorTable
              setOpen={setOpen}
              setSelectedDoctor={setSelectedDoctor}
              doctorFilters={doctorFilters}
              setDoctorFilters={setDoctorFilters}
              pages={pages}
              loading={loading}
              setLoading={setLoading}
              setDoctors={setDoctors}
              refetch={refetch}
              count={res?.data.count || 0}
              doctors={res?.data?.users}
              onPageChange={onPageChange}
              onPreviousPage={onPreviousPage}
              onNextPage={onNextPage}
              sortTable={sortTable}
            />
          </div>
        </div>
      </div>
      {open && <AddDoctorDialog setAddDialogOpen={setOpen} />}
    </RootLayout>
  );
}

export default Categories;
