import React from 'react';
import { motion } from 'framer-motion';
import QuoteItem from './QuoteItem';

/**
 * Manages a single column in the quote grid.
 * Initial animation makes the quotes appear to come from the top or bottom, with odd columns sliding up and even columns sliding down.
 *
 * Params:
 * - itemsToShow: The number of quotes to display in each column.
 * 
 * Parent: 
 * - QuoteGrid
 * 
 * Child:
 * - QuoteItem
 * 
 * Renders:
 * - A motion div that contains QuoteItems with sliding animations.
 */

type QuoteColumnProps = {
    quotes: Array<{ id: number; text: string; image: string }>;
    columnIndex: number;
    itemsToShow: number;
};

const QuoteColumn: React.FC<QuoteColumnProps> = ({ quotes, columnIndex, itemsToShow }) => {
    return (
        <div className="relative w-full overflow-hidden" style={{ height: `650px` }}>
            <motion.div
                className="flex flex-col items-center space-y-4"
                initial={{ y: columnIndex % 2 === 0 ? '0%' : '150%' }} // Alternating starting position based on column index
                animate={{ y: columnIndex % 2 === 0 ? ['-100%', '10%'] : ['40%', '-100%'] }} // Alternating movement for odd/even columns
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }} // Infinite loop with smooth linear movement
            >
                {/* Fill the empty space with placeholders if there are fewer quotes than itemsToShow */}
                {quotes.length < itemsToShow &&
                    Array.from({ length: itemsToShow - quotes.length }).map((_, idx) => (
                        <div
                            key={`placeholder-${columnIndex}-${idx}`}
                            className="p-2 bg-transparent w-full h-[150px]" // Placeholder for empty space
                        />
                    ))
                }

                {/* Render each QuoteItem for the column */}
                {quotes.map((quote) => (
                    <QuoteItem key={quote.id} quote={quote} />
                ))}
            </motion.div>
        </div>
    );
};

export default React.memo(QuoteColumn);
