import { usePatchListsByIdMutation, usePostListsMutation } from '../store/api.generated';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { fromEpoch, range, fromISODate, toHumanDate, toISODate, toWeekday } from '../helpers';
import { TodoList } from './TodoList';
import classNames from 'classnames';
import { DayList } from '../store/api';
import { FC } from 'react';

type EmptyList = Omit<DayList, 'id'>;
const isNotEmpty = (list: DayList | EmptyList): list is DayList => 'id' in list;

export const TodoDayLists: FC<{ data: DayList[] }> = ({ data }) => {
  const { day, size } = useSelector((state: RootState) => state.lists);
  const days = range(day.show[0], day.show[1]);
  const [updateList] = usePatchListsByIdMutation();
  const [addTodo] = usePostListsMutation();

  const listDays = days.map(
    (position) => data?.find((item) => item.position === position) ?? { type: 'DAY' as const, position, items: [] },
  );

  return (
    <dl
      className={classNames('h-full bg-white grid grid-cols-1 gap-px bg-gray-900/5 sm:grid-cols-2', {
        'lg:grid-cols-3': size === 3,
        'lg:grid-cols-5': size === 5,
        'lg:grid-cols-7': size === 7,
      })}
    >
      {listDays.map((list) => (
        <div
          key={isNotEmpty(list) ? list.id : list.position}
          className="flex flex-col gap-x-4 gap-y-2 bg-white px-4 py-10 sm:px-6 xl:px-8"
        >
          <dt className="text-sm text-gray-400">{toHumanDate(fromEpoch(list.position))}</dt>
          <dt className="text-xl font-medium uppercase text-gray-600 -mt-1">{toWeekday(fromEpoch(list.position))}</dt>
          <TodoList
            items={list.items}
            onChange={(items) =>
              isNotEmpty(list)
                ? updateList({ id: list.id, body: { ...list, items } })
                : addTodo({ body: { ...list, items } })
            }
          />
        </div>
      ))}
    </dl>
  );
};
