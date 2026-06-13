import { HashRouter, Route, Routes } from 'react-router-dom';
import { Header } from './components/header';
import { MainContent } from './components/main-content';
import { SearchBar } from './components/search-bar';
import { ThemeProvider } from './components/theme-provider';
import { QueueView } from './components/queue-view';

function SongListPage() {
  return (
    <div className='flex flex-col gap-2 w-screen h-screen'>
      <Header className='bg-gradient-to-r from-accent to-background w-full flex flex-row justify-between border-b px-6 py-2 items-center' />
      <SearchBar className='px-6 py-2' />
      <MainContent className='bg-background flex-1 px-6 mb-4 overflow-y-auto' />
    </div>
  );
}

function QueuePage() {
  return (
    <div className='flex flex-col w-screen h-screen'>
      <QueueView className='flex-1 overflow-y-auto px-6 py-4' />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme='system' storageKey='burns-song-book-theme'>
      <HashRouter>
        <Routes>
          <Route path='/' element={<SongListPage />} />
          <Route path='/queue' element={<QueuePage />} />
        </Routes>
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;
