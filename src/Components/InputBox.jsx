import { Input } from "@material-tailwind/react";
import { useRef } from "react";

const InputBox = ({
  focusLabelClass = "text-lg font-mono font-bold text-sky-400",
  showOuterLabel = true,
  labelValue,
  inputClass = "",
  labelClass = "p-2 w-1/3",
  type = "text",
  placeholder = labelValue,
  get,
  set,
  id,
  validate,
  textArea=false,
}) => {
  const pRef = useRef(null);

  const onFocus = () => {
    const focusLabelClasses = focusLabelClass.split(" ");
    focusLabelClasses.forEach((className) =>
      pRef.current.classList.add(className)
    );
  };

  const onBlur = () => {
    const focusLabelClasses = focusLabelClass.split(" ");
    focusLabelClasses.forEach((className) =>
      pRef.current.classList.remove(className)
    );
  };

  return (
    <div className="flex w-full">
      {showOuterLabel && (
        <label
          ref={pRef}
          className={`${labelClass}  ${validate} w-48`}
          htmlFor={id}
        >
          {labelValue}
        </label>
      )}
      {textArea ? (
        <textarea
          className={`w-full text-sm font-normal font-sans leading-normal p-3 rounded-xl rounded-br-none shadow-lg shadow-slate-100 dark:shadow-slate-900 focus:shadow-outline-purple dark:focus:shadow-outline-purple focus:shadow-lg border border-solid border-slate-300 hover:border-purple-500 dark:hover:border-purple-500 focus:border-purple-500 dark:focus:border-purple-500 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-300 focus-visible:outline-0 box-border ${inputClass}`}
          id={id}
          maxLength={200}
          name={id}
          variant="outlined"
          label={placeholder}
          placeholder={placeholder}
          value={get}
          onChange={set}
          onFocus={() => onFocus()}
          onBlur={() => onBlur()}
        />
      ) : (
        <Input
          id={id}
          maxLength={50}
          name={id}
          variant="outlined"
          label={placeholder}
          placeholder={placeholder}
          type={type}
          value={get}
          onChange={set}
          className={`${inputClass}`}
          onFocus={() => onFocus()}
          onBlur={() => onBlur()}
        />
      )}
    </div>
  );
};

export default InputBox;
