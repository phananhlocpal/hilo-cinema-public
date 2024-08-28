import { useEffect, useState } from 'react';
import axios from 'axios';

import MovieCardItem from '../components/common_components/comom_item/MovieCardItem';

const ListMovieNowShowing = () => {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        // Gọi API để lấy dữ liệu phim
        const fetchMovies = async () => {
            try {
                const response = await axios.get('http://localhost:8000/MovieService');

                const sortedMovies = response.data.sort((a, b) => new Date(b.releasedDate) - new Date(a.releasedDate));
                
                console.log(sortedMovies);
                setMovies(sortedMovies);
            } catch (error) {
                console.error('Error fetching movies:', error);
            }
        };

        fetchMovies();
    }, []);

    return (
        <div className='pt-5 flex justify-center items-center'>
            <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-4 gap-6 mb-10'>
                {movies.map(({ id, title, movieUrl, imgSmall }) => (
                    <MovieCardItem
                        key={id}
                        title={title}
                        imageUrl={`data:image/jpeg;base64,${imgSmall}`}
                        href={movieUrl}
                        widthCard="250px"
                        heightCard="400px"
                    />
                ))}
            </div>
        </div>
    );
};

export default ListMovieNowShowing;