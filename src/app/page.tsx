import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration';
import React, { FC } from 'react';
import HomeComponent from '@/components/Home';

const HomePage: FC<any> = () => {
  return (
    <>
      <ServiceWorkerRegistration />
      <HomeComponent />
    </>
  );
};

export default HomePage;
