import React from 'react'

export default function DeleteAlert({content, onDelete}) {
    return (
        <div>
            <p className='text-sm'>{content}</p>
            <div className="felx justify-end mt-6">
                <button className="add-btn add-btn-fill" type='button' onClick={onDelete}>Delete</button>
            </div>
        </div>
    )
}
