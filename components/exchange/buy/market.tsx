import { formatCurrency, formateZert } from "common";
import RangeSlider from "components/dashboard/RangeSlider";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import React, { Fragment } from "react";
import { useDispatch } from "react-redux";
import {
  initialDashboardCallAction,
  buyMarketAppAction,
  getDashboardData,
} from "state/actions/exchange";

const Market = ({
  dashboard,
  buySellMarketCoinData,
  setBuySellMarketCoinData,
  isLoggedIn,
  currentPair,
}: any) => {
  const { t } = useTranslation("common");
  const buySellSliderRanges = [
    {
      percent: 0.25,
    },
    {
      percent: 0.5,
    },
    {
      percent: 0.75,
    },
    {
      percent: 1,
    },
  ];
  const [loading, setLoading] = React.useState(false);
  const dispatch = useDispatch();
  const setAmountBasedOnPercentage = (percentage: any) => {
    const { maker_fees, taker_fees } = dashboard.fees_settings;
    const amount =
      parseFloat(dashboard?.order_data?.total?.base_wallet?.balance) /
      parseFloat(buySellMarketCoinData.price);
    const feesPercentage =
      parseFloat(maker_fees) > parseFloat(taker_fees)
        ? parseFloat(maker_fees)
        : parseFloat(taker_fees);
    const total = amount * percentage * parseFloat(buySellMarketCoinData.price);
    const fees = (total * feesPercentage) / 100;
    setBuySellMarketCoinData({
      ...buySellMarketCoinData,
      amount: (total - fees) / parseFloat(buySellMarketCoinData.price),
      total: total - fees,
    });
  };
  return (
    <div id="BuyTabContent" className="tab-content p-0">
      <div
        id="imit"
        role="tabpanel"
        aria-labelledby="Limit-tab"
        className="tab-pane fade show active"
      >
        <div className="row">
          <div className="col-md-12">
            <div className="cp-user-profile-info">
              <form id="buy-form">
                <input
                  type="hidden"
                  name="_token"
                  defaultValue="g2OWJq3pDqYRQmVvmGt799aCsDmkkV4UjrWDhzcF"
                />
                <div className="form-group ">
                  <div className="total-top">
                    <label>{t("Total")}</label> <label>{t("Available")}</label>
                  </div>
                  <div className="total-top-blance">
                    <div className="total-blance">
                      <span className="text-warning font-bold">
                        <span>
                          {dashboard?.order_data?.total?.base_wallet?.balance
                            ? formatCurrency(
                                dashboard?.order_data?.total?.base_wallet
                                  ?.balance,
                                dashboard?.order_data?.total?.trade_wallet
                                  ?.pair_decimal
                              )
                            : 0}
                        </span>
                      </span>
                      <span className="text-warning font-bold">
                        <span className="base_coin_type">
                          {" "}
                          {dashboard?.order_data?.total?.base_wallet?.coin_type}
                        </span>
                      </span>
                    </div>
                    <div className="avilable-blance">
                      <span className="text-warning font-bold">
                        <span>
                          {" "}
                          {dashboard?.order_data?.total?.base_wallet?.balance
                            ? formatCurrency(
                                dashboard?.order_data?.total?.base_wallet
                                  ?.balance,
                                dashboard?.order_data?.total?.trade_wallet
                                  ?.pair_decimal
                              )
                            : 0}
                        </span>
                      </span>
                      <span className="text-warning font-bold">
                        <span className="base_coin_type">
                          {" "}
                          {dashboard?.order_data?.total?.base_wallet?.coin_type}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="form-group mt-3 boxShadow">
                  <label className="cstmHead">{t("Price@EXCHANGE")}</label>
                  <input
                    name="price"
                    type="text"
                    placeholder="0"
                    className="form-control number_only input_1"
                    value={buySellMarketCoinData?.price}
                    disabled
                  />
                  <span className="text-warning blns font-bold">
                    <span className="base_coin_type">
                      {" "}
                      {dashboard?.order_data?.total?.base_wallet?.coin_type}
                    </span>
                  </span>
                </div>
                <div className="form-group mt-3 boxShadow">
                  <label className="cstmHead">{t("Amount@EXCHANGE")}</label>
                  <input
                    name="amount"
                    type="number"
                    placeholder="0"
                    min={0}
                    className="form-control number_only"
                    value={
                      buySellMarketCoinData?.amount !== 0 &&
                      buySellMarketCoinData?.amount
                    }
                    onChange={(e) => {
                      if (parseFloat(e.target.value) < 0) {
                        setBuySellMarketCoinData({
                          ...buySellMarketCoinData,
                          amount: 0,
                          total: 0,
                        });
                        return;
                      }
                      setBuySellMarketCoinData({
                        ...buySellMarketCoinData,
                        amount: e.target.value,
                        total:
                          parseFloat(e.target.value) *
                          buySellMarketCoinData.price,
                      });
                    }}
                  />
                  <span className="text-warning blns font-bold">
                    <span className="trade_coin_type">
                      {dashboard?.order_data?.total?.trade_wallet?.coin_type}
                    </span>
                  </span>
                </div>
                <div className="form-group mt-3 boxShadow">
                  <label className="cstmHead">{t("Total Amount@EXCHANGE")}</label>

                  <input
                    disabled
                    name="total_amount"
                    type="text"
                    placeholder=""
                    className="form-control number_only input_3"
                    value={
                      Number(parseFloat(buySellMarketCoinData.total).toFixed(8))
                        ? parseFloat(buySellMarketCoinData.total).toFixed(8)
                        : 0
                    }
                  />
                  <span className="text-warning blns font-bold">
                    <span className="trade_coin_type">
                      {dashboard?.order_data?.total?.base_wallet?.coin_type}
                    </span>
                  </span>
                </div>
                {isLoggedIn && (
                  <RangeSlider
                    items={buySellSliderRanges}
                    handleFunc={setAmountBasedOnPercentage}
                    idPrefix="buyMarket"
                  />
                )}
                {!isLoggedIn ? (
                  <div className="form-group mt-4">
                    <Link href="/signin">
                      <a className="btn theme-btn-red bg-primary-color">
                        {t("Login")}
                      </a>
                    </Link>
                  </div>
                ) : loading ? (
                  <div className="form-group mt-4">
                    <button
                      type="submit"
                      className="btn theme-btn bg-primary-color"
                    >
                      <span v-if="limitBuyData.placingOrder">
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        {t("Placing Order")}...
                      </span>
                    </button>
                  </div>
                ) : (
                  <div className="form-group mt-4">
                    <button
                      type="submit"
                      className="btn theme-btn bg-primary-color"
                      onClick={async (e) => {
                        e.preventDefault();
                        await buyMarketAppAction(
                          buySellMarketCoinData.amount,
                          buySellMarketCoinData?.price,
                          dashboard?.order_data?.trade_coin_id,
                          dashboard?.order_data?.base_coin_id,
                          setLoading
                        );
                        // await dispatch(getDashboardData(currentPair));
                        setBuySellMarketCoinData({
                          ...buySellMarketCoinData,
                          amount: 0,
                          total: 0,
                        });
                      }}
                    >
                      <span>
                        {" "}
                        {t("Buy@EXCHANGE")}{" "}
                        {dashboard?.order_data?.total?.trade_wallet?.coin_type}
                      </span>
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
      <div
        id="Market"
        role="tabpanel"
        aria-labelledby="Market-tab"
        className="tab-pane fade"
      >
        <div className="row">
          <div className="col-md-12">
            <div className="cp-user-profile-info">
              <form id="buy-form" className="mt-4">
                <input
                  type="hidden"
                  name="_token"
                  defaultValue="g2OWJq3pDqYRQmVvmGt799aCsDmkkV4UjrWDhzcF"
                />
                <div className="form-group mt-4">
                  <div className="total-top">
                    <label>{t("Total")}</label> <label>{t("Available")}</label>
                  </div>
                  <div className="total-top-blance">
                    <div className="total-blance">
                      <span className="text-warning font-bold">
                        <span>0</span>
                      </span>
                      <span className="text-warning font-bold">
                        <span className="base_coin_type">
                          {" "}
                          {dashboard?.order_data?.total?.base_wallet?.coin_type}
                        </span>
                      </span>
                    </div>
                    <div className="avilable-blance">
                      <span className="text-warning font-bold">
                        <span>0</span>
                      </span>
                      <span className="text-warning font-bold">
                        <span className="base_coin_type">
                          {" "}
                          {dashboard?.order_data?.total?.base_wallet?.coin_type}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="form-group mt-3">
                  <label>{t("Price@MARKET")}</label>
                  <p className="form-control">Market</p>
                  <span className="text-warning blns font-bold">
                    <span className="base_coin_type">
                      {" "}
                      {dashboard?.order_data?.total?.base_wallet?.coin_type}
                    </span>
                  </span>
                </div>
                <div className="form-group mt-3">
                  <label>Amount</label>
                  <input
                    name="amount"
                    type="text"
                    placeholder=""
                    className="form-control number_only"
                  />
                  <span className="text-warning blns font-bold">
                    <span className="trade_coin_type">
                      {dashboard?.order_data?.total?.trade_wallet?.coin_type}
                    </span>
                  </span>
                </div>
                <div className="form-group mt-4">
                  <a className="btn theme-btn-red"> {t("Login")}</a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div
        id="Stop-limit"
        role="tabpanel"
        aria-labelledby="Stop-limit-tab"
        className="tab-pane fade"
      >
        <div className="row">
          <div className="col-md-12">
            <div className="cp-user-profile-info">
              <form id="stop-limit-form" className="mt-4">
                <input
                  type="hidden"
                  name="_token"
                  defaultValue="g2OWJq3pDqYRQmVvmGt799aCsDmkkV4UjrWDhzcF"
                />
                <div className="form-group mt-4">
                  <div className="total-top">
                    <label>{t("Total")}</label> <label>{t("Available")}</label>
                  </div>
                  <div className="total-top-blance">
                    <div className="total-blance">
                      <span className="text-warning font-bold">
                        <span>0</span>
                      </span>
                      <span className="text-warning font-bold">
                        <span className="base_coin_type">
                          {" "}
                          {dashboard?.order_data?.total?.base_wallet?.coin_type}
                        </span>
                      </span>
                    </div>
                    <div className="avilable-blance">
                      <span className="text-warning font-bold">
                        <span>0</span>
                      </span>
                      <span className="text-warning font-bold">
                        <span className="base_coin_type">
                          {" "}
                          {dashboard?.order_data?.total?.base_wallet?.coin_type}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="form-group mt-3">
                  <label>{t("Stop")}</label>
                  <input
                    name="stop"
                    type="text"
                    placeholder=""
                    className="form-control number_only"
                  />
                  <span className="text-warning blns font-bold">
                    <span className="base_coin_type">
                      {" "}
                      {dashboard?.order_data?.total?.base_wallet?.coin_type}
                    </span>
                  </span>
                </div>
                <div className="form-group mt-3">
                  <label>{t("LimitORDER@MARKET")}</label>
                  <input
                    name="limit"
                    type="text"
                    placeholder=""
                    className="form-control number_only"
                  />
                  <span className="text-warning blns font-bold">
                    <span className="base_coin_type">
                      {" "}
                      {dashboard?.order_data?.total?.base_wallet?.coin_type}
                    </span>
                  </span>
                </div>
                <div className="form-group mt-3">
                  <label>{t("Amount")}</label>
                  <input
                    name="amount"
                    type="text"
                    placeholder=""
                    className="form-control number_only"
                  />
                  <span className="text-warning blns font-bold">
                    <span className="trade_coin_type">
                      {dashboard?.order_data?.total?.trade_wallet?.coin_type}
                    </span>
                  </span>
                </div>
                <div className="form-group mt-3">
                  <label>{t("Total Amount@MARKET")}</label>
                  <input
                    // disabled
                    name="total_amount"
                    type="text"
                    placeholder=""
                    className="form-control number_only"
                  />
                  <span className="text-warning blns font-bold">
                    <span className="base_coin_type">
                      {" "}
                      {dashboard?.order_data?.total?.base_wallet?.coin_type}
                    </span>
                  </span>
                </div>
                <div className="form-group mt-4 d-flex justify-content-between flex-wrap">
                  <a className="btn theme-btn-red"> {t("Login")}</a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Market;
