import ServiceWorkerRegistration from '../components/service-worker-registration';
import React, { FC } from 'react';
import HomeComponent from '../components/home';

const HomePage: FC<any> = () => {
  return (
    <>
      <ServiceWorkerRegistration />
      <HomeComponent />
    </>
  );
};

export default HomePage;
