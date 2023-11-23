import { TodoNamedLists } from '../components/TodoNamedLists';
import { TodoDayLists } from '../components/TodoDayLists';
import { Authenticated } from '../components/Authenticated';

export const App = () => (
  <Authenticated>
    <div className="flex flex-col h-full items-stretch">
      <section className="flex-grow">
        <div className="max-w-screen-2xl mx-auto h-full">
          <TodoDayLists />
        </div>
      </section>
      <section className="max-w-screen-2xl mx-auto">
        <TodoNamedLists />
      </section>
    </div>
  </Authenticated>
);
