import { TodoNamedLists } from '../components/TodoNamedLists';
import { TodoDayLists } from '../components/TodoDayLists';
import { useAppSelector, useAppStore } from '../store/store';
import { useGetListsQuery, usePostListsMutation } from '../store/api.generated';
import { getErrorMessage } from '../helpers';
import { AlertError } from '../components/AlertError';
import { AlertWarning } from '../components/AlertWarning';
import { useInterval } from '../use-interval.hook';
import { toChangesLists } from '../store/db.slice';

export const App = () => {
  const { getState } = useAppStore();
  const { day } = useAppSelector((state) => state.ui);
  const listQuery = useGetListsQuery({ from: day.data[0], to: day.data[1] });
  const [post, postQuery] = usePostListsMutation({ fixedCacheKey: 'sync' });

  useInterval(() => {
    if (!postQuery.isLoading && !postQuery.isError) {
      const changes = toChangesLists(getState().db.changes);
      if (changes.length > 0) {
        post({ body: changes });
      }
    }
  }, 5000);

  return (
    <div className="flex h-full flex-col items-stretch">
      {listQuery.isLoading ? (
        <AlertWarning title="Loading" />
      ) : postQuery.isError || listQuery.isError ? (
        <AlertError title="Error Communicating with server">
          <ul>
            {listQuery.error && (
              <li>
                Loading Error: {getErrorMessage(postQuery.error)}
                <button className="btn-text ml-2" onClick={() => listQuery.refetch()}>
                  Retry
                </button>
              </li>
            )}
            {postQuery.error && (
              <li>
                Saving Error: {getErrorMessage(postQuery.error)}
                <br />
                Your data is saved locally and will attempt to reconnect with the server periodically.
                <button className="btn-text ml-2" onClick={() => postQuery.reset()}>
                  Retry
                </button>
              </li>
            )}
          </ul>
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
