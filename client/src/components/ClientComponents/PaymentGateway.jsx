import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { toast } from 'react-toastify';
import { completePayment } from '../../Redux/ClientSlice';
import Loading from '../Loading';
import noImage from '../../assets/Images/no-image.png';

export default function PaymentGateway() {
    const { id, orderId } = useParams();
    const [loading, setLoading] = useState(true);
    const [paymentCompleted, setPaymentCompleted] = useState(false);
    const { data } = useSelector(state => state.client);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Mock payment function for local development
    const handleMockPayment = () => {
        setLoading(true);
        toast.info("Processing mock payment...");
        
        setTimeout(() => {
            dispatch(completePayment({ 
                orderId, 
                paymentId: "MOCK_PAY_" + Date.now(),
                payerEmail: "mockuser@example.com"
            })).unwrap().then(() => {
                setLoading(false);
                setPaymentCompleted(true);
                toast.success("Mock payment completed successfully!");
                setTimeout(() => navigate(`/dashboard/client/${id}/orders`), 2000);
            });
        }, 1500);
    };

    useEffect(() => {
        // Simulate loading order data
        setTimeout(() => setLoading(false), 500);
    }, []);

    return (
        <div className="PaymentGateway">
            {loading && <Loading />}
            <div className="container">
                <div className="payment-section">
                    <div className="payment-header">
                        <h1>Development Payment Gateway</h1>
                        <p>Mock payment processing for local testing</p>
                    </div>
                    
                    <div className="payment-content">
                        <div className="service-summary">
                            <div className="service-image">
                                <img 
                                    src={data?.clientOrderInfo?.serviceInfo?.images?.split('|')[0] || noImage} 
                                    alt={data?.clientOrderInfo?.serviceInfo?.title} 
                                />
                            </div>
                            <div className="service-details">
                                <h2>{data?.clientOrderInfo?.serviceInfo?.title || "Test Service"}</h2>
                                <p className="provider">By {data?.clientOrderInfo?.serviceUserInfo?.name || "Test Provider"}</p>
                                <div className="price">${data?.clientOrderInfo?.serviceInfo?.price || "0.01"}</div>
                            </div>
                        </div>

                        <div className="payment-methods">
                            <div className="payment-method active">
                                <div className="method-header">
                                    <div className="method-logo">
                                        <img 
                                            src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg" 
                                            alt="PayPal" 
                                        />
                                    </div>
                                    <div className="method-title">Mock PayPal</div>
                                </div>
                                <div className="method-content">
                                    {!paymentCompleted ? (
                                        <>
                                            <div className="mock-payment-buttons">
                                                <button 
                                                    className="mock-pay-button"
                                                    onClick={handleMockPayment}
                                                >
                                                    Complete Mock Payment
                                                </button>
                                                <button 
                                                    className="mock-cancel-button"
                                                    onClick={() => navigate(`/dashboard/client/${id}/orders`)}
                                                >
                                                    Cancel Payment
                                                </button>
                                            </div>
                                            <div className="dev-note">
                                                <p><strong>Developer Note:</strong> This is a mock payment flow.</p>
                                                <p>No real transactions will occur.</p>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="payment-success">
                                            <svg viewBox="0 0 24 24" className="success-icon">
                                                <path fill="currentColor" d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" />
                                            </svg>
                                            <p>Mock payment successful! Redirecting...</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}