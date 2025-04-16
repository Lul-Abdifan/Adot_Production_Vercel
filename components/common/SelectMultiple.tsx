import { FC } from "react";
import {
    Dropdown,
    DropdownTrigger,
    Button,
    DropdownMenu,
    DropdownItem,
} from "@nextui-org/react";
import { MultipleSelect, Option } from "@/types/select";

interface SelectButtonProps {
    options: { [key: string]: MultipleSelect };
    values: Set<String>;
    changeValue: Function;
}

export const SelectMultipleButton: FC<SelectButtonProps> = ({
    options,
    values,
    changeValue,
}) => {
    return (
        <div className="w-fit">
            <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:max-w-7xl lg:px-8">
                <section aria-labelledby="filter-heading" className="">
                    <div className="flex items-center justify-between">
                        <div className="hidden sm:flex sm:items-baseline sm:space-x-4">
                            {Object.entries(options).map(
                                ([key, { options }]) => (
                                    <Dropdown key={key} closeOnSelect={false}>
                                        {/* solid | bordered | light | flat | faded | shadow */}
                                        <DropdownTrigger>
                                            <Button
                                                className="bg-white text-gray-500 border-1"
                                                variant="light"
                                                radius="full"
                                                size="sm"
                                            >
                                                {key}{" "}
                                                {options.filter((option) =>
                                                    values.has(option.value)
                                                ).length > 0 && (
                                                    <span className="ml-1.5 rounded-lg bg-gray-200 px-1.5 py-0.5 text-xs font-light tabular-nums text-gray-700">
                                                        {
                                                            options.filter(
                                                                (option) =>
                                                                    values.has(
                                                                        option.value
                                                                    )
                                                            ).length
                                                        }
                                                    </span>
                                                )}
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth={1.5}
                                                    stroke="currentColor"
                                                    className="w-4 h-4"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="m19.5 8.25-7.5 7.5-7.5-7.5"
                                                    />
                                                </svg>
                                            </Button>
                                        </DropdownTrigger>
                                        <DropdownMenu
                                            className="text-secondary"
                                            aria-label="Static Actions"
                                            selectionMode="multiple"
                                            selectedKeys={options
                                                .filter((option: Option) =>
                                                    values.has(option.value)
                                                )
                                                .map(
                                                    (filter: Option) =>
                                                        filter.label
                                                )}
                                            onSelectionChange={(e) =>
                                                changeValue(e)
                                            }
                                        >
                                            {options.map((option) => (
                                                <DropdownItem
                                                    onClick={() =>
                                                        changeValue(option)
                                                    }
                                                    key={option.value}
                                                >
                                                    {option.value}
                                                </DropdownItem>
                                            ))}
                                        </DropdownMenu>
                                    </Dropdown>
                                )
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};
