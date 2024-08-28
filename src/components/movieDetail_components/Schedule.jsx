import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSchedule } from "../../redux/actions/movieDetail/scheduleAction";
import PropTypes from 'prop-types';
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";

const Schedule = ({ movie, selectedDate }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, schedule, error } = useSelector(state => state.schedule);

    useEffect(() => {
        dispatch(fetchSchedule(movie.movieUrl));
    }, [dispatch, movie.movieUrl]);

    if (loading) return (
        <div className="w-full h-[150px] flex justify-center items-center">
            <CircularProgress  />
        </div>
    );
    if (error) return <p>Error: {error}</p>;

    const schedules = Array.isArray(schedule) ? schedule : [];
    console.log(schedules);

    // Lọc lịch trình theo ngày đã chọn
    const filteredSchedules = schedules
        .filter(scheduleItem => scheduleItem.date === selectedDate);

    const handleTimeClick = (movieId, title, movieUrl, theaterId, theaterName, roomId, roomName, time) => {
        navigate(`/dat-ve/${movieUrl}`, {
            state: {
                movieId,
                title,
                movieUrl,
                theaterName,
                roomName,
                date: selectedDate,
                theaterId,
                roomId,
                time
            }
        });
    };

    return (
        <div>
            {filteredSchedules.length === 0 ? (
                <p>No schedules available for this date.</p>
            ) : (
                filteredSchedules.map((scheduleItem, index) => (
                    <div key={index}>
                        {scheduleItem.theaterSchedules.map((theaterScheduleItem, theaterIndex) => (
                            <div key={theaterIndex} className="showtime__cinema md:py-8 py-4 px-3 odd:bg-white even:bg-[#FDFBFA] even:border-t even:border-b">
                                <h1 className="text-base font-bold mb-4 text-gray-800">
                                    {theaterScheduleItem.theaterName}
                                </h1>
                                <div className="showtime__bundle flex md:flex-row flex-col gap-2 items-start mb-6">
                                    {theaterScheduleItem.roomSchedules.map((roomSchedule, roomIndex) => (
                                        <div key={roomIndex} className="time__show flex flex-1 flex-row gap-x-3 gap-y-1 flex-wrap">
                                            {roomSchedule.times.map((time, timeIndex) => (
                                                <button
                                                    key={timeIndex}
                                                    onClick={() => handleTimeClick(
                                                        movie.id,
                                                        movie.title,
                                                        movie.movieUrl,
                                                        theaterScheduleItem.theaterId,
                                                        theaterScheduleItem.theaterName,
                                                        roomSchedule.roomId,
                                                        roomSchedule.roomName,
                                                        time)}
                                                    className="py-2 md:px-8 px-6 border rounded text-sm font-normal text-black hover:bg-blue-10 active:bg-blue-10  transition-all duration-500 ease-in-out hover:text-white"
                                                >
                                                    {time}
                                                </button>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ))
            )}
        </div>
    );
};

Schedule.propTypes = {
    movie: PropTypes.object.isRequired,
    selectedDate: PropTypes.string.isRequired,
};

export default Schedule;
