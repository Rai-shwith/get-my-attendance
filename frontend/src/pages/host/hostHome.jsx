import React from 'react'
import OptionBoxes from '../../components/OptionBoxes'
import register from '../../assets/homeOptions/register.png'
// import attendanceHistory from '../../assets/homeOptions/attendanceHistory.png'
// import takeAttendance from '../../assets/homeOptions/takeAttendance.png'
// import enrolledStudent from '../../assets/homeOptions/enrolledStudent.png'
// import editRegistration from '../../assets/homeOptions/editRegistration.png'
const HostHome = () => {
  return (
    <div className='flex flex-col space-y-4 justify-center items-center w-screen px-8 py-32'>
      <OptionBoxes 
        title="Start Registration"
        description="starts a 5 minute timer for students to register,needed only once."
        image={register}
      />
      <OptionBoxes 
      toggleColor={true}
      title="Take Attendance"
        description="Starts a 5 minute timer for students to response to attendance"
        image={register}
      />
      <OptionBoxes 
      toggleColor={true}
        title="Attendance History"
        description="Check the attendance history according to the date"
        image={register}
      />
      <OptionBoxes 
      toggleColor={true}
      title="Enrolled Students"
        description="Check out the registered students."
        image={register}
      />
      <OptionBoxes 
        title="Edit Registration"
        description="Edit the registration details."
        image={register}
      />
    </div>
  )
}

export default HostHome