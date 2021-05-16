import React, { useState } from "react";
import firebase from "firebase/app";
import { useForm } from "react-hook-form";
//@ts-ignore
import { Redirect, useHistory } from "react-router-dom";
import Lottie from "react-lottie";

import FBIcon from "../../assets/icons/fb.png";
import GoogleIcon from "../../assets/icons/google.png";
import loginLoading from "../../assets/animations/loginLoading.json";
import registration0 from "../../assets/animations/registration0.json";
import registration1 from "../../assets/animations/registration1.json";

interface Props {}

const Register = (props: Props) => {
  const auth = firebase.auth();
  const history = useHistory();

  const [loading, setLoading] = useState(false);

  const createUserWithEmail = async (email: string, password: any) => {
    await auth
      .createUserWithEmailAndPassword(email, password)
      .then((res) => {
        // Signed up
        history.push("/");
        console.log("newly created user", res.user);
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  //   const onSubmit = (data: any) => console.log(data);
  const onSubmit = (data: any) =>
    createUserWithEmail(data.email, data.password);
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
            animationData: registration0,
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
          <input
            type="submit"
            className="submitBtn "
            value="Sign up"
            disabled={loading}
          />
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
              onClick={() => history.push("/login")}
            >
              Back to login
            </button>
          </div>
        </div>
      </div>
      <div className="sidebar right">
        <Lottie
          options={{
            loop: true,
            autoplay: true,
            animationData: registration1,
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

export default Register;
