import React from 'react'
import OptionBoxes from '../../components/OptionBoxes'
import register from '../../assets/homeOptions/register.png'
// import attendanceHistory from '../../assets/homeOptions/attendanceHistory.png'
// import takeAttendance from '../../assets/homeOptions/takeAttendance.png'
// import enrolledStudent from '../../assets/homeOptions/enrolledStudent.png'
// import editRegistration from '../../assets/homeOptions/editRegistration.png'
const HostHome = () => {
  return (
    <div>
      <OptionBoxes 
        title="cat"
        description="lorem epsom"
        image={register}
      />
    </div>
  )
}

export default HostHome