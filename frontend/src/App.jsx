import ThemeToggle from './components/ThemeToggle';

function App() {
  return (
    <div className="bg-white dark:bg-black text-black dark:text-white min-h-screen">
      <ThemeToggle />
      <p className="text-4xl font-bold text-center">Tailwind with React!</p>
    </div>
  );
}

export default App;
