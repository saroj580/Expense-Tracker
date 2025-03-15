import React from 'react'
import DahboardLayout from '../../components/layout/DahboardLayout'
import { useUserAuth } from '../../hooks/useUserAuth'

export default function Home() {
  useUserAuth();
  
  return (
    <DahboardLayout activeMenu='Dashboard'>
      <div className='my-5 mx-auto'></div>
    </DahboardLayout>
  )
}
