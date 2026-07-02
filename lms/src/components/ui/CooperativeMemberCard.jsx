import React from 'react';

const CooperativeMemberCard = ({ name, role, department, contributionPoints }) => {
  return (
    <div className="max-w-sm rounded-xl overflow-hidden shadow-lg bg-white border border-gray-100 p-6 flex flex-col items-center">
      {/* Avatar Placeholder */}
      <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold mb-4">
        {name ? name.charAt(0).toUpperCase() : '?'}
      </div>
      
      {/* Member Details */}
      <div className="text-center space-y-2">
        <h2 className="font-bold text-2xl text-gray-800">{name}</h2>
        <p className="text-sm text-blue-600 font-semibold">{role}</p>
        <p className="text-sm text-gray-500">{department} Dept.</p>
      </div>
      
      {/* Cooperative Metrics */}
      <div className="mt-6 w-full pt-4 border-t border-gray-100 flex justify-between items-center">
        <span className="text-xs font-bold text-gray-400 uppercase">Co-op Points</span>
        <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full">
          {contributionPoints} pts
        </span>
      </div>
    </div>
  );
};

export default CooperativeMemberCard;
