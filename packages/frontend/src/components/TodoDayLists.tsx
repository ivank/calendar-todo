import { useGetDayListsQuery, usePatchDayListsByIdMutation, usePostDayListsMutation } from '../store/api.generated';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { fromEpoch, fromISODate, toHumanDate, toISODate, toWeekday } from '../helpers';
import { TodoList } from './TodoList';
import classNames from 'classnames';

type Item = { done: boolean; text: string };
type TodoDay = { day: string; id: number; items: Item[] };
type EmptyTodoDay = { day: string; items: Item[] };

const eachEpochDay = (from: number, to: number): Date[] =>
  [...Array(to - from)].map((_, index) => fromEpoch(from + index));
const isTodoDay = (todo: TodoDay | EmptyTodoDay): todo is TodoDay => 'id' in todo;

export const TodoDayLists = () => {
  const { window } = useSelector((state: RootState) => state.calendar);
  const days = eachEpochDay(window.show[0], window.show[1]).map(toISODate);
  const [from, to] = window.data.map(fromEpoch).map(toISODate);
  const { data, error } = useGetDayListsQuery({ userId: 1, from, to });
  const [updateList] = usePatchDayListsByIdMutation();
  const [addTodo] = usePostDayListsMutation();

  const todoDays = days.map<TodoDay | EmptyTodoDay>(
    (day) => data?.find((item) => item.day === day) ?? { day, items: [] },
  );

  return (
    <div className="relative">
      <dl
        className={classNames('mx-auto grid grid-cols-1 gap-px bg-gray-900/5 sm:grid-cols-2', {
          'lg:grid-cols-3': window.size === 3,
          'lg:grid-cols-5': window.size === 5,
          'lg:grid-cols-7': window.size === 7,
        })}
      >
        {error ? (
          <>Oh no, there was an error</>
        ) : (
          todoDays.map((todo) => (
            <div
              key={isTodoDay(todo) ? todo.id : todo.day}
              className="flex flex-col gap-x-4 gap-y-2 bg-white px-4 py-10 sm:px-6 xl:px-8"
            >
              <dt className="text-sm  text-gray-400">{toHumanDate(fromISODate(todo.day))}</dt>
              <dt className="text-xl font-medium uppercase text-gray-600">{toWeekday(fromISODate(todo.day))}</dt>
              <TodoList
                items={todo.items}
                onChange={(items) =>
                  isTodoDay(todo)
                    ? updateList({ userId: 1, id: todo.id, body: { ...todo, items } })
                    : addTodo({ userId: 1, body: { ...todo, items } })
                }
              />
            </div>
          ))
        )}
      </dl>
    </div>
  );
};
