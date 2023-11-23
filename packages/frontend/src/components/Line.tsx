import classNames from 'classnames';
import React, { useState } from 'react';

export type LineProps = {
  value: { done: boolean; text: string };
  onChange: (value: string) => void;
  onCheck: (checked: boolean) => void;
  onBlur: (value: string) => void;
};

export const Line: React.FC<LineProps> = ({ value, onChange, onBlur, onCheck }) => {
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
      className="relative group/line h-6 hover:z-10"
    >
      <div className="absolute top-0 -left-6 hidden group-hover/line:block w-8 h-6 p-2 -m-2">
        <input
          className="align-text-top"
          checked={value.done}
          onChange={({ target }) => onCheck(target.checked)}
          type="checkbox"
        />
      </div>
      {focused ? (
        <input
          className={classNames('w-full relative -top-1 box-content px-0.5 -mx-0.5 border border-slate-300', {
            'line-through': value.done,
          })}
          value={value.text}
          autoFocus
          onChange={({ target }) => onChange(target.value)}
          onBlur={({ target }) => onInputBlur(target.value)}
        />
      ) : (
        <div
          className={classNames(
            `w-full absolute h-auto bg-white leading-4 overflow-ellipsis whitespace-nowrap overflow-hidden rounded-sm border-white border box-content`,
            `group-hover/line:border-slate-300 group-hover/line:overflow-visible group-hover/line:whitespace-normal group-hover/line:p-1 group-hover/line:-m-1`,
            { 'line-through': value.done },
          )}
        >
          {value.text}
        </div>
      )}
    </div>
  );
};
