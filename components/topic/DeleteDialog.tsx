import React, { FC, useState } from "react";
import Image from "next/image";
import successImg from "../../public/common/success-img.png";
import warningImg from "../../public/common/warning-img.png";
import errorImg from "../../public/common/error-img.png";
import cautionImg from "../../public/common/caution-img.png";
import { useArchiveTopicMutation } from "../../api/topic-api";
import { Button } from "@nextui-org/react";

interface DialogProps {
    _id: string;
    setOpen: Function;
}

export const DeleteDialog: FC<DialogProps> = ({ _id, setOpen }) => {
    const [archiveTopic] = useArchiveTopicMutation();
    const [loading, setLoading] = useState(false);
    const [isMessage, setIsMessage] = useState(false);

    const deleteTopic = async () => {
        setLoading(true);
        const res: any = await archiveTopic({ id: _id });

        if (res.data.statusCode == "200") {
            setIsMessage(true);
            setTimeout(() => {
                setOpen(false);
            }, 2000);
        }
        setLoading(false);
    };

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
        caution: {
            detail: "",
            img: cautionImg,
            textColor: "text-white",
            bgColor: "bg-red-500",
        },
    };

    const [message, setMessage] = useState(messages.caution);

    return (
        <>
            <div>
                <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                    <div className="relative w-full my-6 mx-auto max-w-lg rounded-2xl">
                        {/*content*/}
                        {isMessage ? (
                            <div className="rounded-2xl shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                <div>
                                    <Image
                                        className="relative mt-12 mx-auto"
                                        src={successImg}
                                        alt="Adot Logo"
                                        width={140}
                                        height={100}
                                        priority
                                    />
                                    <div className="relative px-6 py-3 mx-auto">
                                        <p
                                            className={`my-4 text-success text-center text-lg leading-relaxed`}
                                        >
                                            Success!
                                        </p>
                                    </div>
                                    <div className="relative px-14 mx-auto pb-12">
                                        <p className="text-gray-400 text-sm text-center tracking-wide leading-loose">
                                            Topic has been archived
                                            successfully!
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
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
                                <div className="relative px-6 py-3 mx-auto"></div>
                                <div className="relative px-24 py- mx-auto">
                                    <p className="my-2 text-gray-400 text-sm text-center tracking-wide leading-relaxed">
                                        Are you sure you want to archive this
                                        topic?
                                    </p>

                                    <p className="text-xs text-archive pt-2 opacity-30 text-center">
                                        Archiving this topic will also archive
                                        any other insights that belong to this
                                        topic.
                                    </p>
                                </div>

                                {/*footer*/}
                                <div className="flex items-center mx-auto justify-end p-6 mb-6 mt-3">
                                    <Button
                                        className={`${message.bgColor} ${message.textColor} font text-sm px-10 py-2.5 rounded-xl outline-none focus:outline-none mr-4 mb-1 ease-linear transition-all duration-150`}
                                        type="button"
                                        onClick={() => deleteTopic()}
                                        isLoading={loading}
                                    >
                                        Archive
                                    </Button>
                                    <button
                                        className={`bg-white ring-1 ring-red-500 text-red-500 font text-sm px-10 py-2 rounded-xl outline-none focus:outline-none mr-2 mb-1 ease-linear transition-all duration-150`}
                                        type="button"
                                        onClick={() => {
                                            setOpen(false);
                                        }}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="opacity-50 fixed inset-0 z-40 bg-black"></div>
            </div>
        </>
    );
};

export default DeleteDialog;
