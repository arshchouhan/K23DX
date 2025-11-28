import React from 'react';
import { FiCheckCircle } from 'react-icons/fi';

const experts = [
  {
    id: 1,
    name: 'Nishant Tiwari',
    company: 'Google',
    image: 'https://randomuser.me/api/portraits/men/1.jpg',
    verified: true
  },
  {
    id: 2,
    name: 'Susmita Sen Ribhu',
    company: 'Microsoft',
    image: 'https://randomuser.me/api/portraits/women/1.jpg',
    verified: true
  },
  {
    id: 3,
    name: 'Bhavesh Arora',
    company: 'Amazon',
    image: 'https://randomuser.me/api/portraits/men/2.jpg',
    verified: false
  },
  {
    id: 4,
    name: 'ANKUR KESHARWANI',
    company: 'Facebook',
    image: 'https://randomuser.me/api/portraits/men/3.jpg',
    verified: true
  }
];

const TopExperts = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-[350px]">
      <div className="p-2 border-b border-gray-200 flex-shrink-0">
        <h3 className="text-md font-semibold text-gray-900">Top Experts</h3>
      </div>
      <div className="divide-y divide-gray-200 overflow-y-auto flex-1 scrollbar-hide">
        {experts.map((expert) => (
          <div key={expert.id} className="p-3 hover:bg-gray-50 cursor-pointer transition-colors">
            <div className="flex items-center">
              <div className="relative">
                <img
                  className="h-10 w-10 rounded-full object-cover"
                  src={expert.image}
                  alt={expert.name}
                />
                {expert.verified && (
                  <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full p-0.5">
                    <FiCheckCircle className="h-3 w-3" />
                  </div>
                )}
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-900">{expert.name}</span>
                  {expert.verified && (
                    <FiCheckCircle className="ml-1 h-4 w-4 text-blue-500" />
                  )}
                </div>
                <p className="text-xs text-gray-500">{expert.company}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-2 border-t border-gray-200 text-center">
        <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
          View All
        </button>
      </div>
    </div>
  );
};

export default TopExperts;
