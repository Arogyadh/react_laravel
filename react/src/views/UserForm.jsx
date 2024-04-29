import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import React from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../axios-client";
import axios from "axios";
import { useStateContext } from "../contexts/ContextProvider";

export default function UserForm() {
    const [errors, setErrors] = useState(null);
    const { setNotification } = useStateContext();
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({
        id: null,
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });
    if (id) {
        useEffect(() => {
            setLoading(true);
            axiosClient
                .get(`/users/${id}`)
                .then(({ data }) => {
                    setLoading(false);
                    console.log(data.data);
                    setUser(data.data);
                })
                .catch(() => {
                    setLoading(false);
                });
        }, []);
    }
    const onSubmit = (ev) => {
        ev.preventDefault();
        if (user.id) {
            axiosClient
                .put(`/users/${user.id}`, user)
                .then(() => {
                    setNotification("User updated successfully");
                    navigate("/users");
                })
                .catch((err) => {
                    const response = err.response;
                    if (response && response.status === 422) {
                        setErrors(response.data.errors);
                    }
                });
        } else {
            axiosClient
                .post("/users", user)
                .then(() => {
                    setNotification("User created successfully");
                    navigate("/users");
                })
                .catch((err) => {
                    const response = err.response;
                    if (response && response.status === 422) {
                        setErrors(response.data.errors);
                    }
                });
        }
    };
    return (
        <>
            {user.id && <h1>Update user: {user.name}</h1>}
            {!user.id && <h1>Add new user</h1>}
            <div className="card animated fadeInDown">
                {loading && <div className="text-center">Loading...</div>}
                {errors && (
                    <div className="alert">
                        {Object.keys(errors).map((key) => (
                            <p key={key}>{errors[key][0]}</p>
                        ))}
                    </div>
                )}
                {!loading && (
                    <form onSubmit={onSubmit}>
                        <input
                            value={user.name}
                            onChange={(ev) =>
                                setUser({ ...user, name: ev.target.value })
                            }
                            placeholder="Name"
                        />
                        <input
                            value={user.email}
                            onChange={(ev) =>
                                setUser({ ...user, email: ev.target.value })
                            }
                            placeholder="Email"
                        />
                        <input
                            onChange={(ev) =>
                                setUser({ ...user, password: ev.target.value })
                            }
                            placeholder="Password"
                            type="password"
                        />
                        <input
                            onChange={(ev) =>
                                setUser({
                                    ...user,
                                    password_confirmation: ev.target.value,
                                })
                            }
                            placeholder="Password Confimation"
                            type="password"
                        />
                        <button className="btn">Save</button>
                    </form>
                )}
            </div>
        </>
    );
}
