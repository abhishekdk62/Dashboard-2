import React from 'react';

const Loader: React.FC = () => (
  <div className="flex flex-col items-center space-y-4 p-8">
    <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
    <p className="text-gray-600 font-medium">Loading...</p>
  </div>
);

export default Loader;
