import React from 'react'

const OptionBoxes = ({title,description,image,toggleColor=false}) => {
  return (
    <div className={'flex justify-between p-5 w-full rounded-lg' + (toggleColor?' bg-green-500':' bg-purple-500')}>
        <div className="flex flex-col text-white space-y-3 pr-4 w-full">
            <h3 className="text-lg font-bold text-left text-wrap leading-5">{title}</h3>
            <p className='text-xs text-left text-wrap'>{description}</p>
        </div>
        <div className="w-16">
            <img src={image} />
        </div>
    </div>
  )
}

export default OptionBoxes