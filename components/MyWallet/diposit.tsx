import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useRef, useState } from "react";
import { copyTextById, formateZert } from "common";
import { GetWalletAddressAction } from "state/actions/wallet";
import Qr from "components/common/qr";
import { IoIosArrowBack } from "react-icons/io";
import Link from "next/link";
import QRCode from "react-qr-code";
import { getEvmNetworkAddressApi } from "service/wallet";
import { toast } from "react-toastify";

export const DipositComponent = ({
  responseData,
  router,
  setDependecy,
  fullPage,
}: any) => {
  const { t } = useTranslation("common");
  const [selectedNetwork, setSelectedNetwork] = useState<any>({});
  const [initialHit, setInitialHit] = useState(false);
  const [evmAddress, setEvmAddress] = useState<any>();
  const [tokenAddress, setTokenAddress] = useState<any>("");
  const selectAddressCopy: any = React.useRef(null);
  useEffect(() => {
    if (
      parseInt(responseData?.data?.base_type) === 1 &&
      responseData?.wallet.coin_type == "USDT" &&
      initialHit === false
    ) {
      setSelectedNetwork(responseData?.data?.coin_payment_networks[0]);
      setInitialHit(true);
    }
  }, [responseData?.wallet.coin_type]);
  const checkNetworkFunc = (networkId: any) => {
    if (networkId == 4) {
      return `(ERC20 Token)`;
    }
    if (networkId == 5) {
      return `(BEP20 Token)`;
    }
    if (networkId == 6) {
      return `(TRC20 Token)`;
    }
    return "";
  };

  const evmNetworkHandle = async (networkId: any) => {
    const findObje = responseData?.network?.find(
      (x: any) => x.id === parseInt(networkId)
    );
    setDependecy(Math.random() * 100);
    setSelectedNetwork(findObje);

    if (!networkId) {
      setEvmAddress("");
      setTokenAddress("");
      return;
    }

    const isAddressExist = responseData?.addressLists.find(
      (item: any) => item.network_id == networkId
    );

    if (isAddressExist?.network_id) {
      setEvmAddress(isAddressExist.address);
      setTokenAddress(isAddressExist.token_address);
      return;
    }

    const response = await getEvmNetworkAddressApi({
      coin_type: responseData?.deposit?.coin_type,
      network: Number(networkId),
    });

    if (!response.success) {
      toast.error(response.message);
      return;
    }
    toast.success(response.message);
    setEvmAddress(response.data);
  };
  return (
    <>
      <div className="tradex-space-y-6">
        <div className=" tradex-space-y-2">
          <p className=" tradex-input-label tradex-mb-0">
            {t("Total Balance")}
          </p>
          <div className="tradex-input-field tradex-flex tradex-justify-between tradex-items-center">
            <div className=" tradex-flex tradex-gap-2 tradex-items-center">
              <img
                className=" tradex-max-w-[25px] tradex-max-h-[25px] tradex-object-cover tradex-object-center"
                src={responseData?.deposit?.coin_icon || "/bitcoin.png"}
                alt="coin"
                width="25px"
                height="25px"
              />
              <p className=" tradex-text-sm tradex-text-body">
                {responseData?.deposit?.coin_type}
              </p>
            </div>

            <p className="tradex-text-sm tradex-text-body">
              {responseData?.deposit?.balance
                ? formateZert(responseData?.deposit?.balance) +
                  " " +
                  responseData?.deposit?.coin_type
                : "Loading.."}
            </p>
          </div>
        </div>
        {/* wallet dropdown for network base type 8 */}
        <div className="wallet-addres">
          {(parseInt(responseData?.data?.base_type) === 8 ||
            parseInt(responseData?.data?.base_type) === 6 ||
            parseInt(responseData?.data?.base_type) === 10) && (
            <div className="tradex-space-y-2">
              <p className="tradex-input-label tradex-mb-0">
                {t("Select Network")}
              </p>
              <select
                name="currency"
                className="tradex-input-field !tradex-bg-background-primary !tradex-border-solid !tradex-border !tradex-border-background-primary"
                style={{ height: "44px" }}
                onChange={(e) => {
                  evmNetworkHandle(e.target.value);
                }}
              >
                {responseData?.network?.map((item: any, index: number) => (
                  <option value={item.id} key={index}>
                    {item?.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        {/* wallet dropdown for base type 1 And Coin type usdt */}
        {responseData?.memo && (
          <div className=" tradex-space-y-2">
            <p className="tradex-input-label tradex-mb-0">{t("Memo")}</p>
            <div className="tradex-input-field">
              <p className="tradex-text-sm tradex-text-body tradex-overflow-hidden tradex-text-ellipsis">
                {responseData?.memo}
              </p>
            </div>
          </div>
        )}

        <div className="wallet-addres">
          {responseData?.wallet.coin_type == "USDT" &&
            parseInt(responseData?.data?.base_type) === 1 && (
              <div className="tradex-space-y-2">
                <p className="tradex-input-label tradex-mb-0">
                  {t("Select Network")}
                </p>
                <select
                  name="currency"
                  className="tradex-input-field !tradex-bg-background-primary !tradex-border-solid !tradex-border !tradex-border-background-primary"
                  onChange={(e) => {
                    const findObje =
                      responseData?.data?.coin_payment_networks.find(
                        (x: any) => x.id === parseInt(e.target.value)
                      );
                    setDependecy(Math.random() * 100);
                    setSelectedNetwork(findObje);
                  }}
                >
                  {responseData?.data?.coin_payment_networks.map(
                    (item: any, index: number) => (
                      <option value={item.id} key={index}>
                        {item?.network_name}
                      </option>
                    )
                  )}
                </select>
              </div>
            )}
        </div>
        {/* wallet dropdown for base type 1 And Coin type usdt end*/}

        {/* base coin type 8  */}

        {(parseInt(responseData?.data?.base_type) === 8 ||
          parseInt(responseData?.data?.base_type) === 6 ||
          parseInt(responseData?.data?.base_type) === 10) &&
          selectedNetwork?.id && (
            <>
              <div className="tradex-space-y-2">
                <p className="tradex-input-label tradex-mb-0">
                  {t("Deposit Address")}
                </p>
                <p className="tradex-input-field !tradex-h-auto tradex-py-[14px] !tradex-text-sm">
                {t("Only send" ) }
                { responseData?.deposit?.coin_type ?? "" }
                { checkNetworkFunc( responseData?.deposit?.network ) }
                {t("to this address. Sending any others asset to this adress may result in the loss of your deposit!")}
                    {/* `On ly send ${
                      responseData?.deposit?.coin_type ?? ""
                    } ${checkNetworkFunc(
                      responseData?.deposit?.network
                    )} to this add ress. Sending any others asset to this adress may result in the loss of your deposit!` */}
                  {/* {t(
                    `On ly send ${
                      responseData?.deposit?.coin_type ?? ""
                    } ${checkNetworkFunc(
                      responseData?.deposit?.network
                    )} to this addr ess. Sending any others asset to this adress may result in the loss of your deposit!`
                  )} */}
                </p>
              </div>

              <div className="tradex-flex tradex-justify-center tradex-items-center tradex-flex-col tradex-space-y-4">
                {evmAddress && (
                  <>
                    <div className="qr-background">
                      <QRCode
                        className="qrCodeBg rounded"
                        value={evmAddress}
                        size={150}
                      />
                    </div>
                    <div className="tradex-input-field tradex-flex tradex-justify-between tradex-items-center">
                      <input
                        onClick={() => {
                          copyTextById(evmAddress);
                          selectAddressCopy?.current.select();
                        }}
                        ref={selectAddressCopy}
                        className="!tradex-border-none tradex-bg-transparent tradex-text-sm tradex-w-full"
                        type="text"
                        value={evmAddress}
                      />

                      <span
                        className="tradex-inline-block tradex-min-w-[20px]"
                        onClick={() => {
                          copyTextById(evmAddress);
                          selectAddressCopy?.current?.select();
                        }}
                      >
                        <i className="fa fa-clone"></i>
                      </span>
                    </div>
                  </>
                )}
              </div>
            </>
          )}

        {/* base coin type not 8  */}

        {responseData &&
          parseInt(responseData?.data?.base_type) !== 8 &&
          parseInt(responseData?.data?.base_type) !== 6 &&
          parseInt(responseData?.data?.base_type) !== 10 && (
            <>
              <div className="tradex-space-y-2">
                <p className="tradex-input-label tradex-mb-0">
                  {t("Deposit Address")}
                </p>
                <p className="tradex-input-field !tradex-h-auto tradex-py-[14px] !tradex-text-sm">

                {t("Only send" ) }{ " " }
                { responseData?.deposit?.coin_type ?? "" }
                { checkNetworkFunc( responseData?.deposit?.network ) }{ " " }
                {t("SENDING-ANY-OTHER")}

                  {/* {t(                    `Only send ${
                      responseData?.deposit?.coin_type ?? ""
                    } ${checkNetworkFunc(
                      responseData?.deposit?.network
                    )} to this add ress. Sending any others asset to this adr ess may result in the loss of your deposit!`
                  )} */}

                </p>
              </div>

              <div className="tradex-space-y-4">
                <div className="tradex-flex tradex-justify-center tradex-items-center tradex-flex-col tradex-space-y-4">
                  {/* {responseData?.address && (
                      <div className="qr-background">
                        <QRCode
                          className="qrCodeBg rounded"
                          value={responseData?.address}
                          size={150}
                        />
                      </div>
                    )} */}
                  {selectedNetwork?.address &&
                  responseData?.wallet.coin_type === "USDT" ? (
                    <div className="qr-background">
                      <QRCode
                        className="qrCodeBg rounded"
                        value={selectedNetwork?.address}
                        size={150}
                      />
                    </div>
                  ) : (
                    responseData?.data?.address?.length !== 0 &&
                    responseData?.data?.address[0]?.address && (
                      <div className="qr-background">
                        <QRCode
                          className="qrCodeBg rounded"
                          value={responseData?.data?.address[0]?.address}
                          size={150}
                        />
                      </div>
                    )
                  )}

                  <div className="tradex-input-field tradex-flex tradex-justify-between tradex-items-center">
                    {selectedNetwork?.address &&
                    responseData?.wallet.coin_type == "USDT" ? (
                      <>
                        <input
                          onClick={() => {
                            copyTextById(selectedNetwork?.address);
                            selectAddressCopy?.current.select();
                          }}
                          ref={selectAddressCopy}
                          className="!tradex-border-none tradex-bg-transparent tradex-text-sm tradex-w-full"
                          type="text"
                          value={selectedNetwork?.address}
                        />

                        <span
                          className="tradex-inline-block tradex-min-w-[20px]"
                          onClick={() => {
                            copyTextById(selectedNetwork?.address);
                            selectAddressCopy?.current?.select();
                          }}
                        >
                          <i className="fa fa-clone"></i>
                        </span>
                      </>
                    ) : responseData?.data?.address?.length !== 0 &&
                      responseData?.data?.address[0]?.address ? (
                      <>
                        <input
                          onClick={() => {
                            copyTextById(
                              responseData?.data?.address[0]?.address
                            );
                            selectAddressCopy?.current.select();
                          }}
                          ref={selectAddressCopy}
                          className="!tradex-border-none tradex-bg-transparent tradex-text-sm tradex-w-full"
                          type="text"
                          value={responseData?.data?.address[0]?.address}
                        />

                        <span
                          className="tradex-inline-block tradex-min-w-[20px]"
                          onClick={() => {
                            copyTextById(
                              responseData?.data?.address[0]?.address
                            );
                            selectAddressCopy?.current?.select();
                          }}
                        >
                          <i className="fa fa-clone"></i>
                        </span>
                      </>
                    ) : (
                      <p
                        ref={selectAddressCopy}
                        id="url-copy"
                        className="tradex-input-field !tradex-text-sm !tradex-items-center tradex-justify-center"
                      >
                        {t("No address found!")}
                      </p>
                    )}
                  </div>
                </div>
                {!selectedNetwork?.address &&
                  responseData?.wallet?.coin_type == "USDT" &&
                  parseInt(responseData?.data?.base_type) === 1 && (
                    <button
                      className=" tradex-w-full tradex-flex tradex-items-center tradex-justify-center tradex-min-h-[56px] tradex-py-4 tradex-rounded-lg tradex-bg-primary tradex-text-white"
                      onClick={() => {
                        GetWalletAddressAction(
                          {
                            wallet_id: router.query.coin_id,
                            network_type: selectedNetwork?.network_type ?? "",
                          },
                          setSelectedNetwork,
                          setDependecy
                        );
                      }}
                    >
                      {t("Get address")}
                    </button>
                  )}
              </div>
            </>
          )}
        {tokenAddress && (
          <div className="accordion" id="accordionExample">
            <div className="">
              <div className="card">
                <div className="card-header" id="headingOne">
                  <h5 className="mb-0 header-align">
                    <button
                      className="btn btn-link collapsed"
                      data-toggle="collapse"
                      data-target={`#collapseTokenAddress`}
                      aria-expanded="true"
                      aria-controls="collapseOne"
                    >
                      {t(`Display Contract Address`)}
                    </button>
                    <i className={`fas fa-caret-down mright-5`}></i>
                  </h5>
                </div>

                <div
                  id={`collapseTokenAddress`}
                  className={`collapse`}
                  aria-labelledby="headingOne"
                  data-parent="#accordionExample"
                >
                  <div className="tradex-input-field">
                    <p className="tradex-text-sm tradex-text-body tradex-overflow-hidden tradex-text-ellipsis">
                      {tokenAddress}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
