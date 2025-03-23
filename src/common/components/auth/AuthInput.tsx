import * as React from 'react';

interface AuthInputProps {
  name: string;
  type: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const AuthInput: React.FC<AuthInputProps> = React.memo(
  ({ name, type, value, onChange }) => {
    return (
      <div className="relative w-full">
        <input
          type={type}
          id="small_outlined"
          className="text-md peer block h-14 w-full appearance-none rounded-lg border-[1.5px] border-gray-300 bg-transparent px-2.5 pb-1.5 pt-3 text-gray-900 focus:border-primary focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-primary"
          placeholder=""
          value={value}
          onChange={onChange}
        />
        <label
          htmlFor="small_outlined"
          className="absolute start-1 top-1 z-10 flex origin-[0] -translate-y-3 scale-75 transform gap-1 bg-bgDefault px-3 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-1 peer-focus:mx-2 peer-focus:-translate-y-3 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-primary dark:bg-gray-900 dark:text-gray-400 peer-focus:dark:text-primary rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4"
        >
          {name} <p>*</p>
        </label>
      </div>
    );
  }
);

export default AuthInput;
