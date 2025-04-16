import { Question, QuizCategory } from "@/types/quiz";
import adotApi from ".";


export const quizSlice =  adotApi.injectEndpoints({
  endpoints: (builder) => ({
    getQuizCategory: builder.query<{ data: any }, void>({
      query: () => ({
        url: "/v1/admin/quiz/getAllCategory?limit=50&pageNumber=1&keyword=",
        method: "GET",
      }),
    }),
    addQuiz: builder.mutation<any, { data: FormData }>({
      query: ({ data }) => ({
        url: "/v1/admin/quiz/addQuestion",
        method: "POST",
        body: data,
        formData: true,
      }),
      invalidatesTags: ["Quizzes"],
    }),
    updateQuiz: builder.mutation<any, { data: FormData, id:string}>({
      query: ({ data,id }) => ({
        url: `/v1/admin/quiz/updateQuestion/${id}`,
        method: "PUT",
        body: data,
        formData: true,
      }),
      invalidatesTags: ["Quizzes"],
    }),
    getAllQuestions: builder.query<{ data: any }, {keyword: string}>({
      query: ({keyword}) => ({
        url: `/v1/admin/quiz/getAllQuestions?limit=66&pageNumber=1&sortBy=name&sortOrder=desc&keyword=${keyword}`,
        method: "GET",
      }),
      providesTags: ["Quizzes"],
    }),
    getQuestion: builder.query<{ data: Question }, {id:string}>({
      query: ({id}) => ({
        url: `/v1/admin/quiz/getOneQuestion/${id}`,
        method: "GET",
      }),
    }),
    deleteQuestion: builder.mutation<void, { id: string }>({
      query: ({id}) => ({
        url: `/v1/admin/quiz/deleteQuestion/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Quizzes"],
    }),
  }),
});

export const {
  useGetQuizCategoryQuery,
  useAddQuizMutation,
  useGetAllQuestionsQuery,
  useDeleteQuestionMutation,
  useGetQuestionQuery,
  useUpdateQuizMutation
} = quizSlice;