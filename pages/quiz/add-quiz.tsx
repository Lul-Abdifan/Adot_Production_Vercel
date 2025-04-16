// components/QuizForm.js
import SearchBar from "@/components/common/SearchBar";
import AddQuizForm from "@/components/quiz/AddQuizForm";
import RootLayout from "@/layouts/RootLayout";
import Head from "next/head";
import React from "react";

function AddQuiz() {
    return (
        <RootLayout>
            <Head>Add Quiz Question</Head>
            <div className="mx-16 my-6 h-full">
                <SearchBar text={"quizzes"} />
                <div className="bg-white h-[77%] rounded-xl overflow-scroll shadow-md border-gray-300">
                    <div className=" my-10 mx-8 px-6 font-semibold text-xl text-secondary">
                        Add Quiz Question
                    </div>
                    <div className="my-6 mx-8">
                        <AddQuizForm isEdit={false} />
                    </div>
                </div>
            </div>
        </RootLayout>
    );
}

export default AddQuiz;
