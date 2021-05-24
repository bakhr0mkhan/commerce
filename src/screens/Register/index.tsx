import React from "react";
import firebase from "firebase/app";
import { useForm } from "react-hook-form";
//@ts-ignore
import { useHistory } from "react-router-dom";
import Lottie from "react-lottie";

import registration0 from "../../assets/animations/registration0.json";
import registration1 from "../../assets/animations/registration1.json";
import GoogleIcon from "../../assets/icons/google.png";

interface Props {}

const Register = (props: Props) => {
  const auth = firebase.auth();
  const history = useHistory();

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
    // formState: { errors },
  } = useForm();
  //   const onSubmit = (data: any) => console.log(data);
  const onSubmit = (data: any) =>
    createUserWithEmail(data.email, data.password);

  return (
    <div className="loginMainCon">
      <div className="loginSubCon">
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
            height={200}
            width={200}
            isStopped={false}
            isPaused={false}
          />
        </div>
        <div className="loginFormCon">
          <form onSubmit={handleSubmit(onSubmit)} className="form">
            <h3 className="welcomeMsg">
              Welcome to
              <h2 className="brandNameMsg"> Kamazon</h2>
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
              value="Create an account"
            />
            <button className="btns" onClick={() => signInWithGoogle()}>
              <img src={GoogleIcon} className="icon" alt="google" />
              Continue with Google{" "}
            </button>
            <button
              className="btns"
              id="register"
              onClick={() => history.push("/login")}
            >
              Sign in
            </button>
          </form>

          {/* end of login form con */}
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
            height={150}
            width={150}
            isStopped={false}
            isPaused={false}
          />
        </div>
        {/*  */}
      </div>
    </div>
  );
};

export default Register;
