'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';

const fetchQuotes = async () => {
  // Simulate fetching new random quotes with images from Picsum
  const randomId = Math.floor(Math.random() * 1000); // Randomize API call
  return [
    { id: randomId + 1, text: 'Stay positive!', image: `https://picsum.photos/150/150?random=${randomId + 1}` },
    { id: randomId + 2, text: 'Believe in yourself.', image: `https://picsum.photos/150/150?random=${randomId + 2}` },
    { id: randomId + 3, text: 'Keep moving forward.', image: `https://picsum.photos/150/150?random=${randomId + 3}` },
    { id: randomId + 4, text: 'Dream big!', image: `https://picsum.photos/150/150?random=${randomId + 4}` },
    { id: randomId + 5, text: 'Embrace the journey.', image: `https://picsum.photos/150/150?random=${randomId + 5}` },
    { id: randomId + 6, text: 'Stay humble.', image: `https://picsum.photos/150/150?random=${randomId + 6}` },
    { id: randomId + 7, text: 'Stay focused.', image: `https://picsum.photos/150/150?random=${randomId + 7}` },
    { id: randomId + 8, text: 'Never give up.', image: `https://picsum.photos/150/150?random=${randomId + 8}` },
  ];
};

const COLUMN_HEIGHT = 600; // Height of each column in pixels
const ITEM_HEIGHT = 150; // Height of each item in pixels
const ITEMS_TO_SHOW = Math.ceil(COLUMN_HEIGHT / ITEM_HEIGHT) + 1; // Number of items to show initially

export default function QuoteGrid() {
  const [quotes, setQuotes] = useState([]);
  const [columns, setColumns] = useState([[], [], [], []]);

  const { data: newQuotes, refetch } = useQuery({
    queryKey: ['quotes'],
    queryFn: fetchQuotes,
    refetchOnWindowFocus: false,
  });

  const addNewQuotes = useCallback(() => {
    if (newQuotes) {
      setQuotes((prevQuotes) => [
        ...prevQuotes.slice(newQuotes.length), // Remove old quotes from the bottom
        ...newQuotes
      ]);
    }
  }, [newQuotes]);

  useEffect(() => {
    addNewQuotes();
  }, [addNewQuotes]);

  useEffect(() => {
    const interval = setInterval(() => {
      refetch(); // Fetch new quotes periodically
    }, 10000); // Adjust as needed

    return () => clearInterval(interval);
  }, [refetch]);

  useEffect(() => {
    // Distribute quotes into 4 columns
    const newColumns = [[], [], [], []];
    quotes.forEach((quote, index) => {
      newColumns[index % 4].push(quote);
    });
    setColumns(newColumns);
  }, [quotes]);

  return (
    <div className="min-h-screen bg-gray-100 relative">
      {/* Fixed Header and Button */}
      <header className="fixed top-0 left-0 right-0 bg-gray-800 text-white p-4 z-10">
        <h1 className="text-2xl font-bold">Quote Grid</h1>
      </header>
      <div className="fixed top-16 right-4 bg-blue-500 text-white p-2 rounded z-10">
        <button onClick={refetch}>Refresh Quotes</button>
      </div>

      {/* Grid of 4 columns with infinite scrolling animation */}
      <div className="pt-24 grid grid-cols-4 gap-4 p-4 relative overflow-hidden h-[600px]">
        {columns.map((columnQuotes, columnIndex) => (
          <div
            key={columnIndex} // Unique key for each column
            className="relative w-full overflow-hidden"
            style={{ height: `${COLUMN_HEIGHT}px` }}
          >
            <motion.div
              className="flex flex-col space-y-4"
              animate={{ y: columnIndex % 2 === 0 ? '-100%' : '100%' }}
              transition={{
                duration: 10, // Adjust duration as needed
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              {/* Ensure that we always have enough items in the column to fill the height */}
              {columnQuotes.length > ITEMS_TO_SHOW
                ? columnQuotes.slice(0, ITEMS_TO_SHOW).map((quote, idx) => (
                    <div
                      key={`quote-${quote.id}-${idx}`} // Unique key for each quote
                      className="p-2 bg-white rounded-lg shadow-md w-full flex-shrink-0"
                    >
                      <img
                        src={quote.image}
                        alt={`Quote ${quote.id}`}
                        className="w-full h-24 object-cover rounded-md"
                      />
                      <p className="mt-2 text-center text-sm">{quote.text}</p>
                    </div>
                  ))
                : columnQuotes.map((quote, idx) => (
                    <div
                      key={`quote-${quote.id}-${idx}`} // Unique key for each quote
                      className="p-2 bg-white rounded-lg shadow-md w-full flex-shrink-0"
                    >
                      <img
                        src={quote.image}
                        alt={`Quote ${quote.id}`}
                        className="w-full h-24 object-cover rounded-md"
                      />
                      <p className="mt-2 text-center text-sm">{quote.text}</p>
                    </div>
                  ))}
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}
