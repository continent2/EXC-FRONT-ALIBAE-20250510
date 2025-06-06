import React, { useState, useRef, useEffect } from "react";
import useTranslation from "next-translate/useTranslation";
import {
  WalletDepositApiAction,
  WalletWithdrawApiAction,
} from "state/actions/wallet";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { SSRAuthCheck } from "middlewares/ssr-authentication-check";
import { parseCookies } from "nookies";
import { GetUserInfoByTokenServer } from "service/user";
import {
  FAQ_TYPE_DEPOSIT,
  FAQ_TYPE_WITHDRAWN,
  MY_WALLET_DEPOSIT_TYPE,
  MY_WALLET_WITHDRAW_TYPE,
} from "helpers/core-constants";
import { DipositComponent } from "components/MyWallet/diposit";
import { WithdrawComponent } from "components/MyWallet/withdraw";
import { getFaqList } from "service/faq";
import FAQ from "components/FAQ";
import Footer from "components/common/footer";
import { customPage, landingPage } from "service/landing-page";
import { RootState } from "state/store";
import { useSelector } from "react-redux";
import Wallethistory from "components/wallet/wallet-history";
import { MyWalletProcessSidebar } from "service/wallet";
import Link from "next/link";
import { IoIosArrowBack } from "react-icons/io";
import PlaceTopLeft from "components/gradient/placeTopLeft";
import PlaceBottomRight from "components/gradient/placeBottomRight";
import CheckDeposit from "components/check-deposit/CheckDeposit";
import WalletLayout from "components/wallet/WalletLayout";
import { BiArrowBack } from "react-icons/bi";
import SectionLoading from "components/common/SectionLoading";

const DeposiAndWithdraw = ({ withdrawFaq, depositFaq }: any) => {
  const router = useRouter();
  const [fullPage, setFullPage] = useState(false);
  const { settings } = useSelector((state: RootState) => state.common);
  const { t } = useTranslation("common");
  const [faqs, setFaqs] = useState<any>([]);
  const [responseData, setResponseData]: any = useState();
  const [dependecy, setDependecy] = useState(0);
  const [getProcessData, setProcessData]: any = useState([]);

  const handleWithdrawAndDeposit = async (actionType: string, id: number) => {
    if (actionType === MY_WALLET_DEPOSIT_TYPE) {
      const response = await WalletDepositApiAction(
        Number(router.query.coin_id)
      );
      if (response.success === true) {
        if (
          response?.data?.base_type == 8 ||
          response?.data?.base_type == 6 ||
          response?.data?.base_type == 10
        ) {
          setResponseData({
            ...response,
            deposit: response.wallet,
            addressLists: response.data.address,
            network: [
              { id: "", name: "Select Network", base_type: "" },
              ...response.data.networks,
            ],
          });
          return;
        }
        setResponseData({
          ...response,
          deposit: response.wallet,
          addressLists: response.data.address,
        });
      } else if (response.success === false) {
        router.push("/user/my-wallet");
      }
    } else {
      const response = await WalletWithdrawApiAction(
        Number(router.query.coin_id)
      );

      if (response.success === true) {
        if (
          response?.data?.base_type == 8 ||
          response?.data?.base_type == 6 ||
          response?.data?.base_type == 10
        ) {
          setResponseData({
            ...response,
            withdraw: response.wallet,
            address: response.data.address,
            network: [
              { id: "", name: "Select Network", base_type: "" },
              ...response.data.networks,
            ],
          });
          return;
        }
        setResponseData({
          ...response,
          withdraw: response.wallet,
          address: response.address,
        });
      } else if (response.success === false) {
        router.push("/user/my-wallet");
      }
    }
  };
  const checkFullPageStatus = () => {
    if (
      parseInt(settings.withdrawal_faq_status) !== 1 &&
      router.query.id === MY_WALLET_WITHDRAW_TYPE &&
      parseInt(getProcessData?.data?.progress_status_for_withdrawal) !== 1
    ) {
      setFullPage(true);
    } else if (
      parseInt(settings.coin_deposit_faq_status) !== 1 &&
      router.query.id === MY_WALLET_DEPOSIT_TYPE &&
      parseInt(getProcessData?.data?.progress_status_for_deposit) !== 1
    ) {
      setFullPage(true);
    } else if (
      faqs?.length <= 0 &&
      typeof getProcessData?.data?.progress_status_list === "undefined"
    ) {
      setFullPage(true);
    } else if (
      faqs?.length <= 0 &&
      getProcessData?.data?.progress_status_list?.length <= 0
    ) {
      setFullPage(true);
    }
  };

  const getProcess = async () => {
    const processData = await MyWalletProcessSidebar(String(router.query.id));
    setProcessData(processData);
  };
  let WithdrawAndDeposit = false;
  useEffect(() => {
    setFaqs(
      router.query.id === MY_WALLET_DEPOSIT_TYPE ? depositFaq : withdrawFaq
    );
    getProcess();
    if (WithdrawAndDeposit === false) {
      handleWithdrawAndDeposit(
        String(router.query.id),
        Number(router.query.coin_id)
      );
      WithdrawAndDeposit = true;
    }
  }, [dependecy]);
  useEffect(() => {
    if (
      settings.withdrawal_faq_status &&
      router.query.id &&
      getProcessData?.data?.progress_status_list
    ) {
      checkFullPageStatus();
    }
  }, [
    settings.withdrawal_faq_status,
    router.query.id,
    faqs?.length,
    getProcessData?.data?.progress_status_list,
  ]);

  const networkTypeCheckHandler = (network: any) => {
    if (!network) {
      return false;
    }
    if (network == 1 || network == 2 || network == 3) {
      return false;
    }
    return true;
  };

  return (
    <>
      <WalletLayout>
        <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-shadow-[2px_2px_23px_0px_#6C6C6C0D] tradex-px-4 tradex-pt-6 tradex-pb-12 tradex-space-y-6">
          <div className=" tradex-pb-4 tradex-border-b tradex-border-background-primary tradex-space-y-4">
            <h2 className=" tradex-text-[32px] tradex-leading-[38px] md:tradex-text-[40px] md:tradex-leading-[48px] tradex-font-bold !tradex-text-title">
              {router.query.id === MY_WALLET_DEPOSIT_TYPE && t("Deposit")}
              {router.query.id === MY_WALLET_WITHDRAW_TYPE && t("Withdraw")}
            </h2>
            <div
              onClick={() => {
                router.back();
              }}
              className=" tradex-flex tradex-gap-1 tradex-items-center tradex-cursor-pointer"
            >
              <BiArrowBack />
              <h5 className="tradex-text-xl tradex-leading-6 tradex-font-medium !tradex-text-title">
                {t("My Wallet")}
              </h5>
            </div>
          </div>

          <div
            className={`tradex-grid  tradex-gap-4 ${
              fullPage ? "tradex-grid-cols-1" : "md:tradex-grid-cols-2"
            }`}
          >
            <div>
              {router.query.id === MY_WALLET_DEPOSIT_TYPE && (
                <DipositComponent
                  responseData={responseData}
                  router={router}
                  setDependecy={setDependecy}
                  fullPage={fullPage}
                />
              )}

              {router.query.id === MY_WALLET_WITHDRAW_TYPE && (
                <WithdrawComponent
                  responseData={responseData}
                  router={router}
                  fullPage={fullPage}
                />
              )}
            </div>
            {fullPage === false && (
              <div>
                {parseInt(settings.withdrawal_faq_status) === 1 &&
                  router.query.id === MY_WALLET_WITHDRAW_TYPE &&
                  faqs?.length > 0 && (
                    <div className={`box-one single-box visible mb-25`}>
                      <div className="my-wallet-new rounded px-0">
                        <FAQ faqs={faqs} type={router.query.id} />
                      </div>
                    </div>
                  )}
                {parseInt(settings.coin_deposit_faq_status) === 1 &&
                  router.query.id === MY_WALLET_DEPOSIT_TYPE &&
                  faqs?.length > 0 && (
                    <div className={`box-one single-box visible mb-25`}>
                      <div className="my-wallet-new rounded px-0">
                        <FAQ faqs={faqs} type={router.query.id} />
                      </div>
                    </div>
                  )}
                {/* <PlaceTopLeft /> */}

                {getProcessData?.data?.progress_status_list?.length > 0 && (
                  <div className="mt-3">
                    <h4>
                      {router.query.id === "deposit"
                        ? "Deposit" + " Step's"
                        : "Withdrawal" + " Step's"}
                    </h4>

                    <div className="flexItem">
                      <div>
                        {getProcessData?.data?.progress_status_list?.map(
                          (item: any, index: number) => (
                            <div
                              key={`progress${index}`}
                              className={"timeLineLists"}
                            >
                              <div
                                className={`${
                                  getProcessData?.data?.progress_status_list
                                    ?.length ==
                                  index + 1
                                    ? "timeLineIcon removeBeforeCSS"
                                    : "timeLineIcon"
                                }`}
                              >
                                <i className="fa-sharp fa-solid fa-circle-check active"></i>
                              </div>
                              <div className="progressContent">
                                <h5>{item.title}</h5>
                                <span>{item.description}</span>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            <div></div>
          </div>
        </div>
        {router.query.id === MY_WALLET_DEPOSIT_TYPE &&
          networkTypeCheckHandler(responseData?.data?.base_type) && (
            <CheckDeposit />
          )}

        {router.query.id && (
          <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-shadow-[2px_2px_23px_0px_#6C6C6C0D] tradex-px-4 tradex-pt-6 tradex-pb-12 tradex-space-y-6">
            <Wallethistory
              type={
                router.query.id === MY_WALLET_WITHDRAW_TYPE
                  ? "withdrawal"
                  : "deposit"
              }
            />
          </div>
        )}
      </WalletLayout>

      <Footer />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  await SSRAuthCheck(ctx, "/user/my-wallet/deposit");
  const cookies = parseCookies(ctx);
  const response = await GetUserInfoByTokenServer(cookies.token);
  const FAQ = await getFaqList();
  let withdrawFaq: any[] = [];
  let depositFaq: any[] = [];
  FAQ.data?.data?.map((faq: any) => {
    if (faq?.faq_type_id === FAQ_TYPE_DEPOSIT) {
      depositFaq.push(faq);
    } else if (faq?.faq_type_id === FAQ_TYPE_WITHDRAWN) {
      withdrawFaq.push(faq);
    }
  });

  return {
    props: {
      user: response.user,
      withdrawFaq: withdrawFaq,
      depositFaq: depositFaq,
    },
  };
};

export default DeposiAndWithdraw;
