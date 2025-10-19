import { Header } from './components/header';
import { MainContent } from './components/main-content';
import { SearchBar } from './components/search-bar';

function App() {
  return (
    <div className='flex flex-col gap-2 w-screen h-screen'>
      <Header className='bg-accent w-full flex flex-row justify-between border-b px-6 py-2 items-center' />
      <SearchBar className='px-6 py-2' />
      <MainContent className='bg-background flex-1 px-6 overflow-y-auto' />
    </div>
  );
}

export default App;
