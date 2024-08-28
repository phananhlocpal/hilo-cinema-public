﻿import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Box, Heading, Text } from '@chakra-ui/react';
import { format } from 'date-fns';
import { Details } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { TextField } from '@mui/material';
import Modal from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';

const HistoryTab = () => {
    const { account } = useSelector((state) => state.auth);
    const [invoices, setInvoices] = useState([]);
    const [filteredInvoices, setFilteredInvoices] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);

    useEffect(() => {
        // Fetch invoices on component mount
        const fetchInvoices = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/InvoiceService/GetInvoicesByCustomerId/${account.id}`);
                console.log(response.data);
                setInvoices(response.data);
                setFilteredInvoices(response.data);
            } catch (error) {
                console.error('Error fetching invoices:', error);
            }
        };

        fetchInvoices();
    }, [account.id]);

    useEffect(() => {
        // Filter invoices by month and year when selectedDate changes
        if (selectedDate) {
            const selectedMonth = dayjs(selectedDate).format('YYYY-MM');
            const filtered = invoices.filter(invoice => format(new Date(invoice.createdDate), 'yyyy-MM') === selectedMonth);
            setFilteredInvoices(filtered);
        } else {
            setFilteredInvoices(invoices);
        }
    }, [selectedDate, invoices]);

    return (
        <div className="px-4 py-4 md:px-0 lg:px-6 md:py-6 bg-white rounded mt-4 xl:shadow-2xl min-h-[350px]">
            <Box p={4}>
                <Heading mb={4} style={{ fontSize: "1.5rem", fontWeight: "700", fontFamily: "Nunito Sans, sans-serif" }}>Lịch sử đơn hàng</Heading>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Chọn tháng/năm"
                        views={['year', 'month']}
                        value={selectedDate}
                        onChange={(newValue) => setSelectedDate(newValue)}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider>

                <Box borderWidth="1px" borderRadius="lg" overflow="hidden" mt={4}>
                    {filteredInvoices.length > 0 ? (
                        filteredInvoices.map(invoice => (
                            <Box key={invoice.id} p={4} borderBottomWidth="1px">
                                <div className="flex flex-row justify-between items-center">
                                    <p className="text-[#034EA2]">Mã đơn hàng: {invoice.id}</p>
                                    <p>Total: <span className="md:text-base xl:text-xl font-bold not-italic text-[#F58020]" style={{ fontSize: "1.5rem", fontWeight: "700", fontFamily: "Nunito Sans, sans-serif" }}> {invoice.total.toFixed(2)} VND</span></p>
                                </div>
                                <div className="mt-2 flex justify-between items-end">
                                    <div>
                                        <p style={{ fontSize: ".8rem" }}>Date: {format(new Date(invoice.createdDate), 'dd/MM/yyyy')}</p>
                                        <p style={{ fontSize: ".8rem" }}>Payment Method: {invoice.paymentMethod}</p>
                                    </div>
                                    <a className={`group flex items-center justify-center mt-3 border-[#034EA2] border-2 text-gray-700 bg-transparent hover:bg-[#034EA2] rounded text-sm px-5 py-2.5 text-center group-hover:text-white cursor-pointer transition duration-200 ease-in-out`} >
                                        <Details alt="Logo Watch Trailer" loading="lazy" width="18" height="18" decoding="async" data-nimg="1" className="text-[#034EA2] group-hover:text-white" />
                                        <span className="ml-1 group-hover:text-white">Xem chi tiết</span>
                                    </a>
                                </div>
                            </Box>
                        ))
                    ) : (
                        <Text textAlign="center" p={4}>Không có hóa đơn nào.</Text>
                    )}
                </Box>
            </Box>

        </div>
    );
};

const InvoiceDetail = ({invoice, isInvoiceModalOpen, closeModal}) => {

    const [movieDetail, setMovieDetail] = useState(null);
    const [theaterDetail, setTheaterDetail] = useState();

    const selectedSeats = invoice.schedules.map((item, index) => item.seat
    useEffect(() => {
        if (invoice && invoice.schedules && invoice.schedules.length > 0) {
            const movieId = invoice.schedules[0].movieId;
            fetchMovieDetail(movieId);
        }
    }, [invoice]);

    useEffect(() => {
        if (movieDetail) {
            fetchTheaterDetail(invoice.schedules[0].seatId);
        }
    }, [invoice.schedules[0].seatId]);

    // gọi api lấy movie từ movieId invoice.schedules[0].movieId
    const fetchMovieDetail = async (movieId) => {
        try {
            const response = await fetch(`http://localhost:8000/MovieService/${movieId}`);
            if (response.ok) {
                const data = await response.json();
                setMovieDetail(data);
            } else {
                console.error('Failed to fetch movie details');
            }
        } catch (error) {
            console.error('Error fetching movie details:', error);
        }
    };

    const fetchTheaterDetail = async (seatId) => {
        try {
            const response = await fetch(`http://localhost:8000/SeatService/${seatId}`);
            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                console.error('Failed to fetch seat info');
            }
        } catch (error) {
            console.error('Error fetching seat info:', error);
        }
    }

    return (
        <Modal open={isInvoiceModalOpen} onClose={closeModal} center
            styles={{
                modal: {
                    width: '400px',
                    maxWidth: '90%',
                    padding: '20px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                },
                overlay: {
                    background: 'rgba(0, 0, 0, 0.4)',
                },
            }}>
            <div className="bg-white rounded-lg p-6">
                <div className="booking__summary md:mb-4">
                    <div className="h-[6px] bg-primary rounded-t-lg"></div>
                    <div className="bg-white p-4 grid grid-cols-3 xl:gap-2 items-center">
                        <div className="row-span-2 md:row-span-1 xl:row-span-2 block md:hidden xl:block">
                            <img alt="Chờ Người Nơi Pháo Hoa Rực Rỡ" loading="lazy" width="100" height="150" decoding="async" data-nimg="1" className="xl:w-full xl:h-full md:w-[80px] md:h-[120px] w-[90px] h-[110px] rounded object-cover duration-500 ease-in-out group-hover:opacity-100 scale-100 blur-0 grayscale-0)" src="https://cdn.galaxycine.vn/media/2024/6/14/abl-500_1718351220871.jpg" style={{ backgroundColor: "transparent" }} />
                        </div>
                        <div className="row-span-2 md:row-span-1 xl:row-span-2 hidden md:block xl:hidden">
                            <img alt="Chờ Người Nơi Pháo Rực Rỡ" loading="lazy" width="100" height="150" decoding="async" data-nimg="1" className=" w-[220px] h-[150px] rounded object-cover duration-500 ease-in-out group-hover:opacity-100 scale-100 blur-0 grayscale-0)" src="https://cdn.galaxycine.vn/media/2024/6/14/abl-750_1718351221256.jpg" style={{ color: "transparent" }} />
                        </div>
                        <div className="flex-1 col-span-2 md:col-span-1 row-span-1 xl:col-span-2">
                            <h3 className="text-sm xl:text-base font-bold xl:mb-2 ">
                                {movieDetail.title}
                            </h3>
                            <p className="text-sm inline-block">{movieDetail.type}</p>
                            <span> - </span>
                            <div className="xl:mt-2 ml-2 xl:ml-0 inline-block">
                                <span className="inline-flex items-center justify-center w-[38px] h-7 bg-primary rounded text-sm text-center text-white font-bold not-italic">
                                    T16
                                </span>
                            </div>
                        </div>
                        <div className="col-span-2 md:col-span-1 xl:col-span-3">
                            <div>
                                <div className="xl:mt-4 text-sm xl:text-base">
                                    <strong>{theaterDetail.theaterName}</strong>
                                    <span> - </span>
                                    <span className="text-sm xl:text-base">{theaterDetail.roomName}</span>
                                </div>
                                <div className="xl:mt-2 text-sm xl:text-base">
                                    <span>Suất: </span>
                                    <strong>{invoice.schedules[0].time}</strong>
                                    <span> - </span>
                                    <span className="capitalize text-sm">
                                        <strong> {invoice.schedules[0].date}</strong>
                                    </span>
                                </div>
                            </div>
                            <div className="xl:block hidden">
                                <div
                                    className={`my-4 border-t border-black border-dashed ${selectedSeats.length === 0 ? 'hidden' : 'xl:block'}`}
                                >
                                </div>
                                {selectedSeats.map((seat, index) => (
                                    <div key={index} className="flex justify-between text-sm mt-2">
                                        <div>
                                            <strong>1x </strong>
                                            <span>{seat.seatType === "Normal" ? 'Ghế đơn' : 'Ghế đôi'}</span>
                                            <div>
                                                <span>Ghế: </span>
                                                <strong>{seat.seatName}</strong>
                                            </div>
                                        </div>
                                        <span className="inline-block font-bold ">75.000&nbsp;₫</span>
                                    </div>
                                ))}
                            </div>
                            <div className="xl:block hidden">
                                <div
                                    className={`my-4 border-t border-black border-dashed ${selectedFood.length === 0 ? 'hidden' : 'xl:block'}`}
                                >
                                </div>
                                {
                                    selectedFood.map((food, index) => (
                                        <div key={index} className="flex justify-between text-sm">
                                            <span>
                                                <strong>{food.quantity}x </strong>
                                                <span>{food.name}</span>
                                            </span>
                                            <span className="inline-block font-bold ">{food.quantity * food.price}&nbsp;₫</span>
                                        </div>
                                    ))
                                }
                            </div>
                            <div className="my-4 border-t border-black border-dashed xl:block hidden"></div>
                        </div>
                        <div className="xl:flex hidden justify-between col-span-3">
                            <strong className="text-base">Tổng cộng</strong>
                            <span className="inline-block font-bold text-primary">
                                {invoice.total.toLocaleString()}&nbsp;₫
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

export default HistoryTab;
