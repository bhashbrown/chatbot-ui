import { InputHTMLAttributes } from 'react';

type TextFieldProps = {
  error?: boolean;
  helperText?: string;
  label?: string;
  margin?: string;
  width?: string;
} & Pick<
  InputHTMLAttributes<HTMLInputElement>,
  'id' | 'autoComplete' | 'onChange' | 'placeholder' | 'type' | 'value'
>;

const TextField: React.FC<TextFieldProps> = ({
  autoComplete,
  error,
  helperText,
  id,
  label,
  margin = 'mb-4',
  onChange,
  placeholder,
  type = 'text',
  value,
  width = 'w-full',
}) => {
  const borderColor = error ? 'border-rose-500' : 'border-neutral-600';
  const helperTextColor = error
    ? 'text-rose-500'
    : 'text-neutral-700 dark:text-neutral-200';
  return (
    <div className={`${margin} ${width}`}>
      {label && (
        <label
          className="text-sm font-bold text-black dark:text-neutral-200"
          htmlFor={id}
        >
          {label}
        </label>
      )}
      <input
        id={id}
        autoComplete={autoComplete}
        type={type}
        className={`w-full mt-2 mb-2 flex-1 rounded-md border ${borderColor} bg-white dark:bg-[#202123] px-4 py-3 pr-10 text-[14px] leading-3 text-neutral-700 dark:text-neutral-200`}
        onChange={onChange}
        placeholder={placeholder}
        value={value}
      />
      {helperText && (
        <p className={`w-full ${helperTextColor} text-xs mt-0.5`}>
          {helperText}
        </p>
      )}
    </div>
  );
};

export default TextField;
