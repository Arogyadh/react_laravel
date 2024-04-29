import { Link } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";
import { useRef, useState } from "react";

export default function Login() {
    const [errors, setErrors] = useState(null);
    const emailRef = useRef();
    const passwordRef = useRef();
    const { setUser, setToken } = useStateContext();
    const onSubmit = (e) => {
        e.preventDefault();
        const payload = {
            email: emailRef.current.value,
            password: passwordRef.current.value,
        };
        setErrors(null);
        axiosClient
            .post("/login", payload)
            .then(({ data }) => {
                setToken(data.token);
                setUser(data.user);
            })
            .catch((err) => {
                const response = err.response;

                if (response && response.status === 422) {
                    if (response.data.errors) {
                        setErrors(response.data.errors);
                    } else {
                        setErrors({
                            email: [response.data.message],
                        });
                    }
                }
            });
    };
    return (
        <div className="login-signup-form animated fadeInDown">
            <div className="form">
                <form onSubmit={onSubmit} action="">
                    <h1 className="title">Login into your account</h1>
                    {errors && (
                        <div className="alert">
                            {Object.keys(errors).map((key) => (
                                <p key={key}>{errors[key][0]}</p>
                            ))}
                        </div>
                    )}
                    <input ref={emailRef} type="email" placeholder="email" />
                    <input
                        ref={passwordRef}
                        type="password"
                        placeholder="password"
                    />
                    <button className="btn btn-block" type="submit">
                        Log In
                    </button>
                    <p className="message">
                        Not Registered?{" "}
                        <Link to="/signup">Create an account</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
