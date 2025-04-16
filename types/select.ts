
export type SingleSelect = {
    _id: string,
    name: string,
    value: any
  }


export type MultipleSelect = {
  options: Option[]
}

export type Option = {
  value: string,
  label: string
}

export type Action = {
  title: string;
  action: Function;
  value?: any;
  style: string;
};
