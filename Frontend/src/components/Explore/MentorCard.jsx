import React from 'react';
import { FiStar, FiClock, FiMessageSquare } from 'react-icons/fi';

const MentorCard = ({ mentor }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <div className="flex items-start">
          {/* Mentor Image */}
          <div className="relative mr-4">
            <img
              className="h-20 w-20 rounded-full object-cover"
              src={mentor.image}
              alt={mentor.name}
            />
            {mentor.isOnline && (
              <div className="absolute bottom-0 right-0 h-4 w-4 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>

          {/* Mentor Info */}
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{mentor.name}</h3>
                <p className="text-sm text-gray-600">{mentor.title}</p>
                <p className="text-sm text-gray-500">{mentor.companies}</p>
                <p className="text-xs text-gray-400 mt-1">{mentor.experience}</p>
              </div>
              <div className="flex items-center bg-blue-50 text-blue-700 text-sm font-medium px-2 py-1 rounded">
                <FiStar className="text-yellow-400 mr-1" />
                {mentor.rating} ({mentor.ratedCount})
              </div>
            </div>

            <p className="mt-2 text-sm text-gray-600 line-clamp-2">{mentor.bio}</p>

            <div className="mt-3 flex flex-wrap gap-2">
              {mentor.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-4 flex justify-between items-center">
              <div className="flex items-center text-sm text-gray-500">
                <FiClock className="mr-1" />
                <span>15 min</span>
                <FiMessageSquare className="ml-3 mr-1" />
                <span>Video Call</span>
              </div>
              <div className="text-lg font-bold text-blue-600">
                ${mentor.price}<span className="text-sm font-normal text-gray-500">/{mentor.priceUnit}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorCard;
