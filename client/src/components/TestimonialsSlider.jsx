import { Navigation, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import noImage from '../assets/Images/no-image.png';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Use environment variable with fallback
const API_BASE_URL = process.env.REACT_APP_API_URL || "https://your-render-backend.onrender.com";

export default function Testimonial({ data, role }) {
    return (
        <>
            <Swiper
                className="card"
                modules={[Navigation, A11y]}
                spaceBetween={100}
                slidesPerView={1}
                navigation
            >
                {data?.map((testimonial, i) => {
                    const avatar =
                        role === "freelancer"
                            ? testimonial.clientAvatar
                            : testimonial.freelancerAvatar;

                    const username =
                        role === "freelancer"
                            ? testimonial.clientUsername
                            : testimonial.freelancerUsername;

                    const text =
                        role === "freelancer"
                            ? testimonial.text
                            : testimonial.testimonialText;

                    const imageSrc =
                        avatar && avatar !== "no-image.png"
                            ? `${API_BASE_URL}/ProfilePic/${avatar}`
                            : noImage;

                    return (
                        <SwiperSlide key={testimonial.clientId || i}>
                            <img
                                src={imageSrc}
                                alt="User Pic"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = noImage;
                                }}
                            />
                            <div className="info">
                                <div className="cardHeader">{username}</div>
                                <div className="cardDescription">{text}</div>
                            </div>
                        </SwiperSlide>
                    );
                })}
            </Swiper>
        </>
    );
}
