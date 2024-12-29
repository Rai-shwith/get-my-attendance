import React from 'react';

const OptionBoxes = ({ title, description, icon, toggleColor = false }) => {
  return (
    <div className={'flex justify-between p-5 w-full rounded-lg cursor-pointer' + (toggleColor ? ' bg-green-500' : ' bg-purple-500')}>
      <div className="flex flex-col text-white space-y-3 pr-4 w-full">
        <h3 className="text-lg md:text-2xl font-bold text-left text-wrap leading-5">{title}</h3>
        <p className='text-xs md:text-sm text-left text-wrap'>{description}</p>
      </div>
      <div className="w-16 flex items-center text-white justify-center text-3xl"> {/* Adjust the size here */}
        {icon}
      </div>
    </div>
  );
}

export default OptionBoxes;