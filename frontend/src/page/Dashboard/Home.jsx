// import React, { useEffect, useState } from 'react';
import DahboardLayout from '../../components/layout/DahboardLayout';
import { useUserAuth } from '../../hooks/useUserAuth';
// import axiosInstance from '../../utils/axiosInstance';

export default function Home() {
  // const [uploadedImages, setUploadedImages] = useState([]);
  useUserAuth();

  // useEffect(() => {
  //   const fetchDashboardData = async () => {
  //     try {
  //       const response = await axiosInstance.get('/api/v1/dashboard');
  //       setUploadedImages(response.data.uploadedImages);
  //     } catch (error) {
  //       console.error('Error fetching dashboard data:', error);
  //     }
  //   };

  //   fetchDashboardData();
  // }, []);

  return (
    <DahboardLayout activeMenu='Dashboard'>
      <div className='my-5 mx-auto'>
        {/* {uploadedImages.map((image) => (
          <img key={image._id} src={image.imageUrl} alt="Uploaded" />
        ))} */}
        Home
      </div>
    </DahboardLayout>
  );
}
