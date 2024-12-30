import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OptionBoxes from '../../components/OptionBoxes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faClipboardCheck, faHistory, faUsers, faEdit } from '@fortawesome/free-solid-svg-icons';
import { getUser } from '../../helpers/localStorageHandlers';

const HostHome = () => {
  const navigate = useNavigate()
  useEffect(() => {
    const user = getUser();
    if (user?.role != "host"){
      navigate("/");
    }
  }, [])
  return (
    <div className='flex flex-col items-center justify-center min-h-screen'>
      <div className='flex flex-col space-y-4 justify-center items-center w-screen md:w-4/6 mx-auto px-8 py-8'>
        <OptionBoxes 
          title="Start Registration"
          description="Starts a 5 minute timer for students to register, needed only once."
          icon={<FontAwesomeIcon icon={faUserPlus} />}
        />
        <OptionBoxes 
          toggleColor={true}
          title="Take Attendance"
          description="Starts a 5 minute timer for students to respond to attendance."
          icon={<FontAwesomeIcon icon={faClipboardCheck} />}
        />
        <OptionBoxes 
          toggleColor={true}
          title="Attendance History"
          description="Check the attendance history according to the date."
          icon={<FontAwesomeIcon icon={faHistory} />}
        />
        <OptionBoxes 
          toggleColor={true}
          title="Enrolled Students"
          description="Check out the registered students."
          icon={<FontAwesomeIcon icon={faUsers} />}
        />
        <OptionBoxes 
          title="Edit Registration"
          description="Edit the registration details."
          icon={<FontAwesomeIcon icon={faEdit} />}
        />
      </div>
    </div>
  );
}

export default HostHome;