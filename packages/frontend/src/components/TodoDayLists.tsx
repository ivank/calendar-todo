import { useAppDispatch, useAppSelector } from '../store/store';
import { fromEpoch, range, toEpoch, toHumanDate, toWeekday } from '../helpers';
import { TodoList } from './TodoList';
import classNames from 'classnames';
import { DayList } from '../store/api';
import { setList } from '../store/lists.slice';

export const TodoDayLists = () => {
  const { day, current } = useAppSelector((state) => state.lists);
  const dispatch = useAppDispatch();
  const days = range(day.data[0], day.data[1]);
  const today = toEpoch(new Date());
  const listDays: DayList[] = days.map(
    (position) => current.DAY[position] ?? { type: 'DAY', position, items: [], updatedAt: 0 },
  );

  return (
    <div className="h-full overflow-hidden bg-white">
      <dl
        className={classNames(
          'left-[calc(-1*(100%/(1))*var(--day-current))] w-[calc((100%/(1))*var(--day-size))]',
          'sm:left-[calc(-1*(100%/(2))*var(--day-current))] sm:w-[calc((100%/(2))*var(--day-size))]',
          'md:left-[calc(-1*(100%/(3))*var(--day-current))] md:w-[calc((100%/(3))*var(--day-size))]',
          'lg:left-[calc(-1*(100%/var(--size))*var(--day-current))] lg:w-[calc((100%/var(--size))*var(--day-size))]',
          'relative flex h-full flex-row transition-all duration-200 ease-out',
        )}
      >
        {listDays.map((list) => (
          <div
            key={list.position}
            className={classNames(
              'w-[calc(100%/(1))]',
              'sm:w-[calc(100%/(2))]',
              'md:w-[calc(100%/(3))]',
              'lg:w-[calc(100%/var(--size))]',
              'flex flex-col px-4 py-10 sm:px-6 xl:px-8',
              {
                'opacity-60': list.position < today,
                'bg-gradient-to-b from-atomictangerine-400/5': list.position === today,
              },
            )}
          >
            <dt className="text-sm text-gray-400">{toHumanDate(fromEpoch(list.position))}</dt>
            <dt className="-mt-1 text-xl font-medium uppercase text-gray-600">{toWeekday(fromEpoch(list.position))}</dt>
            <TodoList items={list.items} onChange={(items) => dispatch(setList({ ...list, items }))} />
          </div>
        ))}
      </dl>
    </div>
  );
};
