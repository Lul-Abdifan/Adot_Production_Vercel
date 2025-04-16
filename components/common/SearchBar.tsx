    import React, { FC, useEffect, useState, useRef} from "react";
    import { IoMdSearch, IoMdClose } from "react-icons/io";
    import Image from "next/image";
    import { useGetProfileQuery } from "@/api/user-api";
    import { Skeleton } from "@nextui-org/react";
    import { User, MobileUser } from "../../types/user";
    import Link from "next/link";

    interface SearchBarProps {
        text: string;
        isVisible?: boolean;
        onSearch?: (keyword: string) => void;
    }

    const SearchBar: FC<SearchBarProps> = ({ text, isVisible = true, onSearch }) => {
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


        // Function to handle search query change
        const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            setSearchQuery(event.target.value);
        };

        const handleClickOutside = (event: MouseEvent) => {
            if (searchResultsRef.current && !searchResultsRef.current.contains(event.target as Node)) {
                setSearchQuery("");        
            }
        };

        useEffect(() => {
            document.addEventListener("click", handleClickOutside);
            return () => {
                document.removeEventListener("click", handleClickOutside);
            };
        }, []);

        // Function to handle search form submission
        const handleSearchFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            if (onSearch) {
                onSearch(searchQuery);
            }
        };

        // Function to clear the search query
        const clearSearchQuery = () => {
            setSearchQuery("");
            if (onSearch) {
                onSearch("");
            }
        };
    
        return (
            <div className="flex items-center justify-between h-20 w-full mb-10 rounded-3xl bg-primary px-14 relative">
                <form onSubmit={handleSearchFormSubmit} className="flex items-center">
                    <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            {isVisible && <IoMdSearch color="#808080" />}
                        </div>
                        {isVisible && (
                            <input
                                type="text"
                                placeholder={`Search ${text}`}
                                className="bg-[#EBD7E7] text-[#525252] placeholder:text-primary text-s pr-4 pl-8 pt-2 py-2 rounded-3xl w-96 h-10"
                                value={searchQuery}
                                onChange={handleSearchInputChange}
                            />
                        )}

                        {/* Render the clear button only if searchQuery is not empty */}
                        {searchQuery && ( 
                            <button
                                type="button"
                                className="absolute inset-y-0 end-0 flex items-center pr-3 pt-2 cursor-pointer rounded-full text-white h-8 w-8 justify-center"
                                onClick={clearSearchQuery}
                            >
                                <IoMdClose color="#1a1a1a" />
                            </button>
                        )}
                    </div>
                </form>


                <div className="flex items-center text-right relative">
                    <div className="mr-4">
                        {userSuccess ? (
                            <>
                                <p className="text-sm text-white font-medium">
                                    {user.firstName} {user.lastName}
                                </p>
                                <p className="text-xs text-white  text-opacity-70">
                                    {user.role}
                                </p>
                            </>
                        ) : (
                            <>
                                <Skeleton className="h-3 my-2 w-28 rounded-lg" />
                                <Skeleton className="ml-auto h-2.5 my-2 w-20 rounded-lg" />
                            </>
                        )}
                    </div>

                <div className="ring-1 rounded-full ring-[#f4e4f4] p-1">
        {user.profileImage ? (
            <Image
                src={user.profileImage}
                alt="Profile"
                width={50}
                height={50}
                className="w-10 h-10 rounded-full"
                title={user.email} 
            />
        ) : (
            <span
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-400"
                title={user.email} 
            >
                <span className="font-medium text-xs leading-none text-white">
                    {user.firstName[0]}
                    {user.lastName[0]}
                </span>
            </span>
        )}
    </div>
    </div>
    </div>
        );
    };

    export default SearchBar;
