import { useQuery } from '@tanstack/react-query';

/**
 * Fetch images from api and divide by four that so column get 
 diffrent quote images
 */

const fetchQuotes = async () => {
    const randomId = Math.floor(Math.random() * 1000);
    return Array.from({ length: 20 }, (_, i) => {
        const randomWidth = Math.floor(Math.random() * 101) + 100; // Random width between 100 and 200px
        const randomHeight = Math.floor(Math.random() * 101) + 150; // Random height between 150 and 250px
        return {
            id: randomId + i,
            text: 'Lorem ipsum',
            image: `https://picsum.photos/${randomWidth}/${randomHeight}?random=${randomId + i}`,
        };
    });
};

export const useFetchQuotes = () => {
    return useQuery({
        queryKey: ['quotes'],
        queryFn: fetchQuotes,
        refetchOnWindowFocus: false,
    });
};
