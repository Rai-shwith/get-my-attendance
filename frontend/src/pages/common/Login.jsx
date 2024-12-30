import React, { useState } from "react";
import Container from "../../components/container";
import { useForm } from "react-hook-form";
import { useLoading } from "../../contexts/LoadingContext";
import { getDepartments } from "../../helpers/getDepartments";
import { login, signup } from "../../../api/authApi";
import Button from "../../components/Button";
import { useMessage } from "../../contexts/MessageContext";
import { useNavigate } from "react-router-dom";
const Login = () => {
  // To handle the placeholder of date input
  const [dateFocus, setDateFocus] = useState(false);
  const { setLoading } = useLoading();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const {setMessage, setIsError } = useMessage();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const delay = async (delay) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, delay * 1000);
    });
  };

  

  const onsubmit = async (data) => {
    setIsSubmitting(true);
    setLoading(true);
    const result = await login(data);
    setLoading(false);
    if (result.success) {
      setIsError(false);
      setMessage(result.message);
      await delay(2);
      setMessage('');
      navigate("/"+result.role);
    } else {
      setIsError(true);
      setMessage(result.message);
    }
    setIsSubmitting(false);
  };

  const handleDateChange = (event) => {
    console.log("Date changed", event.target.value);
    event.target.value === "" ? setDateFocus(false) : setDateFocus(true);
  };

  const [teacher, setTeacher] = useState(false);

  const [role, setRole] = useState(null);
  const handleRoleChange = (event) => {
    const selectedRole = event.target.value;
    console.log("Role changed", selectedRole);
    setRole(selectedRole);
    //  Show password field only if 'Teacher' is selected
    setTeacher(selectedRole === "teacher");
  };

  return (
    <div>
      <Container>
        <form
          className="flex flex-col p-6 space-y-4 items-stretch"
          onSubmit={handleSubmit(onsubmit)}
        >
          <div className="relative">
            <div
              className={`pointer-events-none absolute top-1/2 rounded-md -translate-y-1/2 text-slate-400 ${
                errors.role ? "bg-rose-300" : "bg-white"
              } w-full ${role ? "hidden" : ""}`}
            >
              <div className="translate-x-2">Role</div>
            </div>
            <select
              {...register("role", { required: true })}
              className={`p-2 border w-full border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${
                errors.role ? "bg-rose-300" : "bg-white"
              } text-gray-700`}
              onClick={handleRoleChange}
            >
              <option value=""></option>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>
          <input
            type="email"
            placeholder="Email"
            {...register("email", { required: true })}
            className={`p-2 border ${
              errors.email ? "bg-rose-300" : "bg-white"
            } border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {teacher ? (
            <div className="flex flex-col space-y-4 items-stretch">
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  {...register("password", {
                    required: true,
                    minLength: {
                      value: 5,
                      message: "Password must be longer than 5 characters!",
                    },
                  })}
                  className={`p-2 border w-full ${
                    errors.password ? "bg-rose-300" : "bg-white"
                  } border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.password && (
                  <p className="text-rose-500">{errors.password.message}</p>
                )}
              </div>
            </div>
          ) : (
            <>
              <input
                type="text"
                placeholder="USN"
                {...register("usn", { required: true })}
                className={`p-2 border ${
                  errors.usn ? "bg-rose-300" : "bg-white"
                } border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              <div className="relative">
                <div
                  className={`pointer-events-none rounded-md absolute top-1/2 -translate-y-1/2 text-slate-400 ${
                    errors.dateOfBirth ? "bg-rose-300" : "bg-white"
                  } w-4/5 ${dateFocus ? "hidden" : ""}`}
                >
                  <div className="translate-x-2">Date Of Birth</div>
                </div>
                <input
                  type="date"
                  {...register("dateOfBirth", {
                    required: true,
                    validate: (date) => {
                      const today = new Date();
                      const dob = new Date(date);
                      if (dob > today) {
                        return "Date of birth cannot be in the future";
                      }
                    },
                  })} // Register the date input
                  onChange={handleDateChange}
                  className={`p-2 border ${
                    errors.dateOfBirth ? "bg-rose-300" : "bg-white"
                  } border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
            </>
          )}
          <Button
            type="submit"
            extraClasses="self-center"
            disabled={isSubmitting}
          >
            Login
          </Button>
        </form>
      </Container>
    </div>
  );
};
export default Login;
