import React, { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';

export default function Input({ value, onChange, label, type, placeholder }) {
    const [showPassword, setPassword] = useState(false);

    const toggleShowPassword = () => {
        setPassword(!showPassword);
    }
    return (
        <div>
            <label className='text-[13px] text-slate-500'>{label}</label>
            <div className='input-box'>
                <input
                    type={type == 'password' ? showPassword ? 'text' : 'password' : type}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e)}
                    className='w-full bg-transparent outline-none'
                />
                {
                    type === "password" && (
                        <>
                            {showPassword ? (
                                <FaRegEye size={22} className="text-primary cursor-pointer" onClick={() => toggleShowPassword()}/>
                            ) : (
                                <FaRegEyeSlash size={22} className="text-slate-400 curson-pointer" onClick={() => toggleShowPassword()} />
                            )}
                        </>
                    )
                }
            </div>
        </div>
    )
}
