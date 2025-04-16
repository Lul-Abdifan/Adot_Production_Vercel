import React, { FC, useEffect, useState, useRef } from "react";
import { IoMdSearch, IoMdClose } from "react-icons/io";
import Image from "next/image";
import { useGetProfileQuery } from "@/api/user-api";
import { Skeleton } from "@nextui-org/react";
import { User, MobileUser } from "../../types/user";


interface SearchBarProps {
  text: string;
  onSearch?: (keyword: string) => void;
}

const SearchBarLight: FC<SearchBarProps> = ({ text, onSearch }) => {
   const { data: userData, isSuccess: userSuccess, isLoading: userLoading } = useGetProfileQuery();
         const [searchQuery, setSearchQuery] = useState<string>("");
         const searchResultsRef = useRef<HTMLDivElement>(null);
 
         useEffect(() => {
             if (userSuccess) {
                 setUser(userData.data.user);
             }
         }, [userData, userSuccess]);
 
         const [user, setUser] = useState<
             Pick<User, "firstName" | "lastName" | "email" | "role" | "profileImage">
         >({
             firstName: "",
             lastName: "",
             email: "",
             role: "",
             profileImage: "",
         });

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const clearSearchQuery = () => {
    setSearchQuery("");
    if (onSearch) {
      onSearch("");
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      searchResultsRef.current &&
      !searchResultsRef.current.contains(event.target as Node)
    ) {
      setSearchQuery("");
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={searchResultsRef}
      className="flex items-center justify-between w-full py-10 px-14 bg-[#FAF9FC] rounded-lg"
    >
      {/* Search Input */}
      <form
        onSubmit={handleSearchFormSubmit}
        className="flex items-center w-full max-w-5xl relative"
      >
        <IoMdSearch className="absolute left-5 text-gray-400 text-3xl" />
        <input
          type="text"
          placeholder={`Search ${text}`}
          value={searchQuery}
          onChange={handleSearchInputChange}
          className="w-full pl-16 pr-10 py-4 text-sm text-gray-700 bg-white rounded-full border focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={clearSearchQuery}
            className="absolute right-5 text-gray-500 hover:text-gray-700"
          >
            <IoMdClose />
          </button>
        )}
      </form>

      {/* User Info */}
      <div className="flex items-center ml-4">
        <div className="text-right mr-4">
          {userSuccess ? (
            <>
              <p className="text-xl font-bold text-black">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-gray-500">{user.role}</p>
            </>
          ) : (
            <>
              <Skeleton className="h-4 w-28 rounded-lg" />
              <Skeleton className="h-3 w-20 mt-1 rounded-lg" />
            </>
          )}
        </div>
        <div className="ring-2 ring-gray-200 rounded-full overflow-hidden">
          {user.profileImage ? (
            <Image
              src={user.profileImage}
              alt="Profile"
              width={50}
              height={50}
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <div className="flex items-center justify-center w-14 h-14 bg-gray-300 rounded-full text-white">
              {user.firstName[0]?.toUpperCase()}
              {user.lastName[0]?.toUpperCase()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBarLight;
