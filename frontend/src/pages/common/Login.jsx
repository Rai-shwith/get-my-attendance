import React, { useState } from "react";
import Container from "../../components/container";
import { useForm } from "react-hook-form";
import { useLoading } from "../../contexts/LoadingContext";
import { useErrorMessage } from "../../contexts/ErrorMessageContext";
import { getDepartments } from "../../helpers/getDepartments";
import { toTitleCase } from "../../helpers/toTitleCase";
import Button from "../../components/Button";
const Login = () => {
  // To handle the placeholder of date input
  const [dateFocus, setDateFocus] = useState(false);
  const { setLoading } = useLoading();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const { setErrorMessage } = useErrorMessage();

  const delay = async (delay) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, delay * 1000);
    });
  };

  const onsubmit = async (data) => {
    setLoading(true);
    await delay(2);
    console.log(data);
    setLoading(false);
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
              className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-slate-400 bg-white w-full ${
                role ? "hidden" : ""
              }`}
            >
              <div className="translate-x-2">Role</div>
            </div>
            <select
              className="p-2 border w-full border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 bg-white text-gray-700"
              onClick={handleRoleChange}
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>
          {teacher ? (
            <div className="flex flex-col space-y-4 items-stretch">
              <input
            type="email"
            placeholder="Email"
            {...register("email", { required: true })}
            className="p-2 border bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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
                  className="p-2 border w-full bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="p-2 border bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="relative">
                <div
                  className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-slate-400 bg-white w-4/5 ${
                    dateFocus ? "hidden" : ""
                  }`}
                >
                  <div className="translate-x-2">Date Of Birth</div>
                </div>
                <input
                  type="date"
                  {...register("dateOfBirth", { required: true })} // Register the date input
                  onChange={handleDateChange}
                  className="p-2 border bg-white border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}
          <Button
            type="submit"
            extraClasses="self-center"
          >
            Login
          </Button>
        </form>
      </Container>
    </div>
  );
};

export default Login;
