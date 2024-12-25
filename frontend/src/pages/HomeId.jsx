import React from 'react'
import { useParams } from 'react-router-dom'

const HomeId = () => {
    const {id} = useParams();
  return (
    <div>{id}</div>
  )
}

export default HomeId