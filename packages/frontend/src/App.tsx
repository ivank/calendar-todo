import { TodoNamedLists } from './components/TodoNamedLists';
import { TodoDayLists } from './components/TodoDayLists';
import { Navbar } from './components/Navbar';

function App() {
  return (
    <div className="min-h-full">
      <Navbar />
      <section>
        <TodoDayLists />
      </section>
      <section>
        <TodoNamedLists />
      </section>
    </div>
  );
}

export default App;
