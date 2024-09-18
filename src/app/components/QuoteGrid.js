'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';

const fetchQuotes = async () => {
    const randomId = Math.floor(Math.random() * 1000);
    const tempImage = [];
    for (let i = 0; i < 20; i++) {
        const randomWidth = Math.floor(Math.random() * (200 - 100 + 1)) + 200; // random width between 100 and 200px
        const randomHeight = Math.floor(Math.random() * (200 - 100 + 1)) + 150; // random height between 100 and 200px
        tempImage.push({
            id: randomId + i,
            text: 'Lorem ipsum',
            image: `https://picsum.photos/${randomWidth}/${randomHeight}?random=${randomId + i}`,
        });
    }
    return tempImage;
};

const COLUMN_HEIGHT = 600; // Height of each column in pixels
const ITEM_HEIGHT = 150; // Height of each item in pixels
const ITEMS_TO_SHOW = Math.ceil(COLUMN_HEIGHT / ITEM_HEIGHT) + 1; // Number of items to show initially

// Helper function for random size generation
const getRandomSize = () => {
    const randomWidth = Math.floor(Math.random() * (200 - 100 + 1)) + 300; // random width between 100 and 200px
    const randomHeight = Math.floor(Math.random() * (200 - 100 + 1)) + 300; // random height between 100 and 200px
    return { width: randomWidth, height: randomHeight };
};

export default function QuoteGrid() {
    const [quotes, setQuotes] = useState([]);
    const [columns, setColumns] = useState([[], [], [], []]);

    const { data: newQuotes, refetch } = useQuery({
        queryKey: ['quotes'],
        queryFn: fetchQuotes,
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        if (newQuotes) {
            setQuotes((prevQuotes) => [
                ...prevQuotes.slice(newQuotes.length), // Remove old quotes from the bottom
                ...newQuotes,
            ]);
        }
    }, [newQuotes]);

    useEffect(() => {
        const interval = setInterval(() => {
            refetch(); // Fetch new quotes periodically
        }, 10000); // Adjust as needed

        return () => clearInterval(interval);
    }, [refetch]);

    useEffect(() => {
        const newColumns = [[], [], [], []];
        quotes.forEach((quote, index) => {
            newColumns[index % 4].push(quote);
        });
        setColumns(newColumns);
    }, [quotes]);

    // Lazy-loading images when they are about to be in the viewport
    useEffect(() => {
        const images = document.querySelectorAll('img[data-src]');
        const observer = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.getAttribute('data-src');
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                });
            },
            {
                rootMargin: '50px 0px', // Start loading before the image is fully in view
                threshold: 0.01,
            }
        );
        images.forEach((img) => observer.observe(img));
        return () => images.forEach((img) => observer.unobserve(img));
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
            <div className="pt-24 ml-40 mr-40  grid grid-cols-4 gap-4 p-4 relative overflow-hidden h-[700px]">
                {columns.map((columnQuotes, columnIndex) => (
                    <div
                        key={columnIndex} // Unique key for each column
                        className="relative w-full overflow-hidden"
                        style={{ height: `${COLUMN_HEIGHT}px` }}
                    >
                        <motion.div
                            className="flex flex-col items-center justify-center content-center space-y-4"
                            initial={{ y: columnIndex % 2 === 0 ? ['0%'] : [ '0%'] }} // Start fully off-screen
                            animate={{
                                y: columnIndex % 2 === 0 ? ['-50%', '0%'] : ['0%', '-50%'],
                            }}
                            transition={{
                                duration: 30, // Adjust duration for smoothness
                                repeat: Infinity,
                                ease: 'linear',
                            }}
                        >
                            {/* Ensure that we always have enough items in the column to fill the height */}
                            {columnQuotes.length < ITEMS_TO_SHOW &&
                                [...Array(ITEMS_TO_SHOW).keys()].map((_, idx) => (
                                    <div
                                        key={`placeholder-${columnIndex}-${idx}`} // Unique key for each placeholder
                                        className="p-2 bg-transparent w-full h-[ITEM_HEIGHT}px"
                                    />
                                ))}
                            {columnQuotes.map((quote) => {
                                const { width, height } = getRandomSize();
                                return (
                                    <div
                                        key={`quote-${quote.id}`} // Unique key for each quote
                                        className="flex flex-col p-2  min-w-max max-w-max items-center bg-white rounded-lg shadow-md w-full flex-shrink-0"
                                        style={{ height: `${height}px` }}
                                    >
                                        <img
                                            data-src={quote.image}
                                            src={quote.image}
                                            alt={`Quote ${quote.id}`}
                                            className="p-2 w-full items-center justify-center content-center object-cover rounded-md"
                                            style={{ height: '90%' }}
                                        />
                                        <p className="mt-2 p-15 text-center text-sm">{quote.text}</p>
                                    </div>
                                );
                            })}
                        </motion.div>
                    </div>
                ))}
            </div>
        </div>
    );
}
