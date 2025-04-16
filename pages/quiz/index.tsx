import SearchBar from "@/components/common/SearchBar";
import QuestionsList from "@/components/quiz/QuestionsList";
import RootLayout from "@/layouts/RootLayout";
import Head from "next/head";
import Link from "next/link";
import React, { useState } from "react";
import { IoAddOutline } from "react-icons/io5";

export default function Quiz() {
    const [keyword, setKeyWord] = useState("")
    const [isLoading, setLoading] = useState(true)

    const searchQuiz = async (keyword: string) => {
        setLoading(true)
        await new Promise((resolve) => setTimeout(resolve, 500));
        setKeyWord(keyword)
        setLoading(false)
    };
    
    return (
        <RootLayout>
            <Head>Quiz</Head>
            <div className="mx-16 my-6 h-full">
                <SearchBar text={"quizzes"} isVisible={true} onSearch={searchQuiz}/>
                <div className="z-10 pb-6 px- sticky top-0">
                    <div className="h-28 w-full rounded-lg shadow-sm bg-white border-gray-300">
                        <div className="flex items-center justify-between pt-4 px-6">
                            <div className="font-semibold text-xl text-subtitle">
                                Quiz Questions
                            </div>

                            <div className="flex items-center space-x-8">
                                <Link href={"/quiz/add-quiz"}>
                                    <button className="bg-primary text-white font-medium text-xs px-4 py-2 rounded-2xl flex items-center">
                                        <IoAddOutline className="mr-4 h-4 w-4" />
                                        Add Question
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="h-[64%] bg-background pt-2 rounded-xl overflow-scroll">
                    <QuestionsList keyword={keyword} setLoading={setLoading} isLoading={isLoading}/>
                </div>
            </div>
        </RootLayout>
    );
}