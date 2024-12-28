import React, { useState } from "react";
import Container from "../../components/container";
import { useForm } from "react-hook-form";
import { useLoading } from "../../contexts/LoadingContext";
import { useErrorMessage } from "../../contexts/ErrorMessageContext";

const Signup = () => {
  // To handle the placeholder of date input
  const [dateFocus, setDateFocus] = useState(false);
  const { setLoading } = useLoading();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();


  const {setErrorMessage} = useErrorMessage();

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

  const [showPassword, setShowPassword] = useState(false);

  const [role, setRole] = useState(null);
  const handleRoleChange = (event) => {
    const selectedRole = event.target.value;
    console.log("Role changed", selectedRole);
    setRole(selectedRole);
    //  Show password field only if 'Teacher' is selected
    setShowPassword(selectedRole === "teacher");
  };

  // Watch the password field
  const password = watch("password", "");

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
              <div className="translate-x-2">Sign Up as</div>
            </div>
            <select
              className="p-3 border w-full border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 bg-white text-gray-700"
              onClick={handleRoleChange}
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>

          <input
            type="text"
            placeholder="Name"
            {...register("name", { required: true })}
            className="p-2 border bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            placeholder="Email"
            {...register("email", { required: true })}
            className="p-2 border bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {showPassword ? (
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
                className="p-2 border w-full bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.password && (
                <p className="text-rose-500">{errors.password.message}</p>
              )}
              </div>
              <div>
        <input
          type="password"
          placeholder="Confirm Password"
          className="p-2 border w-full bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...register('confirmPassword', {
            required: 'Confirm Password is required',
            validate: (value) =>
              value === password || 'Passwords do not match',
          })}
        />
        {errors.confirmPassword && <p className="text-rose-500">{errors.confirmPassword.message}</p>}
      </div>
            </div>
          ) : (
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
          )}
          <button
            type="submit"
            className="p-2 bg-blue-500  text-white rounded-md hover:bg-blue-600 transition duration-200"
          >
            Signup
          </button>
        </form>
      </Container>
    </div>
  );
};

export default Signup;
