import React from 'react'

const OptionBoxes = ({title,description,image}) => {
  return (
    <div className='flex justify-between'>
        <div className="flex flex-col">
            <h3 className="text-3xl text-left">{title}</h3>
            <p className='text-sm text-left text-wrap'>{description}</p>
        </div>
        <div className="">
            <img src={image} />
        </div>
    </div>
  )
}

export default OptionBoxes