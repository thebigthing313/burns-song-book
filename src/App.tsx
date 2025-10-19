import { Header } from './components/header';
import { MainContent } from './components/main-content';

function App() {
  return (
    <div className='flex flex-col w-screen h-screen'>
      <Header className='bg-accent w-full flex flex-row justify-between border-b p-6  items-center' />
      <MainContent className='bg-background flex-1 p-6 overflow-y-auto' />
    </div>
  );
}

export default App;
