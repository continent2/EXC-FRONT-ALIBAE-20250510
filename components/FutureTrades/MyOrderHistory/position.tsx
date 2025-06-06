import React, { useEffect, useState } from "react";
import { closeLongShortAllOrderAction } from "state/actions/futureTrade";
import PositionRow from "./PositionRow";
import { RootState } from "state/store";
import { useDispatch, useSelector } from "react-redux";
import useTranslation from "next-translate/useTranslation";

const Position = ({ listData }: any) => {
  const { t } = useTranslation("common");
  const [CloseAll, setCloseAll] = useState<any>([]);
  const { dashboard } = useSelector((state: RootState) => state.futureExchange);
  const dispatch = useDispatch();

  const makeList = () => {
    let arr: any = [];
    listData.map((list: any) => {
      arr.push({
        order_id: list?.id,
        order_type: 1,
        side: list?.side,
        price: dashboard?.order_data?.total?.trade_wallet?.last_price,
      });
    });
    setCloseAll(arr);
  };
  useEffect(() => {
    listData.length && makeList();
  }, [listData]);
  return (
    <div>
      {" "}
      <div className="tab-content p-l-10 p-r-10" id="ordersTabContent">
        <div
          className="tab-pane fade show active"
          id="Open-orders"
          role="tabpanel"
          aria-labelledby="Open-orders-tab"
        >
          <div className="table-responsive overflow-x-auto order-history-table-min-h">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col" className="pl-0">
                    {t(`Symbol`)}
                  </th>
                  <th scope="col">{t(`Size`)}</th>
                  <th scope="col">{t(`Entry Price`)}</th>
                  <th scope="col">{t(`Mark Price`)}</th>
                  <th scope="col">{t(`Liq Price`)}</th>
                  <th scope="col">{t(`Margin Ratio`)}</th>
                  <th scope="col">{t(`Margin`)}</th>
                  <th scope="col">{t(`PNL(ROE)%`)}</th>
                  <th
                    className="button-future-close"
                    onClick={() => {
                      dispatch(
                        closeLongShortAllOrderAction(
                          CloseAll,
                          dashboard?.order_data?.coin_pair_id
                        )
                      );
                    }}
                  >
                    {t(`Close All Positions`)}
                  </th>
                </tr>
              </thead>

              {listData?.map((list: any, index: any) => (
                <PositionRow
                  key={index}
                  list={list}
                  Close={CloseAll[index]}
                  setCloseAll={setCloseAll}
                  CloseAll={CloseAll}
                  index={index}
                />
              ))}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Position;
