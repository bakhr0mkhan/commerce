import React from "react";
import Lottie from "react-lottie";
import success from "../../assets/animations/success.json";
// @ts-ignore
import { useHistory } from "react-router-dom";
import "./styles.css";
interface Props {}

const OrderConfirmation = (props: Props) => {
  const history = useHistory();
  return (
    <div className="orederConfirmationMainCon">
      <div className="orderAnimCon">
        <Lottie
          options={{
            loop: true,
            autoplay: true,
            animationData: success,
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
      <div className="orderSubTextCon">
        <h2 className="orderSubText">Order has been confirmed</h2>
        <button
          className="backToDashboardBtn"
          onClick={() => history.push("/")}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmation;
