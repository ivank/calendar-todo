import React, { useRef, useState } from 'react';
import { Line } from './Line';

type Item = { done: boolean; text: string };

const updateIndexValue = (index: number, value: string, items: Item[]) =>
  items[index].text === value
    ? items
    : items.map((item, currentIndex) => (currentIndex === index ? { ...item, text: value } : item));

const updateIndexDone = (index: number, done: boolean, items: Item[]) =>
  items.map((item, currentIndex) => (currentIndex === index ? { ...item, done } : item));

const removeIndex = (index: number, items: Item[]) => items.filter((_, currentIndex) => currentIndex !== index);

export interface ListParams {
  items: Item[];
  onChange: (value: Item[]) => void;
}

export const TodoList: React.FC<ListParams> = ({ items, onChange }) => {
  const [newItem, setNewItem] = useState<string>('');
  const newItemInput = useRef<HTMLInputElement>(null);

  const addNewItem = (value: string) => {
    if (value) {
      onChange([...items, { done: false, text: value }]);
      setNewItem('');
    }
  };

  const focusNewItemInput = () => newItemInput.current.focus();
  const doNotFocusNewItemInput = (event) => event.stopPropagation();

  return (
    <ol className="h-full min-h-[200px] bg-text-lines" onClick={focusNewItemInput}>
      {items.map((item, index) => (
        <li key={index} className="mb-1 border-slate-300 pt-2" onClick={doNotFocusNewItemInput}>
          <Line
            value={item}
            onCheck={(done) => onChange(updateIndexDone(index, done, items))}
            onChange={(value) =>
              value ? onChange(updateIndexValue(index, value, items)) : onChange(removeIndex(index, items))
            }
            onBlur={() => onChange(items)}
          />
        </li>
      ))}
      <li className="mb-1 border-slate-300 pt-2" onClick={doNotFocusNewItemInput}>
        <input
          ref={newItemInput}
          className="relative -top-1 w-full bg-transparent focus:bg-white"
          value={newItem}
          onChange={({ target: { value } }) => setNewItem(value)}
          onKeyUp={({ key }) => (key === 'Enter' ? addNewItem(newItem) : null)}
          onBlur={({ target: { value } }) => addNewItem(value)}
        />
      </li>
    </ol>
  );
};
