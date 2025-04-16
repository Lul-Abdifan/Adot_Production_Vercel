import { Skeleton } from "@nextui-org/react";
import { FC } from "react";
import { FaStar } from "react-icons/fa";


interface FeedbackTableProps {
  feedbacks: any[];
  setFeedbacks: Function;
  isLoading: boolean;
  setLoading: Function;
}

export const FeedbackTable: FC<FeedbackTableProps> = ({ feedbacks, isLoading }) => {
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

    const renderStars = (rating: number) => {
      const totalStars = 5;
      return [...Array(totalStars)].map((_, index) => {
        return (
          <FaStar
            key={index}
            className={`h-4 w-4 ${index < rating ? 'text-yellow-500' : 'text-gray-300'}`}
          />
        );
      });
    };

  const shimmerItem = {
    _id: "",
    feedback: "",
    rating: "",
    createdAt: "",
  };

  const shimmers = [shimmerItem, shimmerItem, shimmerItem, shimmerItem, shimmerItem];

 const renderFeedbackItem = (isFeedback: boolean, feedback: any) => {
   return (
     <div className="flex flex-col bg-gray-100 px-4 py-2 rounded-lg mb-4 shadow-md">
       <div className="flex justify-between items-start mb-2">
         <div className="flex-1 text-sm text-gray-500 font-semibold break-words max-w-full">
           {isFeedback ? (
             feedback.feedback
           ) : (
             <Skeleton className="h-5 w-32 rounded" />
           )}
         </div>
         <div className="text-xs text-gray-500 whitespace-nowrap ml-4">
           {isFeedback ? (
             formatDate(feedback.createdAt)
           ) : (
             <Skeleton className="h-4 w-12 rounded" />
           )}
         </div>
       </div>
       <div className="flex justify-between items-center mt-3">
         <div className="flex items-center">
           {isFeedback ? (
             renderStars(feedback.rating)
           ) : (
             <Skeleton className="h-4 w-8 rounded" />
           )}
         </div>
         <div className="text-xs text-gray-500">
           {isFeedback ? (
             formatTime(feedback.createdAt)
           ) : (
             <Skeleton className="h-4 w-12 rounded" />
           )}
         </div>
       </div>
     </div>
   );
 };



  return (
    <div className="px-2 rounded-2xl shadow-sm">
      {isLoading ? (
        <div>
          {shimmers.map((shimmer, index) => (
            <div key={index}>{renderFeedbackItem(false, shimmer)}</div>
          ))}
        </div>
      ) : (
        <div>
          {feedbacks.length ? (
            feedbacks.map((feedback) => (
              <div key={feedback._id}>{renderFeedbackItem(true, feedback)}</div>
            ))
          ) : (
            <div className="text-black">No feedback available</div>
          )}
        </div>
      )}
    </div>
  );
};