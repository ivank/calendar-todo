import { TodoNamedLists } from "../components/TodoNamedLists";
import { TodoDayLists } from "../components/TodoDayLists";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useGetListsQuery } from "../store/api.generated";
import { isDayList, isNamedList } from "../store/api";
import { getErrorMessage } from "../helpers";
import { AlertError } from "../components/AlertError";
import { AlertWarning } from "../components/AlertWarning";
import { CSSProperties } from "react";

export const App = () => {
  const { day, size, named } = useSelector((state: RootState) => state.lists);
  const { data, error, isLoading, refetch } = useGetListsQuery({
    from: day.data[0],
    to: day.data[1],
  });

  const dayLists = data?.filter(isDayList) ?? [];
  const namedLists = data?.filter(isNamedList) ?? [];

  return (
    <div
      className="flex h-full flex-col items-stretch"
      style={
        {
          "--size": size,
          "--day-current": day.current - day.data[0],
          "--day-size": day.data[1] - day.data[0],
          "--named-current": named.current,
          "--named-size": namedLists.length,
        } as CSSProperties
      }
    >
      {isLoading ? (
        <AlertWarning title="Loading" />
      ) : error ? (
        <AlertError title="Error Loading data from server">
          <p>
            {getErrorMessage(error)}
            <button className="btn-text ml-2" onClick={() => refetch()}>
              Retry
            </button>
          </p>
        </AlertError>
      ) : data ? (
        <>
          <section className="flex-grow">
            <div className="mx-auto h-full max-w-screen-2xl">
              <TodoDayLists data={dayLists} />
            </div>
          </section>
          <section>
            <div className="mx-auto h-full max-w-screen-2xl">
              <TodoNamedLists data={namedLists} />
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
};
