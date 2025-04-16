import { useNavigate, useParams } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { tokenExists } from '../Redux/UserSlice';
import { useEffect, useRef, useState } from 'react';
import { showService } from '../Redux/FreelancerSlice';
import { toast } from 'react-toastify';
import { makeOrder, makeTestimonial, orderInfo, serviceInfo, updateOrderStatus } from '../Redux/ClientSlice';
import FreelancerMenu from './FreelancerComponents/FreelancerMenu';
import Loading from './Loading'; // Ensure to import Loading component
import Slider from './Slider'; // Ensure to import Slider component
import noImage from '../assets/no-image.png'; // Ensure to import noImage placeholder

export default function ServiceDetails({ type }) {
  const { id, serviceId } = useParams();
  const [loading, setLoading] = useState(true);
  const [starNumber, setStarNumber] = useState(0);
  const [hoverStar, setHoverStar] = useState(undefined);
  const { token, avatar } = useSelector((state) => state.user);
  const { data } = useSelector(type === 1 ? (state) => state.freelancer : (state) => state.client);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const testimonial = useRef();

  // Use environment variable for the backend URL
  const API_URL = process.env.REACT_APP_API_URL || 'https://flexihire-immj.onrender.com';

  useEffect(() => {
    if (!tokenExists(token)) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [serviceId]);

  const fetchData = () => {
    if (type === 1) {
      dispatch(showService(serviceId))
        .unwrap()
        .then((data) => {
          setTimeout(() => {
            setLoading(false);
            if (data.status === 404) {
              navigate('/404');
            }
          }, 1000);
        })
        .catch((error) => {
          setTimeout(() => {
            setLoading(false);
            toast.error(error.message || 'Failed to fetch service details.');
          }, 1000);
        });
    } else if (type === 2) {
      dispatch(serviceInfo(serviceId))
        .unwrap()
        .then((data) => {
          setTimeout(() => {
            setLoading(false);
            if (data.status === 404) {
              navigate('/404');
            } else if (data.status === 505) {
              toast.error(data.msg);
            }
          }, 1000);
        })
        .catch((error) => {
          setTimeout(() => {
            setLoading(false);
            toast.error(error.message || 'Failed to fetch service information.');
          }, 1000);
        });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let err = [];
    if (parseInt(starNumber) < 1 || parseInt(starNumber) > 5 || isNaN(parseInt(starNumber))) {
      err.push('You should choose at least one star.');
    }
    if (testimonial.current.value.length > 120 || !/^.*[a-zA-Z]+.*$/.test(testimonial.current.value)) {
      err.push('The testimonial should contain 120 characters or less and at least some text.');
    }
    if (err.length !== 0) {
      toast.error(
        <div>
          {err.map((e, i) => (
            <p key={i}>{e}</p>
          ))}
        </div>
      );
    } else {
      setLoading(true);
      dispatch(makeTestimonial({
        serviceId,
        testimonial: testimonial.current.value,
        stars: starNumber
      }))
        .unwrap()
        .then(() => {
          toast.success('Testimonial added successfully!');
          fetchData();
        })
        .catch((error) => {
          toast.error(error.message || 'Failed to add testimonial.');
          setLoading(false);
        });
    }
  };

  return (
    <>
      {loading && <Loading />}
      <div className="ServiceDetail">
        <div className="container">
          {type === 1 && <FreelancerMenu />}
          <div className="section">
            {type === 1 || type === 2 ? (
              data?.selectedService && (
                <>
                  <div className="mySwiperContainer">
                    <Slider images={data.selectedService.images?.split('|') || []} />
                  </div>
                  <div className="service-title">{data.selectedService.title}</div>
                  <div className="service-description">
                    {data.selectedService.description.split('\n').map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                  {type === 1 ? (
                    <div className="service-price">
                      <h3>Price: ${data.selectedService.price}</h3>
                      <p>Delivery Time: {data.selectedService.deliveryTime} days</p>
                    </div>
                  ) : (
                    <div className="service-actions">
                      <button 
                        className="btn-primary"
                        onClick={() => dispatch(makeOrder(serviceId))
                          .unwrap()
                          .then(() => {
                            toast.success('Order placed successfully!');
                            navigate('/client/orders');
                          })
                          .catch(error => toast.error(error.message || 'Failed to place order'))
                        }
                      >
                        Order Now (${data.selectedService.price})
                      </button>
                    </div>
                  )}
                  {type === 2 && (
                    <div className="testimonial-form">
                      <form onSubmit={handleSubmit}>
                        <img
                          src={avatar === 'no-image.png' ? noImage : `${API_URL}/ProfilePic/${avatar}`}
                          alt="Profile"
                          className="profile-pic"
                        />
                        <div className="form-input">
                          <div className="testimonialHeader">Add Testimonial</div>
                          <div className="stars">
                            {Array(5).fill().map((_, index) =>
                              starNumber >= index + 1 || hoverStar >= index + 1 ? (
                                <AiFillStar
                                  key={index}
                                  className="star-icon filled"
                                  onMouseOver={() => !starNumber && setHoverStar(index + 1)}
                                  onMouseLeave={() => setHoverStar(undefined)}
                                  onClick={() => setStarNumber(index + 1)}
                                />
                              ) : (
                                <AiOutlineStar
                                  key={index}
                                  className="star-icon"
                                  onMouseOver={() => !starNumber && setHoverStar(index + 1)}
                                  onMouseLeave={() => setHoverStar(undefined)}
                                  onClick={() => setStarNumber(index + 1)}
                                />
                              )
                            )}
                          </div>
                          <textarea
                            name="testimonialText"
                            ref={testimonial}
                            placeholder="Write your opinion about the service (max 120 characters)"
                            id="testimonialText"
                            maxLength={120}
                            required
                          />
                          <button type="submit" className="btn-primary">
                            Submit Testimonial
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </>
              )
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
