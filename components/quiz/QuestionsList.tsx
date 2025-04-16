import { useRouter } from "next/router";
import { useGetAllQuestionsQuery } from "@/api/quiz-api";
import { useEffect, useState } from "react";
import { Skeleton } from "@nextui-org/react";
import { Question } from "@/types/quiz";

function QuestionsList({ keyword, setLoading, isLoading }: { keyword: any; setLoading: Function; isLoading: boolean }) {
  const { data: res, isSuccess } = useGetAllQuestionsQuery({ keyword });
  const [questions, setQuestions] = useState<Question[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (isSuccess) {
      setQuestions(res.data.questions);
      setLoading(false);
    }
  }, [res, isSuccess]);

  if (isLoading) {
    return (
      <div>
        {Array.from({ length: 2 }, (_, i) => (
          <div key={i}>
            <Skeleton className="h-20 mb-2 w-120 rounded-xl" />
            <Skeleton className="h-20 mb-2 w-120 rounded-xl" />
            <Skeleton className="h-20 mb-2 w-120 rounded-xl" />
            <Skeleton className="h-20 mb-2 w-120 rounded-xl" />
            <Skeleton className="h-20 mb-2 w-120 rounded-xl" />
            <Skeleton className="h-20 mb-2 w-120 rounded-xl" />
            <Skeleton className="h-20 mb-2 w-120 rounded-xl" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
        {questions &&
          questions.map((question: Question, i: number) => (
            <div
              key={i}
              onClick={() => {
                router.push(`/quiz/quiz-details/${question._id}`);
              }}
              className="group cursor-pointer px-8 py-4 border-b border-gray-300 flex items-center transition-transform transform hover:scale-105 hover:shadow-lg hover:bg-gray-200 duration-200 active:scale-95"
            >
              {/* Circle with the question number */}
              <div className="flex-shrink-0 mr-4">
                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-primary text-white text-2xl font-bold">
                  {i + 1}
                </div>
              </div>

              {/* Question text (English and Amharic) */}
              <div>
                <h3 className="text-gray-800 text-lg font-medium mb-1"> {/* Small font for English version */}
                  {question.question.English}
                </h3>
                <p className="text-gray-700 text-lg"> {/* Smaller font for Amharic version */}
                  {question.question.Amharic}
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default QuestionsList;

