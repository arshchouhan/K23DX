import React from 'react';

const offerings = [
  { id: 1, name: 'Mock Interviews' },
  { id: 2, name: 'Resume Review' },
  { id: 3, name: 'Career Guidance' },
  { id: 4, name: 'Salary Negotiation' },
  { id: 5, name: 'Coding Tutoring' },
  { id: 6, name: 'Personal Branding' }
];

const TopOfferings = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center gap-2 mb-3">
        <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
        <h3 className="text-sm font-semibold text-gray-900">Top Offerings</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mb-3">
        {offerings.map((offering) => (
          <button
            key={offering.id}
            className="bg-gray-100 text-gray-800 text-xs font-medium py-2 px-3 rounded-md hover:bg-gray-200 transition-colors text-center whitespace-nowrap"
          >
            {offering.name}
          </button>
        ))}
      </div>
      
      <div className="text-center">
        <button className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors">
          View All
        </button>
      </div>
    </div>
  );
};

export default TopOfferings;