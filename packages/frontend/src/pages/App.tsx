import { TodoNamedLists } from '../components/TodoNamedLists';
import { TodoDayLists } from '../components/TodoDayLists';
import { useAppSelector } from '../store/store';
import { useGetListsQuery, usePostListsMutation } from '../store/api.generated';
import { getErrorMessage } from '../helpers';
import { AlertError } from '../components/AlertError';
import { AlertWarning } from '../components/AlertWarning';
import { CSSProperties } from 'react';
import { useInterval } from '../use-interval.hook';
import { useDispatch } from 'react-redux';
import { clearChanged } from '../store/lists.slice';

export const App = () => {
  const { day, size, named, current, changed } = useAppSelector((state) => state.lists);
  const { error, isLoading, refetch } = useGetListsQuery({ from: day.data[0], to: day.data[1] });
  const [post, postStatus] = usePostListsMutation();
  const dispatch = useDispatch();

  useInterval(() => {
    const changes = [...Object.values(changed.DAY), ...Object.values(changed.NAMED)];
    if (!postStatus.isLoading && changes.length > 0) {
      post({ body: changes }).then((response) => {
        if ('data' in response) {
          dispatch(clearChanged());
        }
      });
    }
  }, 10000);

  return (
    <div
      className="flex h-full flex-col items-stretch"
      style={
        {
          '--size': size,
          '--day-current': day.current - day.data[0],
          '--day-size': day.data[1] - day.data[0],
          '--named-current': named.current,
          '--named-size': Object.keys(current.NAMED).length,
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
      ) : null}
      <>
        <section className="flex-grow">
          <div className="mx-auto h-full max-w-screen-2xl">
            <TodoDayLists />
          </div>
        </section>
        <section>
          <div className="mx-auto h-full max-w-screen-2xl">
            <TodoNamedLists />
          </div>
        </section>
      </>
    </div>
  );
};
