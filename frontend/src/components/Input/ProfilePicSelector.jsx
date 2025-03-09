import React, { useRef, useState } from 'react'
import { LuUser, LuUpload, LuTrash } from 'react-icons/lu';

export default function ProfilePicSelector({ image, setImage }) {
    const inputRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            //update image state
            setImage(file);

            //Generate preivew Url from the file
            const preview = URL.createObjectURL(file);
            setPreviewUrl(preview);
        }
    }

    const handleRemoveImage = (e) => {
        setImage(null);
        setPreviewUrl(null);
    }

    const onChooseFile = () => {
        inputRef.current.click();
    }
    return (
        <div className='flex justify-center mb-6'>
            <input
                type="file"
                accept='image/*'
                ref={inputRef}
                onChange={handleImageChange}
                className='hidden'
            />

            {
                !image ? (
                    <div className='w-20 h-20 flex items-center justify-center bg-purple-200 rounded-full relative'>
                        <LuUser className='text-4xl text-primary' />
                        <button
                            type='button'
                            onClick={onChooseFile}
                            className='w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full absolute -bottom-1 -right-1'>
                            <LuUpload />
                        </button>
                    </div>
                ) : (
                    <div className='relative'>
                        <img
                            src={previewUrl}
                            alt='profile photo'
                            className='w-20 h-20 rounded-full object-cover'
                        />
                        <button
                            type='button'
                            onClick={handleRemoveImage}
                            className='w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1'>
                            <LuTrash />
                        </button>
                    </div>                        
                )
            }
        </div>
    )
}
