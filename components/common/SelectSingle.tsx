import { SingleSelect } from "@/types/select";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { FC, useEffect, useState } from "react";

interface SelectButtonProps {
  options: SingleSelect[];
  functionTrigger: Function;
  selectedFilter?: SingleSelect;
}

export const SelectButton: FC<SelectButtonProps> = ({
  options,
  functionTrigger,
  selectedFilter,
}) => {
  const [selected, setSelected] = useState(selectedFilter || options[0]);

  const changeValue = (val: SingleSelect) => {
    setSelected(val);
    functionTrigger(val.value);
  };

  useEffect(() => {
    if (selectedFilter) {
      setSelected(selectedFilter);
    }
  }, [selectedFilter]);

  return (
    <Dropdown closeOnSelect={true}>
      <DropdownTrigger>
        <Button
          className="bg-white text-gray-500 border-1 min-w-[120px] flex justify-between items-center"
          variant="light"
          radius="full"
          size="sm"
        >
          {selected.name}{" "}
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
      <DropdownMenu className="text-secondary" aria-label="Static Actions">
        {options.map((option) => (
          <DropdownItem onClick={() => changeValue(option)} key={option.name}>
            {option.name}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};
