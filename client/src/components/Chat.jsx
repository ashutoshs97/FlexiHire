import FreelancerMenu from './FreelancerComponents/FreelancerMenu';
import noImage from '../assets/Images/no-image.png';
import { useEffect, useState } from 'react';
import Messages from './Messages';
import ClientMenu from './ClientComponents/ClientMenu';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { tokenExists } from '../Redux/UserSlice';
import { myConversations } from '../Redux/ChatSlice';
import Loading from './Loading';
import { toast } from 'react-toastify';

// Import Axios instance (assuming it's configured in myAxios.js)
import axios from './myAxios';

export default function Chat({ type }) {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useSelector((state) => state.user);
  const { data } = useSelector((state) => state.chat);
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if token exists and user is authenticated
    tokenExists(token, navigate, dispatch).then(
      (data) =>
        data === false ||
        JSON.parse(localStorage.getItem('userInfo'))._id !== id ||
        window.location.href.slice(32).split('/')[0] !== JSON.parse(localStorage.getItem('userInfo')).role
          ? navigate('/login')
          : null
    );

    // Fetch conversations
    dispatch(myConversations()).unwrap().then(
      (data) => {
        setTimeout(() => {
          setLoading(false);
          if (data.status === 404) {
            toast.error(data.msg);
            navigate('/login');
          }
          if (data.status === 505) {
            toast.error(data.msg);
          }
        }, 1000);
      },
      (rejectedValueOrSerializedError) => {
        setTimeout(() => {
          setLoading(false);
          toast.error(rejectedValueOrSerializedError);
        }, 1000);
      }
    );
  }, []);

  return (
    <>
      {loading && <Loading />}
      <div className="Chat">
        <div className="container">
          <div className="section">
            {data?.userConversation?.length !== 0 ? (
              <>
                <div className="messages">
                  {data?.userConversation?.map((conversation) => (
                    <div
                      key={conversation._id}
                      className={selectedMessage !== conversation._id ? "messageSection" : "messageSection active"}
                      onClick={() => setSelectedMessage(conversation._id)}
                    >
                      <img
                        src={
                          conversation.avatar === "no-image.png"
                            ? noImage
                            : `${process.env.REACT_APP_API_URL}/ProfilePic/${conversation.avatar}`
                        }
                        alt="test image"
                      />
                      <div className="messageUserInfo">
                        <div className="messageUserName">{conversation.username}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="selectedMessages">
                  {selectedMessage === null ? (
                    <div className="nomessage">
                      <div className="title">FlexiHire</div>
                      <span>Select A Message</span>
                    </div>
                  ) : (
                    <Messages selectedMessage={selectedMessage} />
                  )}
                </div>
              </>
            ) : (
              <div className="zeroMessage">
                <div className="nomessage">
                  <div className="title">FlexiHire</div>
                  <span>You have no messages for now</span>
                </div>
              </div>
            )}
          </div>
          {type === "freelancer" ? <FreelancerMenu active="chat" /> : <ClientMenu active="chat" />}
        </div>
      </div>
    </>
  );
}