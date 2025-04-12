import React from 'react';
import Navbar from '@/components/Navbar/Navbar';

function Analysis() {
  return (
    <>
        <Navbar />
        <div className="flex flex-col gap-3 justify-center items-center">
        <h1 className="text-4xl font-bold">Analysis Page</h1>
        <p className="text-lg">This is the analysis page.</p>
        </div>
    </>
  );
}

export default Analysis;