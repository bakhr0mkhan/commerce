import React, { useState } from "react";
import firebase from "firebase/app";
import Lottie from "react-lottie";

//@ts-ignore
import { Link, useHistory } from "react-router-dom";

import { useForm } from "react-hook-form";
import "./styles.css";

import GoogleIcon from "../../assets/icons/google.png";
import loginScreen from "../../assets/animations/loginScreen.json";
import manLogin from "../../assets/animations/manLogin.json";
import loginLoading from "../../assets/animations/loginLoading.json";

import useWindowDimensions from "../../hooks/useWindowDimensions";

interface Props {}

const Login = (props: Props) => {
  const auth = firebase.auth();
  const history = useHistory();
  const { width, height } = useWindowDimensions();
  const [loading, setLoading] = useState(false);

  const signInWithEmail = async (email: string, password: string) => {
    setLoading(true);
    try {
      await auth
        .signInWithEmailAndPassword(email, password)
        .then((userSigned) => console.log("successfull sign in ", userSigned))
        .catch((err) => console.log("could not sign in", err));
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    const providerGoogle = new firebase.auth.GoogleAuthProvider();
    setLoading(true);
    try {
      auth
        .signInWithPopup(providerGoogle)
        .then((res) => {
          history.push("/");
          console.log("sucess, ", res);
        })
        .catch((err) => {
          history.push("/register");
          console.log("error", err);
        });
    } catch (err) {
      history.push("/login");
    } finally {
      setLoading(false);
    }
  };

  const {
    register,
    handleSubmit,
    // formState: { errors },
  } = useForm();
  //   const onSubmit = (data: any) => console.log(data);
  const onSubmit = (data: any) => signInWithEmail(data.email, data.passowrd);
  if (loading) {
    return (
      <Lottie
        options={{
          loop: true,
          autoplay: true,
          animationData: loginLoading,
          rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
          },
        }}
        height={400}
        width={400}
        isStopped={false}
        isPaused={false}
      />
    );
  }

  return (
    <div className="loginMainCon">
      <div className="loginSubCon">
        <div className="sidebar left">
          <Lottie
            options={{
              loop: true,
              autoplay: true,
              animationData: loginScreen,
              rendererSettings: {
                preserveAspectRatio: "xMidYMid slice",
              },
            }}
            height={width < 500 ? 200 : 400}
            width={width < 500 ? 200 : 400}
            isStopped={false}
            isPaused={false}
          />
        </div>
        <div className="loginFormCon">
          <form onSubmit={handleSubmit(onSubmit)} className="form">
            <h3 className="welcomeMsg">
              Welcome to
              <Link to="/" className="link">
                <h2 className="brandNameMsg"> Kamazon</h2>
              </Link>
            </h3>
            <input
              {...register("email", { required: true })}
              className="emailInput input"
              placeholder="Email"
            />{" "}
            {/* register an input */}
            <input
              {...register("password", { required: true })}
              type="password"
              className="passwordInput input"
              placeholder="Password"
            />
            <input
              type="submit"
              className="submitBtn "
              value="Sign in"
              style={{
                backgroundColor: loading ? "white" : "#3b5998",
                color: loading ? "black" : "white",
              }}
            />
            {/* <button className="btns" onClick={() => signInWithGoogle()}>
              <img src={GoogleIcon} className="icon" alt="google" />
              Continue with Google{" "}
            </button> */}
            <button
              className="btns"
              id="register"
              onClick={() => history.push("/register")}
            >
              Create account
            </button>
          </form>

          {/* end of login form con */}
        </div>
        <div className="sidebar right">
          <Lottie
            options={{
              loop: true,
              autoplay: true,
              animationData: manLogin,
              rendererSettings: {
                preserveAspectRatio: "xMidYMid slice",
              },
            }}
            height={width < 500 ? 200 : 400}
            width={width < 500 ? 200 : 400}
            isStopped={false}
            isPaused={false}
          />
        </div>
        {/*  */}
      </div>
    </div>
  );
};

export default Login;
