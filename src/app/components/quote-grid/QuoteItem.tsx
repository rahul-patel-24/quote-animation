import React, { useMemo } from 'react';

/**
 * display image with text and basic level component for quotegrid
 
 * Parent:
 * QuoteColumn
 
 * renders:
 * image and text
 */


type QuoteItemProps = {
    quote: {
        id: number;
        text: string;
        image: string;
    };
};

const QuoteItem: React.FC<QuoteItemProps> = ({ quote: { id, text, image } }) => {
    // Memoize the height to prevent recalculating it on every re-render
    const height = useMemo(() => {
        return Math.floor(Math.random() * (200 - 100 + 1)) + 300; // random height between 300 and 500px
    }, []);

    return (
        <div
            className="flex flex-col p-2 bg-white rounded-lg shadow-md w-full flex-shrink-0"
            style={{ height: `${height}px` }}
        >
            <img
                src={image}
                alt={`Quote ${id}`}
                className="p-2 w-full object-cover rounded-md"
                style={{ height: '90%' }}
            />
            <p className="mt-2 text-center text-sm">{text}</p>
        </div>
    );
};

export default React.memo(QuoteItem);
