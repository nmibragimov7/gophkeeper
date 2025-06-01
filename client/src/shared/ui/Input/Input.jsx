import {useId} from "react";

import {classNames} from "@/shared/lib/classNames";
import {isNotEmpty} from "@/shared/lib/checker";

import css from "./Input.module.scss";

const Input = ({
  label,
  inputType = "text",
  placeholder,
  classNameWrap,
  className,
  classNameLabel,
  classNameLabelActive,
  value,
  min,
  max,
  autoComplete,
  ...props
}) => {
  const id = useId()
  const inputNumberProps = props
  if (inputType === "password") {
    return (
      <>
        <div className={classNames(css.FieldWrap, classNameWrap || "")}>
          <input
            {...props}
            id={id}
            type={"password"}
            placeholder={placeholder}
            className={classNames(css.Field, className || "", {
              "border-primary": !!value,
            })}
            autoComplete={autoComplete}
          />
          {label ? (
            <label
              htmlFor={id}
              className={classNames(
                css.Label,
                {[[css.ActiveInput, classNameLabelActive].join(" ")]: isNotEmpty(value)},
                classNameLabel || "",
              )}
            >
              {label}
            </label>
          ) : null}
        </div>
      </>
    );
  }
  if (inputType === "number") {
    return (
      <>
        <div className={classNames(css.FieldWrap, classNameWrap || "")}>
          <input
            {...inputNumberProps}
            type={"number"}
            id={id}
            min={min}
            max={max}
            placeholder={placeholder}
            value={value}
            className={classNames(css.Field, className || "", {
              "border-primary": !!value || value === 0,
            })}
          />
          {label ? (
            <label
              htmlFor={id}
              className={classNames(
                css.Label,
                {[[css.ActiveInput, classNameLabelActive].join(" ")]: isNotEmpty(value)},
                classNameLabel || "",
              )}
            >
              {label}
            </label>
          ) : null}
        </div>
      </>
    );
  }
  return (
    <>
      <div className={classNames(css.FieldWrap, classNameWrap || "")}>
        <input
          {...props}
          id={id}
          placeholder={placeholder}
          value={value}
          autoComplete={autoComplete}
          className={classNames(css.Field, className || "", {
            "border-primary": !!value,
          })}
        />
        {label ? (
          <label
            htmlFor={id}
            className={classNames(
              css.Label,
              {[[css.ActiveInput, classNameLabelActive].join(" ")]: isNotEmpty(value)},
              classNameLabel || "",
            )}
          >
            {label}
          </label>
        ) : null}
      </div>
    </>
  );
};

export default Input;
