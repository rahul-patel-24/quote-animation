import QuoteGrid from './components/QuoteGrid';
// import QuoteEditor from './components/QuoteEditor'

export default function Home() {
  return (
    <main>
      <h1 className="text-center text-3xl font-bold mb-6">Quote Sharing App</h1>
      {/* <QuoteEditor /> */}
      <QuoteGrid />
    </main>
  );
}
