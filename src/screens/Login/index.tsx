import React, { useState } from "react";
import firebase from "firebase/app";
import Lottie from "react-lottie";

//@ts-ignore
import { Link, useHistory } from "react-router-dom";

import { useForm } from "react-hook-form";
import "./styles.css";

import FBIcon from "../../assets/icons/fb.png";
import GoogleIcon from "../../assets/icons/google.png";
import loginScreen from "../../assets/animations/loginScreen.json";
import manLogin from "../../assets/animations/manLogin.json";
import loginLoading from "../../assets/animations/loginLoading.json";

interface Props {}

const Login = (props: Props) => {
  const auth = firebase.auth();
  const history = useHistory();
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
  };
  const signInWithFacebook = async () => {
    const providerFb = new firebase.auth.FacebookAuthProvider();
    await auth
      .signInWithPopup(providerFb)
      .then((res) => {
        history.push("/");
        console.log("s singin fb", res);
      })
      .catch((err) => {
        history.push("/register");
        console.log("error ", err);
      });
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
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
    <div className="mainConLogin">
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
          height={400}
          width={400}
          isStopped={false}
          isPaused={false}
        />
      </div>
      <div className="formCon">
        <div className="msgCon">
          <h1 className="typography welcomeMsg">Welcome back to Kamazon</h1>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="form">
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
          <input type="submit" className="submitBtn " value="Sign in" />
        </form>

        <div className="footerdiv">
          <div className="google row">
            <button className="btns" onClick={() => signInWithGoogle()}>
              <img src={GoogleIcon} className="icon" />
              Sign in with google{" "}
            </button>
          </div>
          <div className="fb row">
            <button className="btns" onClick={() => signInWithFacebook()}>
              <img src={FBIcon} className="icon" />
              Sign in with Facebook{" "}
            </button>
          </div>
          <div className=" row">
            <button
              className="btns account"
              onClick={() => history.push("/register")}
            >
              Create an account
            </button>
          </div>
        </div>
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
          height={400}
          width={400}
          isStopped={false}
          isPaused={false}
        />
      </div>
    </div>
  );
};

export default Login;