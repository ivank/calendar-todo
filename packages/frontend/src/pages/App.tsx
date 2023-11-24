import { TodoNamedLists } from '../components/TodoNamedLists';
import { TodoDayLists } from '../components/TodoDayLists';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useGetListsQuery } from '../store/api.generated';
import { isDayList, isNamedList } from '../store/api';
import { getErrorMessage } from '../helpers';
import { AlertError } from '../components/AlertError';
import { AlertWarning } from '../components/AlertWarning';

export const App = () => {
  const { day } = useSelector((state: RootState) => state.lists);
  const { data, error, isLoading, refetch } = useGetListsQuery({ from: day.data[0], to: day.data[1] });

  return (
    <div className="flex flex-col h-full items-stretch">
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
            <div className="max-w-screen-2xl mx-auto h-full">
              <TodoDayLists data={data.filter(isDayList)} />
            </div>
          </section>
          <section>
            <div className="max-w-screen-2xl mx-auto h-full">
              <TodoNamedLists data={data.filter(isNamedList)} />
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
};
