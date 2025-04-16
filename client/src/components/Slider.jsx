import { Navigation, Pagination, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Use environment variable with fallback
const API_BASE_URL = process.env.REACT_APP_API_URL || "https://your-render-backend.onrender.com";

export default function Slider({ images }) {
    return (
        <Swiper
            className='swiper-container'
            modules={[Navigation, Pagination, A11y]}
            spaceBetween={100}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
        >
            {images.map((imageSrc, i) => (
                <SwiperSlide key={i}>
                    <img
                        src={`${API_BASE_URL}/ServicePic/${imageSrc}`}
                        alt="service"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/fallback-image.png"; // Optional fallback
                        }}
                    />
                </SwiperSlide>
            ))}
        </Swiper>
    );
}
