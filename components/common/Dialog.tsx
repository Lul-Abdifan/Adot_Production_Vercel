import React, {
    FC,
    Dispatch,
    SetStateAction,
    useState,
    useEffect,
} from "react";
import Image from "next/image";
import successImg from "../../public/common/success-img.png";
import warningImg from "../../public/common/warning-img.png";
import errorImg from "../../public/common/error-img.png";

interface DialogProps {
    status: string;
    subText: string;
    setOpen: Function;
}

export const DialogDefault: FC<DialogProps> = ({
    status,
    subText,
    setOpen,
}) => {
    const messages = {
        success: {
            detail: "Succeeded!",
            img: successImg,
            textColor: "text-success",
            bgColor: "bg-[#DBF7E0]",
        },
        error: {
            detail: "An error has occured!",
            img: errorImg,
            textColor: "text-red-500",
            bgColor: "bg-red-50",
        },
        warning: {
            detail: "Warning!",
            img: warningImg,
            textColor: "text-orange-500",
            bgColor: "bg-orange-50",
        },
    };

    const [message, setMessage] = useState(messages.success);

    useEffect(() => {
        if (status == "success") {
            setMessage(messages.success);
        } else {
            setMessage(messages.error);
        }
    }, [status, messages.success, messages.error]);

    return (
        <>
            <div>
                <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                    <div className="relative w-full my-6 mx-auto max-w-lg rounded-2xl">
                        {/*content*/}
                        <div className="rounded-2xl shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                            {/*header*/}
                            <Image
                                className="relative mt-12 mx-auto"
                                src={message.img}
                                alt="Adot Logo"
                                width={140}
                                height={100}
                                priority
                            />
                            {/*body*/}
                            <div className="relative px-6 py-3 mx-auto">
                                <p
                                    className={`my-4 ${message.textColor} text-lg leading-relaxed`}
                                >
                                    {message.detail}
                                </p>
                            </div>
                            <div className="relative px-24 py- mx-auto">
                                <p className="my- text-gray-400 text-sm text-center tracking-wide leading-loose">
                                    {subText}
                                </p>
                            </div>

                            {/*footer*/}
                            <div className="flex items-center mx-auto justify-end p-6 mb-6 mt-3">
                                <button
                                    className={`${message.bgColor} ${message.textColor} font text-sm px-10 py-1.5 rounded-full outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150`}
                                    type="button"
                                    onClick={() => {
                                        setOpen(false);
                                    }}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="opacity-50 fixed inset-0 z-40 bg-black"></div>
            </div>
        </>
    );
};

export default DialogDefault;
