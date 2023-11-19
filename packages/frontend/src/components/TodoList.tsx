import React, { useState } from 'react';
import { Line } from './Line';

type Item = { done: boolean; text: string };

const updateIndexValue = (index: number, value: string, items: Item[]) => {
  return items[index].text === value
    ? items
    : items.map((item, currentIndex) => (currentIndex === index ? { ...item, text: value } : item));
};
const updateIndexDone = (index: number, done: boolean, items: Item[]) => {
  return items.map((item, currentIndex) => (currentIndex === index ? { ...item, done } : item));
};

const removeIndex = (index: number, items: Item[]) => {
  return items.filter((_, currentIndex) => currentIndex !== index);
};

export type ListParams = {
  items: Item[];
  onChange: (value: Item[]) => void;
};

export const TodoList: React.FC<ListParams> = ({ items, onChange }) => {
  const [currentItems, setCurrentItems] = useState<Item[]>(items);
  const [newItem, setNewItem] = useState<string>('');

  const setCurrentItemsAndUpdate = (items: Item[]) => {
    setCurrentItems(items);
    onChange(items);
  };

  const addNewItem = (value: string) => {
    if (value) {
      setCurrentItemsAndUpdate([...currentItems, { done: false, text: value }]);
      setNewItem('');
    }
  };

  return (
    <ol className="flex flex-col gap-2">
      {currentItems.map((item, index) => (
        <li key={index} className="border-b-2 border-slate-300">
          <Line
            value={item}
            onCheck={(done) => setCurrentItems(updateIndexDone(index, done, currentItems))}
            onChange={(value) =>
              value
                ? setCurrentItems(updateIndexValue(index, value, currentItems))
                : setCurrentItemsAndUpdate(removeIndex(index, currentItems))
            }
            onBlur={() => onChange(currentItems)}
          />
        </li>
      ))}
      <li>
        <input
          className="w-full relative -top-1"
          value={newItem}
          onChange={({ target: { value } }) => setNewItem(value)}
          onKeyUp={({ key }) => (key === 'Enter' ? addNewItem(newItem) : null)}
          onBlur={({ target: { value } }) => addNewItem(value)}
        />
      </li>
    </ol>
  );
};
