import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTheaters } from '../redux/actions/theaterAction';
import { CarouselDefault } from '../components/home_components/BannerComponent.jsx';


const TheaterPage = () => {
    const dispatch = useDispatch();
    
    useEffect(() => {
        dispatch(fetchTheaters());
    }, [dispatch]);
    
    const theaters = useSelector(state => state.theater.theaters);
    // const loading = useSelector(state => state.theater.loading);
    // const error = useSelector(state => state.theater.error);

    console.log(theaters);

    // if (loading) {
    //     return <div>Loading...</div>;
    // }

    // if (error) {
    //     return <div>Error: {error.message}</div>;
    // }

    return (
        <div>
            <CarouselDefault page='theater'/>
            
        </div>
    );
};

export default TheaterPage;
