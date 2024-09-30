'use client';

import { useState, useLayoutEffect } from 'react';
import { useFetchQuotes } from './useFetchQuotes';
import QuoteColumn from './QuoteColumn';

/**
 * Parent component for quote grid
 * Show animated quote images with text in four columns
 * 
 * Child:
 * QuoteColumn
 * QuoteItem
 * 
 * Renders:
 * Four columns and inside those columns image with text quotes rendered with animation
 */

const COLUMN_HEIGHT = 600;
const ITEM_HEIGHT = 150;
const ITEMS_TO_SHOW = Math.ceil(COLUMN_HEIGHT / ITEM_HEIGHT) + 1;

type Quote = {
  id: number;
  text: string;
  image: string;
};

export default function QuoteGrid() {
  const [columns, setColumns] = useState<Quote[][]>([[], [], [], []]);
  const { data: fetchedQuotes, refetch } = useFetchQuotes();

  useLayoutEffect(() => {
    if (fetchedQuotes) {
      const updatedColumns: Quote[][] = [[], [], [], []];
      fetchedQuotes.forEach((quote, index) => {
        updatedColumns[index % 4].push(quote);
      });
      setColumns(updatedColumns);
    }
  }, [fetchedQuotes]);

  // Wrap refetch in a function to handle the click event
  const handleRefreshClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); // Prevent default button behavior
    refetch(); // Call the refetch function
  };

  return (
    <div className="min-h-screen bg-gray-100 relative">
      <header className="fixed top-0 left-0 right-0 bg-gray-800 text-white p-4 z-10">
        <h1 className="text-2xl font-bold">Quote Grid</h1>
      </header>
      <div className="fixed top-16 right-4 bg-blue-500 text-white p-2 rounded z-10">
        <button onClick={handleRefreshClick}>Refresh Quotes</button>
      </div>

      <div className="pt-24 ml-40 mr-40 grid grid-cols-4 gap-4 p-4 relative overflow-hidden h-[700px]">
        {columns.map((columnQuotes, columnIndex) => (
          <QuoteColumn key={columnIndex} quotes={columnQuotes} columnIndex={columnIndex} itemsToShow={ITEMS_TO_SHOW} />
        ))}
      </div>
    </div>
  );
}
