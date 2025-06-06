import Footer from "components/common/footer";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { TradeSteps } from "components/P2P/Trade/AddPostStep";
import { SupportChat } from "components/Support/support-chat";
import {
  getP2pOrderDetailsAction,
  paymentP2pOrderAction,
  releaseP2pOrderAction,
  submitTradeFeedback,
} from "state/actions/p2p";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { formateData } from "common";
import useTranslation from "next-translate/useTranslation";
import {
  BUY,
  NEGATIVE,
  POSITIVE,
  SELL,
  TRADE_STATUS_CANCELED,
  TRADE_STATUS_CANCELED_TIME_EXPIRED,
  TRADE_STATUS_ESCROW,
  TRADE_STATUS_PAYMENT_DONE,
  TRADE_STATUS_REFUNDED_BY_ADMIN,
  TRADE_STATUS_RELEASED_BY_ADMIN,
  TRADE_STATUS_TRANSFER_DONE,
} from "helpers/core-constants";
import Timer from "components/P2P/P2pHome/Timer";
import SectionLoading from "components/common/SectionLoading";
import TradeCancel from "components/P2P/P2pHome/TradeCancel";
import TradeDispute from "components/P2P/P2pHome/TradeDispute";
import { TradeChat } from "components/P2P/Trade/trade-chat";
import { sendMessageTrade } from "service/p2p";
import { useDispatch, useSelector } from "react-redux";
import { setP2pDetailsOrder, setTradeChat } from "state/reducer/user";
import { RootState } from "state/store";
import { GetServerSideProps } from "next";
import { SSRAuthCheck } from "middlewares/ssr-authentication-check";
import BackButton from "../../../components/P2P/BackButton";
import { NoItemFound } from "components/NoItemFound/NoItemFound";
import { P2pTopBar } from "components/P2P/P2pHome/TopBar";
import { toast } from "react-toastify";

let socketCall = 0;

const Trading = () => {
  const { t } = useTranslation("common");
  const inputRef = useRef(null);
  const { p2pDetails: details } = useSelector((state: RootState) => state.user);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [doc, setDoc] = useState(null);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<any>();
  const [feedbackType, setfeedbackType] = useState<any>(POSITIVE);
  const [step, setStep] = useState(0);
  const dispatch = useDispatch();
  const router = useRouter();
  const { uid }: any = router.query;
  const sendMessage = async (e: any) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("order_uid", uid);
    formData.append("message", message);
    file && formData.append("file", file);
    setMessage("");
    setFile(null);
    await sendMessageTrade(formData);
  };
  async function listenMessages() {
    //@ts-ignore
    window.Pusher = Pusher;
    //@ts-ignore
    window.Echo = new Echo({
      broadcaster: "pusher",
      key: "test",
      wsHost: process.env.NEXT_PUBLIC_HOST_SOCKET,
      wsPort: process.env.NEXT_PUBLIC_WSS_PORT
        ? process.env.NEXT_PUBLIC_WSS_PORT
        : 6006,
      wssPort: 443,
      forceTLS: false,
      cluster: "mt1",
      disableStats: true,
      enabledTransports: ["ws", "wss"],
    });
    //@ts-ignore
    window.Echo.channel(
      `Order-Status-${localStorage.getItem("user_id")}${uid}`
    ).listen(".OrderStatus", (e: any) => {
      dispatch(setP2pDetailsOrder(e.order));
    });
    //@ts-ignore
    window.Echo.channel(
      `New-Message-${localStorage.getItem("user_id")}-${uid}`
    ).listen(".Conversation", (e: any) => {
      dispatch(setTradeChat(e.data));
    });
    // channel: New - Message - { user_id } - { order_uid };
    // event: Conversation;
  }
  useEffect(() => {
    if (socketCall === 0 && uid) {
      listenMessages();
    }
    socketCall = 1;
  }, [socketCall, uid]);
  useEffect(() => {
    uid && getDetails();
  }, [uid]);
  const getDetails = () => {
    getP2pOrderDetailsAction(uid.toString(), setStep, setLoading, dispatch);
  };
  const handleFileChange = (event: any) => {
    const fileObj = event.target.files && event.target.files[0];
    if (!fileObj) {
      return;
    }
    if (fileObj.size > 2 * 1024 * 1024) {
      toast.error(t("File size must be less than 2MB"));
      return;
    }
    event;
    setDoc(event.target.files[0]);
  };
  const handleClick = () => {
    // 👇️ open file input box on click of other element
    //@ts-ignore
    inputRef.current.click();
  };
  if (loading) {
    return (
      <div className="container w-100 h-100">
        <SectionLoading />
      </div>
    );
  }
  // if (details === null) {
  //   return (
  //     <div className="container w-100 h-100">
  //       <NoItemFound />
  //     </div>
  //   );
  // }
  return (
    <>
      <P2pTopBar />
      <div className="adPost_bg py-3">
        <div className="container-4xl">
          <div className="row">
            <div className="col-12">
              {details?.user_type === BUY && (
                <h3>
                  {"Buy"} {details?.order?.coin_type} from{" "}
                  {details?.user_seller?.nickname}
                </h3>
              )}

              {details?.user_type === SELL && (
                <h3>
                  {"Sell"} {details?.order?.coin_type} to{" "}
                  {details?.user_buyer?.nickname}
                </h3>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="my-trade-container container-4xl mt-5">
        <div className="boxShadow p-4 mb-3">
          <BackButton />
          <div className="py-4">
            {details?.user_type === BUY && (
              <h1>
                {"Buy"} {details?.order?.coin_type} from{" "}
                {details?.user_seller?.nickname}
              </h1>
            )}

            {details?.user_type === SELL && (
              <h1>
                {"Sell"} {details?.order?.coin_type} to{" "}
                {details?.user_buyer?.nickname}
              </h1>
            )}
          </div>
          <div className="mb-3">
            <span className="mr-1">{t(`Order number`)}</span>:{" "}
            <span className="badge badge-warning ">
              {details?.order?.order_id}
            </span>
          </div>
          <div className="mb-3">
            <span className="mr-1">{t(`Time Created`)}</span>:{" "}
            <span className="badge badge-warning ">
              {formateData(details?.order?.created_at)}
            </span>
          </div>
          {details?.order?.payment_sleep && (
            <div className="mb-3">
              <span className="mr-1 font-bold">{t(`Deposit Proof`)}</span>:{" "}
              <a
                href={details?.order?.payment_sleep}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 btn"
              >
                View
              </a>
            </div>
          )}

          {/* order.status */}
          {details?.order < 4 && (
            <TradeSteps step={step} order={details?.order} />
          )}
          <div className="">
            <h4 className="mb-3">{t(`Confirm order info`)} </h4>
            <div className="order-info ">
              <div className="">
                <p>{t(`Amount`)}</p>
                <h4 className="">
                  {" "}
                  {parseFloat(details?.order?.amount).toFixed(8)}{" "}
                  {details?.order?.coin_type}
                </h4>
              </div>
              <div className="">
                <p>{t(`Price`)}</p>
                <h4 className="">
                  {" "}
                  {parseFloat(details?.order?.price).toFixed(8)}{" "}
                  {details?.order?.currency}
                </h4>
              </div>
            </div>
          </div>
          {parseInt(details?.order?.is_reported) !== 0 && (
            <div className="boxShadow section-padding-custom text-center mt-3">
              <h4 className="mb-3">
                {t(`Seller created dispute against order`)}
              </h4>
            </div>
          )}
          {parseInt(details?.order?.status) === TRADE_STATUS_CANCELED && (
            <div className="boxShadow section-padding-custom text-center mt-3">
              <h4 className="mb-3">{t(`Trade canceled`)}</h4>
            </div>
          )}
          {parseInt(details?.order?.status) ===
            TRADE_STATUS_CANCELED_TIME_EXPIRED &&
            parseInt(details?.order?.is_reported) === 0 && (
              <div className="boxShadow section-padding-custom text-center mt-3">
                <h4 className="mb-3">{t(`Trade time expired`)}</h4>
              </div>
            )}
          {parseInt(details?.order?.status) ===
            TRADE_STATUS_REFUNDED_BY_ADMIN &&
            parseInt(details?.order?.is_reported) === 0 && (
              <div className="boxShadow section-padding-custom text-center mt-3">
                <h4 className="mb-3">
                  {t(`Trade payment hasbeen refunded by admin`)}
                </h4>
              </div>
            )}
          {parseInt(details?.order?.status) ===
            TRADE_STATUS_RELEASED_BY_ADMIN &&
            parseInt(details?.order?.is_reported) === 0 && (
              <div className="boxShadow section-padding-custom text-center mt-3">
                <h4 className="mb-3">{t(`Trade hasbeen released by admin`)}</h4>
              </div>
            )}
          {parseInt(details?.order?.is_reported) === 0 && (
            <>
              {details?.order?.status === TRADE_STATUS_ESCROW && (
                <>
                  {details.user_type === BUY && (
                    <>
                      <div className="mt-4 badge badge-warning p-2">
                        {t(
                          `Transfer the fund to the seller account provided below`
                        )}
                      </div>
                      <div>
                        {details?.payment_methods?.username && (
                          <div className="mb-3 mt-3">
                            <span className="mr-1">{t(`Account Name`)}</span>:{" "}
                            <span className="badge badge-warning ">
                              {details?.payment_methods?.username}
                            </span>
                          </div>
                        )}
                        {details?.payment_methods?.admin_pamynt_method
                          ?.name && (
                          <div className="mb-3 mt-3">
                            <span className="mr-1">
                              {t(`Payment Method Name`)}
                            </span>
                            :{" "}
                            <span className="badge badge-warning ">
                              {
                                details?.payment_methods?.admin_pamynt_method
                                  ?.name
                              }
                            </span>
                          </div>
                        )}
                        {details?.payment_methods?.bank_name && (
                          <div className="mb-3">
                            <span className="mr-1">{t(`Bank Name`)}</span>:{" "}
                            <span className="badge badge-warning ">
                              {details?.payment_methods?.bank_name}
                            </span>
                          </div>
                        )}
                        {details?.payment_methods?.bank_account_number && (
                          <div className="mb-3">
                            <span className="mr-1">
                              {t(`Bank Account Number`)}
                            </span>
                            <span className="badge badge-warning ">
                              {details?.payment_methods?.bank_account_number}
                            </span>
                          </div>
                        )}
                        {details?.payment_methods?.card_number && (
                          <div className="mb-3">
                            <span className="mr-1">{t(`Card Number`)}</span>
                            <span className="badge badge-warning ">
                              {details?.payment_methods?.card_number}
                            </span>
                          </div>
                        )}
                        {details?.payment_methods?.mobile_account_number && (
                          <div className="mb-3">
                            <span className="mr-1">{t(`Mobile Number`)}</span>
                            <span className="badge badge-warning ">
                              {details?.payment_methods?.mobile_account_number}
                            </span>
                          </div>
                        )}
                      </div>
                      {details?.due_minute && (
                        <Timer
                          // endTime={details?.order?.payment_expired_time}
                          // current_time={details?.current_time}
                          getDetails={getDetails}
                          seconds={details?.due_minute}
                        />
                      )}
                      <div className="swap-wrap mt-5">
                        <div className="">
                          <span className="file-lable">
                            {t("Select document")}
                          </span>
                        </div>
                        <div className="file-upload-wrapper">
                          {/* @ts-ignore */}
                          <label htmlFor="upload-photo" onClick={handleClick}>
                            {/* @ts-ignore */}
                            {doc ? doc.name : t("Browse")}
                          </label>
                          <input
                            ref={inputRef}
                            type="file"
                            onChange={handleFileChange}
                            className="d-none"
                          />
                        </div>
                      </div>
                      <button
                        className="btn nimmu-user-sibmit-button mt-3"
                        disabled={!doc}
                        onClick={() => {
                          paymentP2pOrderAction(
                            details?.order?.uid,
                            doc,
                            setStep
                          );
                        }}
                      >
                        {t(`Pay and notify seller`)}
                      </button>
                      <a
                        data-toggle="modal"
                        data-target="#exampleModal"
                        onClick={() => {}}
                      >
                        <button className="btn nimmu-user-sibmit-button mt-3">
                          {t(`Cancel`)}
                        </button>
                      </a>
                      <TradeCancel uid={uid} />
                    </>
                  )}
                  {details.user_type === SELL && (
                    <div className="boxShadow section-padding-custom text-center mt-3">
                      <h4 className="mb-3">{t(`Waiting for payment`)}</h4>
                    </div>
                  )}
                </>
              )}
              {details?.order?.status === TRADE_STATUS_PAYMENT_DONE && (
                <>
                  {details.user_type === BUY && (
                    <>
                      <div className="boxShadow section-padding-custom text-center mt-3">
                        <h4 className="mb-3">
                          {t(`Waiting for releasing order`)}
                        </h4>
                      </div>
                      {parseInt(details?.order?.is_reported) === 0 && (
                        <a
                          data-toggle="modal"
                          data-target="#exampleModal1"
                          onClick={() => {}}
                        >
                          <button
                            disabled={parseInt(details?.order?.is_queue) === 1}
                            className="btn nimmu-user-sibmit-button mt-3"
                            onClick={() => {}}
                          >
                            {t(`Dispute`)}
                          </button>
                        </a>
                      )}
                      <TradeDispute uid={uid} />
                    </>
                  )}
                  {details.user_type === SELL && (
                    <>
                      <button
                        className="btn nimmu-user-sibmit-button mt-3"
                        // disabled={parseInt(details?.order?.is_queue) === 1}
                        onClick={() => {
                          releaseP2pOrderAction(uid, dispatch);
                        }}
                      >
                        {t(`Release`)}
                      </button>
                      {parseInt(details?.order?.is_reported) === 0 && (
                        <a
                          data-toggle="modal"
                          data-target="#exampleModal1"
                          onClick={() => {}}
                        >
                          <button
                            // disabled={
                            //   parseInt(details?.order?.is_queue) === 1
                            // }
                            className="btn nimmu-user-sibmit-button mt-3"
                            onClick={() => {}}
                          >
                            {t(`Dispute`)}
                          </button>
                        </a>
                      )}

                      <TradeDispute uid={uid} />
                    </>
                  )}
                </>
              )}
              {details?.order?.status === TRADE_STATUS_TRANSFER_DONE && (
                <>
                  {details.user_type === BUY && (
                    <>
                      <div className="boxShadow section-padding-custom text-center mt-3">
                        <h4 className="mb-3">{t(`Trade completed`)}</h4>
                      </div>
                      {details?.order?.seller_feedback && (
                        <label className="mt-3">
                          <b>{t(`Seller Feedback:`)}</b>
                          {details?.order?.seller_feedback}
                        </label>
                      )}
                      {details?.order?.buyer_feedback === null && (
                        <div className="row">
                          <div className="col-md-12 mt-3">
                            <label> {t(`Submit review about seller`)}</label>
                            <div className="P2psearchBox position-relative">
                              <textarea
                                value={feedback}
                                onChange={(e) => {
                                  setFeedback(e.target.value);
                                }}
                                className=""
                                placeholder=""
                              ></textarea>
                            </div>
                            <>
                              <label>{t(`Review type`)}</label>

                              <div className="select-method">
                                <div
                                  className={`${
                                    feedbackType === POSITIVE &&
                                    "select-method-item-active"
                                  } select-method-item mr-0 mr-md-3`}
                                  onClick={() => {
                                    setfeedbackType(POSITIVE);
                                  }}
                                >
                                  {t(`Positive`)}
                                </div>
                                <div
                                  className={`${
                                    feedbackType === NEGATIVE &&
                                    "select-method-item-active"
                                  } select-method-item mr-0 mr-md-3`}
                                  onClick={() => {
                                    setfeedbackType(NEGATIVE);
                                  }}
                                >
                                  {t(`Negative`)}
                                </div>
                              </div>
                            </>
                          </div>
                          <button
                            className="btn nimmu-user-sibmit-button mt-3"
                            onClick={() => {
                              submitTradeFeedback(
                                details?.order?.uid,
                                feedbackType,
                                feedback
                              );
                            }}
                          >
                            {t(`Submit review`)}
                          </button>
                        </div>
                      )}
                    </>
                  )}
                  {details.user_type === SELL && (
                    <>
                      <div className="boxShadow  section-padding-custom text-center mt-3">
                        <h4 className="mb-3">{t(`Trade completed`)}</h4>
                      </div>

                      {details?.order?.buyer_feedback && (
                        <label className="mt-3">
                          <b>{t(`Buyer Feedback:`)}</b>
                          {details?.order?.buyer_feedback}
                        </label>
                      )}
                      {details?.order?.seller_feedback === null && (
                        <div className="row">
                          <div className="col-md-12 mt-3">
                            <label>{t(`Submit review about buyer`)}</label>
                            <div className="P2psearchBox position-relative">
                              <textarea
                                value={feedback}
                                onChange={(e) => {
                                  setFeedback(e.target.value);
                                }}
                                className=""
                                placeholder=""
                              ></textarea>
                            </div>
                            <label>{t(`Review type`)}</label>

                            <div className="select-method">
                              <div
                                className={`${
                                  feedbackType === POSITIVE &&
                                  "select-method-item-active"
                                } select-method-item mr-0 mr-md-3`}
                                onClick={() => {
                                  setfeedbackType(POSITIVE);
                                }}
                              >
                                {t(`Positive`)}
                              </div>
                              <div
                                className={`${
                                  feedbackType === NEGATIVE &&
                                  "select-method-item-active"
                                } select-method-item mr-0 mr-md-3`}
                                onClick={() => {
                                  setfeedbackType(NEGATIVE);
                                }}
                              >
                                {t(`Negative`)}
                              </div>
                            </div>
                          </div>
                          <button
                            className="btn nimmu-user-sibmit-button mt-3"
                            onClick={() => {
                              submitTradeFeedback(
                                details?.order?.uid,
                                feedbackType,
                                feedback
                              );
                            }}
                          >
                            {t(`Submit review`)}
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </>
          )}
        </div>
        <div className="">
          <TradeChat
            col="col-lg-12"
            details={details}
            sendMessage={sendMessage}
            setMessage={setMessage}
            setFile={setFile}
            message={message}
          />
        </div>
      </div>

      <Footer />
    </>
  );
};
export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  await SSRAuthCheck(ctx, "/p2p");
  return {
    props: {},
  };
};
export default Trading;
