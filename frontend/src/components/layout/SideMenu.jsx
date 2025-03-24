import React, { useContext, useState } from 'react';
import { SIDE_MENU_DATA } from '../../utils/data';
import { UserContext } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import CharAvatar from '../cards/CharAvatar';
import Modal from './Modal';


export default function SideMenu({ activeMenu }) {
    const { user, clearUser } = useContext(UserContext);
    const navigate = useNavigate();

    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleClick = (route) => {
        if (route === 'logout') {
            setShowLogoutModal(true);
            return;
        }
        navigate(route);
    }

    const handleLogout = () => {
        localStorage.clear();
        clearUser();
        navigate('/login');
    };

    return (
        <>
            <div className='w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-500/50 p-5 sticky top-[61px] z-20 '>
                <div className='flex flex-col items-center justify-center gap-3 mt-3 mb-7'>
                    {user?.profileImageUrl ? (
                        <img
                            src={user?.profileImageUrl || ""}
                            alt="Profile Image"
                            className="w-20 h-20 bg-slate-400 rounded-full"
                        />) : <CharAvatar
                        fullName={user?.fullName}
                        width="w-20"
                        height="h-20"
                        style="text-xl"
                    />
                    }
                    <h5 className='text-gray-950 font-medium leading-6'>
                        {user?.fullName || " "}
                    </h5>
                </div>
                {SIDE_MENU_DATA.map((item, index) => (
                    <button
                        key={`menu_${index}`}
                        className={`w-full flex items-center gap-4 text-[15px] cursor-pointer transition-all duration-200 ease-in-out
                            ${activeMenu == item.label
                                ? "text-white bg-primary hover:bg-primary/90"
                                : "text-gray-700 hover:bg-gray-100 hover:text-primary hover:translate-x-1"
                            } py-3 px-6 rounded-lg mb-3`}
                        onClick={() => handleClick(item.path)}
                    >
                        <item.icon className={`text-xl transition-transform duration-200 ${activeMenu !== item.label && 'group-hover:scale-110'}`} />
                        {item.label}
                    </button>
                ))}
            </div>

            <Modal 
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                title="Logout"
            
            >
                <div className="space-y-4">
                    <p className="text-gray-700 text-sm sm:text-base">Are you sure you want to logout from your account?</p>
                    <div className="flex justify-end gap-2 sm:gap-3">
                        <button
                            onClick={() => setShowLogoutModal(false)}
                            className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleLogout}
                            className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
}
