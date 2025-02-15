import { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import OnboardingForm from '../Components/OnboardingForm';
import { LogOut, Home, Battery, ChevronDown, ChevronRight, User } from 'lucide-react';

export default function AdminLayout({ children }) {
    const { auth } = usePage().props;
    const [isRechargeOpen, setIsRechargeOpen] = useState(false);
    const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
    const [showUserInfo, setShowUserInfo] = useState(false);

    const handleLogout = () => {
        router.post(route('logout'));
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-gray-800 text-white">
                {/* Logo/Header */}
                <div className="p-4">
                    <h1 className="text-xl font-bold">Admin Panel</h1>
                </div>

                {/* Navigation */}
                <nav className="mt-4">
                    <ul>
                        {/* Dashboard */}
                        <li className="mb-2">
                            <Link
                                href="/admin/dashboard"
                                className="flex items-center px-4 py-2 hover:bg-gray-700"
                            >
                                <Home className="w-5 h-5 mr-2" />
                                Dashboard
                            </Link>
                        </li>

                        {/* Recharge Section with Dropdown */}
                        <li className="mb-2">
                            <button
                                onClick={() => setIsRechargeOpen(!isRechargeOpen)}
                                className="flex items-center w-full px-4 py-2 hover:bg-gray-700"
                            >
                                <Battery className="w-5 h-5 mr-2" />
                                <span>Recharge</span>
                                <span className="ml-auto">
                                    {isRechargeOpen ? 
                                        <ChevronDown className="w-4 h-4" /> : 
                                        <ChevronRight className="w-4 h-4" />
                                    }
                                </span>
                            </button>

                            {/* Dropdown Content */}
                            {isRechargeOpen && (
                                <ul className="pl-8 mt-2">
                                    <li className="mb-2">
                                        <Link
                                            href="/admin/recharge/dorecharge"
                                            className="block px-4 py-2 hover:bg-gray-700"
                                        >
                                           Do Recharge
                                        </Link>
                                    </li>
                                    <li className="mb-2">
                                        <Link
                                            href="/admin/recharge/recharge2"
                                            className="block px-4 py-2 hover:bg-gray-700"
                                        >
                                            Status Enquiry
                                        </Link>
                                    </li>
                                    <li className="mb-2">
                                        <Link
                                            href="/admin/recharge/manage-operator"
                                            className="block px-4 py-2 hover:bg-gray-700"
                                        >
                                            Manage Operator 
                                        </Link>
                                    </li>
                                </ul>
                            )}
                        </li>
                    </ul>
                </nav>
            </div>

            <div className="flex-1">
                {/* Top Bar */}
                <div className="bg-white shadow-md p-4">
                    <div className="flex justify-between items-center">
                        <div 
                            className="cursor-pointer flex-1"
                            onClick={() => setIsOnboardingOpen(true)}
                        >
                            <marquee className="text-red-500 font-bold text-lg" scrollamount="5">
                                Onboarding: Please complete your profile and set up your preferences!
                            </marquee>
                        </div>
                        
                        {/* User Info and Logout Button */}
                        <div className="relative">
                            <button
                                onClick={handleLogout}
                                onMouseEnter={() => setShowUserInfo(true)}
                                onMouseLeave={() => setShowUserInfo(false)}
                                className="flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors duration-150 ease-in-out ml-4"
                            >
                                <User className="w-5 h-5 mr-2" />
                                <LogOut className="w-5 h-5 mr-2" />
                                Logout
                            </button>

                            {/* User Info Popup */}
                            {showUserInfo && auth.user && (
                                <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-2 px-3 z-50 border border-gray-200">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <div className="bg-indigo-100 rounded-full p-2">
                                            <User className="w-5 h-5 text-indigo-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">
                                                {auth.user.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {auth.user.email}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>


                <OnboardingForm 
                    isOpen={isOnboardingOpen}
                    onClose={() => setIsOnboardingOpen(false)}
                />

                {/* Content Area */}
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
}