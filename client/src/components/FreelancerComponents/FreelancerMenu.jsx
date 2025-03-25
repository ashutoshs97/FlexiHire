import home from '../../assets/svgs/homeIcon.svg'
import services from '../../assets/svgs/servicesIcon.svg'
import chat from '../../assets/svgs/chatIcon.svg'
import settings from '../../assets/svgs/settings.svg'
import { useParams } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

export default function FreelancerMenu({ active }) {
    const { id } = useParams();
    
    const menuItems = [
        { name: "Home", path: `/dashboard/freelancer/${id}`, icon: home, key: "home" },
        { name: "My Services", path: `/dashboard/freelancer/${id}/services`, icon: services, key: "services" },
        { name: "Chat Room", path: `/dashboard/freelancer/${id}/chat`, icon: chat, key: "chat" },
        { name: "My Profile", path: `/dashboard/freelancer/${id}/profile`, icon: settings, key: "profile" }
    ];

    return (
        <menu className='Menu'>
            {menuItems.map(item => (
                <div className={`link ${active === item.key ? 'active' : ''}`} key={item.key}>
                    <NavLink to={item.path}>
                        <img src={item.icon} alt={item.name} />
                        <div className="linkHeader">{item.name}</div>
                    </NavLink>
                </div>
            ))}
        </menu>
    )
}
