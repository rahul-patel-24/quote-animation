// pages/new-quote.tsx
import QuoteEditor from '../components/QuoteEditor';

export default function NewQuote() {
  return (
    <main>
      <h1 className="text-center mt-5 text-3xl font-bold mb-6">Create a New Quote</h1>
      <QuoteEditor />
    </main>
  );
}
