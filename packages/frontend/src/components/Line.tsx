import classNames from "classnames";
import React, { useState } from "react";

export type LineProps = {
  value: { done: boolean; text: string };
  onChange: (value: string) => void;
  onCheck: (checked: boolean) => void;
  onBlur: (value: string) => void;
};

export const Line: React.FC<LineProps> = ({
  value,
  onChange,
  onBlur,
  onCheck,
}) => {
  const [focused, setFocused] = useState(false);

  const onFocus = () => {
    setFocused(true);
  };
  const onInputBlur = (value) => {
    onBlur(value);
    setFocused(false);
  };

  return (
    <div
      onClick={() => onFocus()}
      onDoubleClick={() => onCheck(!value.done)}
      className="group/line relative h-6 hover:z-10"
    >
      <div className="absolute -left-6 top-0 -m-2 hidden h-6 w-8 p-2 group-hover/line:block">
        <input
          className="align-text-top"
          checked={value.done}
          onChange={({ target }) => onCheck(target.checked)}
          type="checkbox"
        />
      </div>
      {focused ? (
        <input
          className={classNames(
            "relative -top-1 -mx-0.5 box-content w-full border border-slate-300 px-0.5",
            {
              "line-through": value.done,
            },
          )}
          value={value.text}
          autoFocus
          onChange={({ target }) => onChange(target.value)}
          onBlur={({ target }) => onInputBlur(target.value)}
        />
      ) : (
        <div
          className={classNames(
            `absolute box-content h-auto w-full overflow-hidden overflow-ellipsis whitespace-nowrap rounded-sm border border-white bg-white leading-4`,
            `group-hover/line:-m-1 group-hover/line:overflow-visible group-hover/line:whitespace-normal group-hover/line:border-slate-300 group-hover/line:p-1`,
            { "line-through": value.done },
          )}
        >
          {value.text}
        </div>
      )}
    </div>
  );
};
