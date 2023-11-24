import { TodoNamedLists } from '../components/TodoNamedLists';
import { TodoDayLists } from '../components/TodoDayLists';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useGetListsQuery } from '../store/api.generated';
import { isDayList, isNamedList } from '../store/api';
import { getErrorMessage } from '../helpers';

export const App = () => {
  const { day } = useSelector((state: RootState) => state.lists);
  const { data, error, isLoading } = useGetListsQuery({ from: day.data[0], to: day.data[1] });

  return (
    <div className="flex flex-col h-full items-stretch">
      {error && getErrorMessage(error)}
      {isLoading && <>Loading ...</>}
      {data && (
        <>
          <section className="flex-grow">
            <div className="max-w-screen-2xl mx-auto h-full">
              <TodoDayLists data={data.filter(isDayList)} />
            </div>
          </section>
          <section className="max-w-screen-2xl mx-auto">
            <TodoNamedLists data={data.filter(isNamedList)} />
          </section>
        </>
      )}
    </div>
  );
};
