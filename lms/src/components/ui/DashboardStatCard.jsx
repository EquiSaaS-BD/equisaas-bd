import React from 'react';

const DashboardStatCard = ({ title, value, percentageChange, isPositive }) => {
  return (
    <div className="w-full sm:w-1/2 lg:w-1/4 p-4">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col justify-between h-full">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-slate-500 text-sm font-semibold tracking-wide uppercase">
            {title}
          </h3>
          <div className="bg-indigo-50 text-indigo-600 p-2 rounded-lg">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
          </div>
        </div>

        {/* Data Section */}
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800 mb-2">
            {value}
          </h2>
          <div className="flex items-center">
            <span className={`text-sm font-bold flex items-center ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
              {isPositive ? (
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
              ) : (
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
              )}
              {percentageChange}%
            </span>
            <span className="text-slate-400 text-xs ml-2">vs last month</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStatCard;
