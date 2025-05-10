// import React, { useState } from "react";
// import PositionEdit from "../Modals/positionEdit";
// import { LIMIT_ORDER, MARKET_ORDER } from "helpers/core-constants";
// import useTranslation from "next-translate/useTranslation";
// import { useDispatch } from "react-redux";
// import {
//   CloseBuyOrderAction,
//   CloseSellOrderAction,
// } from "state/actions/futureTrade";
//
// const PositionRow = ({ list, Close, setCloseAll, index, CloseAll }: any) => {
//   const { t } = useTranslation("common");
//   const dispatch = useDispatch();
//
//   const handleClosePosition = async () => {
//     // Determine if it's a buy or sell position based on the side value
//     const isBuy = list?.side === 1;
//
//     // Use the appropriate action based on position type
//     if (isBuy) {
//       await dispatch(
//         CloseSellOrderAction(
//           1, // side
//           list?.margin_mode || 2, // margin mode
//           Close?.order_type || MARKET_ORDER, // order type
//           Close?.price || list?.profit_loss_calculation?.market_price, // price
//           1, // amount_type
//           list?.amount_in_trade_coin, // amount
//           list?.leverage || 0, // leverage
//           () => {}, // callback
//           list?.profit_loss_calculation?.coin_pair_id || 1, // coin pair id
//           0, // stop price (not needed for close)
//           list?.id
//         )
//       );
//     } else {
//       await dispatch(
//         CloseBuyOrderAction(
//           2, // side
//           list?.margin_mode || 2, // margin mode
//           Close?.order_type || MARKET_ORDER, // order type
//           Close?.price || list?.profit_loss_calculation?.market_price, // price
//           1, // amount_type
//           list?.amount_in_trade_coin, // amount
//           list?.leverage || 0, // leverage
//           () => {}, // callback
//           list?.profit_loss_calculation?.coin_pair_id || 1, // coin pair id
//           0, // stop price (not needed for close)
//           list?.id
//         )
//       );
//     }
//   };
//
//   return (
//     <tr className="position-row">
//       <td className="pl-0">
//         <h6 className="text-12">{list?.profit_loss_calculation?.symbol}</h6>
//         <span className="text-12">{t(`Perpatual`)}</span>
//       </td>
//       <td className="px-1 text-12">{list?.amount_in_trade_coin}</td>
//       <td className="px-1 text-12">{list?.entry_price}</td>
//       <td className="px-1 text-12">
//         {list?.profit_loss_calculation?.market_price}
//       </td>
//       <td className="px-1 text-12">{list?.liquidation_price}</td>
//       <td className="px-1 text-12">
//         {list?.profit_loss_calculation?.margin_ratio}
//       </td>
//       <td className="px-1 text-12">
//         {list?.margin}
//         {list?.profit_loss_calculation?.base_coin_type}
//       </td>
//       <td className="px-1 text-12">
//         <span
//           className={
//             parseFloat(list?.profit_loss_calculation?.pnl) <= 0
//               ? "text-danger"
//               : "text-success"
//           }
//         >
//           {parseFloat(list?.profit_loss_calculation?.pnl).toFixed(4)}{" "}
//           {list?.profit_loss_calculation?.base_coin_type}
//         </span>
//
//         <div
//           className={
//             parseFloat(list?.profit_loss_calculation?.roe) <= 0
//               ? "text-danger"
//               : "text-success"
//           }
//         >
//           {parseFloat(list?.profit_loss_calculation?.roe).toFixed(4)}%
//         </div>
//       </td>
//       <td className="position-container pr-1">
//         <span
//           className={`ml-2 text-12 ${
//             Close?.order_type === MARKET_ORDER && "text-warning"
//           }`}
//           onClick={() => {
//             setCloseAll({
//               ...CloseAll,
//               [index]: {
//                 ...CloseAll[index],
//                 order_type: MARKET_ORDER,
//               },
//             });
//           }}
//         >
//           {t(`Market`)}
//         </span>
//         <span
//           className={`ml-2 text-12 ${
//             Close?.order_type === LIMIT_ORDER && "text-warning"
//           }`}
//           onClick={() => {
//             setCloseAll({
//               ...CloseAll,
//               [index]: {
//                 ...CloseAll[index],
//                 order_type: LIMIT_ORDER,
//               },
//             });
//           }}
//         >
//           {t(`Limit`)}
//         </span>
//         <div className="">
//           <input
//             name="price"
//             type="number"
//             placeholder="0"
//             className="text-12"
//             value={Close?.price}
//             onChange={(e) => {
//               setCloseAll({
//                 ...CloseAll,
//                 [index]: {
//                   ...CloseAll[index],
//                   price: Number(e.target.value),
//                 },
//               });
//             }}
//           />
//         </div>
//         <div
//           className="tradex-px-[24px] tradex-rounded-[6px] tradex-cursor-pointer tradex-text-black dark:tradex-text-white dark:tradex-bg-gray-700 tradex-bg-gray-300"
//           onClick={handleClosePosition}
//         >
//           Close
//         </div>
//       </td>
//     </tr>
//   );
// };
//
// export default PositionRow;
import React, { useState } from "react";
import PositionEdit from "../Modals/positionEdit";
import { LIMIT_ORDER, MARKET_ORDER } from "helpers/core-constants";
import useTranslation from "next-translate/useTranslation";
import { useDispatch } from "react-redux";
import { closeLongShortAllOrderAction } from "state/actions/futureTrade";
import { RootState } from "state/store";
import { useSelector } from "react-redux";

const PositionRow = ({ list, Close, setCloseAll, index, CloseAll }: any) => {
  const { t } = useTranslation("common");
  const [isClosingOrder, setIsClosingOrder] = useState(false);
  const dispatch = useDispatch();
  const { dashboard } = useSelector((state: RootState) => state.futureExchange);

  const handleClosePosition = async () => {
    setIsClosingOrder(true);
    // Create an array with just this single position to close
    const singleCloseItem = [
      {
        order_id: list?.id,
        order_type: Close?.order_type || MARKET_ORDER,
        side: list?.side,
        price:
          Close?.price ||
          dashboard?.order_data?.total?.trade_wallet?.last_price,
      },
    ];

    dispatch(
      closeLongShortAllOrderAction(
        singleCloseItem,
        list?.profit_loss_calculation?.coin_pair_id ||
          dashboard?.order_data?.coin_pair_id,
        "Order closed successfully!"
      )
    );
    setIsClosingOrder(close);
  };

  return (
    <tr className="position-row overflow-x-auto">
      <td className="pl-0">
        <h6 className="text-12">{list?.profit_loss_calculation?.symbol}</h6>
        <span className="text-12">{t(`Perpatual`)}</span>
      </td>
      <td className="px-1 text-12">{list?.amount_in_trade_coin}</td>
      <td className="px-1 text-12">{list?.entry_price}</td>
      <td className="px-1 text-12">
        {list?.profit_loss_calculation?.market_price}
      </td>
      <td className="px-1 text-12">{list?.liquidation_price}</td>
      <td className="px-1 text-12">
        {list?.profit_loss_calculation?.margin_ratio}
      </td>
      <td className="px-1 text-12">
        {list?.margin}
        {list?.profit_loss_calculation?.base_coin_type}
      </td>
      <td className="px-1 text-12">
        <span
          className={
            parseFloat(list?.profit_loss_calculation?.pnl) <= 0
              ? "text-danger"
              : "text-success"
          }
        >
          {parseFloat(list?.profit_loss_calculation?.pnl).toFixed(4)}{" "}
          {list?.profit_loss_calculation?.base_coin_type}
        </span>

        <div
          className={
            parseFloat(list?.profit_loss_calculation?.roe) <= 0
              ? "text-danger"
              : "text-success"
          }
        >
          {parseFloat(list?.profit_loss_calculation?.roe).toFixed(4)}%
        </div>
      </td>
      <td className="position-container pr-1">
        <span
          className={`ml-2 text-12 ${
            Close?.order_type === MARKET_ORDER && "text-warning"
          }`}
          onClick={() => {
            setCloseAll({
              ...CloseAll,
              [index]: {
                ...CloseAll[index],
                order_type: MARKET_ORDER,
              },
            });
          }}
        >
          {t(`Market`)}
        </span>
        <span
          className={`ml-2 text-12 ${
            Close?.order_type === LIMIT_ORDER && "text-warning"
          }`}
          onClick={() => {
            setCloseAll({
              ...CloseAll,
              [index]: {
                ...CloseAll[index],
                order_type: LIMIT_ORDER,
              },
            });
          }}
        >
          {t(`Limit`)}
        </span>
        <div className="">
          <input
            name="price"
            type="number"
            placeholder="0"
            className="text-12"
            value={Close?.price}
            onChange={(e) => {
              setCloseAll({
                ...CloseAll,
                [index]: {
                  ...CloseAll[index],
                  price: Number(e.target.value),
                },
              });
            }}
          />
        </div>
        <div
          className="tradex-px-[24px] tradex-rounded-[6px] tradex-cursor-pointer tradex-text-black dark:tradex-text-white dark:tradex-bg-gray-700 tradex-bg-gray-300 tradex-flex tradex-items-center tradex-justify-center"
          style={{
            textWrap: "nowrap",
            minWidth: "9rem", // Match your button height
            minHeight: "1.5rem",
          }}
          onClick={handleClosePosition}
        >
          {isClosingOrder ? (
            <div
              className="tradex-w-full tradex-h-full tradex-flex tradex-items-center tradex-justify-center"
              role="status"
            >
              <div
                className="spinner-border spinner-border-sm text-secondary"
                style={{ width: "1.25rem", height: "1.25rem" }}
                role="status"
              ></div>
            </div>
          ) : (
            "Close Position"
          )}
        </div>{" "}
      </td>
    </tr>
  );
};

export default PositionRow;
