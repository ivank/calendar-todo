import {
  usePatchListsByIdMutation,
  usePostListsMutation,
} from "../store/api.generated";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { fromEpoch, range, toHumanDate, toWeekday } from "../helpers";
import { TodoList } from "./TodoList";
import classNames from "classnames";
import { DayList } from "../store/api";
import { FC } from "react";

type EmptyList = Omit<DayList, "id">;
const isNotEmpty = (list: DayList | EmptyList): list is DayList => "id" in list;

export const TodoDayLists: FC<{ data: DayList[] }> = ({ data }) => {
  const { day } = useSelector((state: RootState) => state.lists);
  const days = range(day.data[0], day.data[1]);
  const [updateList] = usePatchListsByIdMutation();
  const [addTodo] = usePostListsMutation();
  const listDays = days.map(
    (position) =>
      data?.find((item) => item.position === position) ?? {
        type: "DAY" as const,
        position,
        items: [],
      },
  );
  return (
    <div className="h-full overflow-hidden bg-white">
      <dl
        className={classNames(
          "left-[calc(-1*(100%/(1))*var(--day-current))] w-[calc((100%/(1))*var(--day-size))]",
          "sm:left-[calc(-1*(100%/(2))*var(--day-current))] sm:w-[calc((100%/(2))*var(--day-size))]",
          "md:left-[calc(-1*(100%/(3))*var(--day-current))] md:w-[calc((100%/(3))*var(--day-size))]",
          "lg:left-[calc(-1*(100%/var(--size))*var(--day-current))] lg:w-[calc((100%/var(--size))*var(--day-size))]",
          "relative flex h-full flex-row transition-all duration-200 ease-out",
        )}
      >
        {listDays.map((list) => (
          <div
            key={isNotEmpty(list) ? list.id : list.position}
            className={classNames(
              "w-[calc(100%/(1))]",
              "sm:w-[calc(100%/(2))]",
              "md:w-[calc(100%/(3))]",
              "lg:w-[calc(100%/var(--size))]",
              "flex flex-col bg-white px-4 py-10 sm:px-6 xl:px-8",
            )}
          >
            <dt className="text-sm text-gray-400">
              {toHumanDate(fromEpoch(list.position))}
            </dt>
            <dt className="-mt-1 text-xl font-medium uppercase text-gray-600">
              {toWeekday(fromEpoch(list.position))}
            </dt>
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
    </div>
  );
};
