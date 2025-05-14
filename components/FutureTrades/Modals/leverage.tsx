        // import useTranslation from "next-translate/useTranslation";
        // import React, { useEffect, useState } from "react";
        // import { AiOutlineClose } from "react-icons/ai";
        // import { toast } from "react-toastify";
        //
        // const Leverage = ({ leverage, setLeverage, dashboard }: any) => {
        //   const [isModalOpen, setIsModalOpen] = useState(false);
        //   const [leverages, setLeverages] = useState<any>([1, 2, 5, 10, 25]);
        //   const { t } = useTranslation("common");
        //   // dashboard?.order_data?.max_leverage;
        //   // const generateLeverage = () => {
        //   //   const leverageArray = [];
        //   //   const limit = dashboard?.order_data?.max_leverage;
        //   //   if (dashboard?.order_data?.max_leverage == 0) {
        //   //     setLeverage(0);
        //   //     return;
        //   //   }
        //   //   if (typeof limit !== "undefined") {
        //   //     if (limit >= 10) {
        //   //       leverageArray.push(1, 5, 10);
        //   //
        //   //       let currentLeverage = 20;
        //   //       while (currentLeverage <= limit) {
        //   //         leverageArray.push(currentLeverage);
        //   //         currentLeverage += 10;
        //   //       }
        //   //     } else if (limit < 5) {
        //   //       leverageArray.push(1);
        //   //     } else if (limit <= 5) {
        //   //       leverageArray.push(1, 5);
        //   //     }
        //   //   } else {
        //   //     // Handle the case when limit is undefined or not accessible
        //   //     leverageArray.push(1);
        //   //   }
        //   //
        //   //   setLeverages(leverageArray);
        //   //   if (leverageArray.length) {
        //   //     setLeverage(leverageArray[0]);
        //   //   }
        //   // };
        //   const toggle = () => {
        //     // if (leverage <= 0) {
        //     //   toast.error(`No Leverage is available for this Coin Pair.`);
        //     //   return;
        //     // }
        //     setIsModalOpen(!isModalOpen);
        //   };
        //
        //   const closeModal = () => {
        //     setIsModalOpen(false);
        //   };
        //   const modifyLeverage = (value: number) => {
        //     setLeverage(value);
        //   };
        //   // useEffect(() => {
        //   //   generateLeverage();
        //   // }, [dashboard?.order_data?.max_leverage]);
        //
        //   return (
        //     <>
        //       <div
        //         id=""
        //         data-toggle="pill"
        //         role="tab"
        //         aria-controls="pills-transfer-1"
        //         aria-selected="true"
        //         onClick={toggle}
        //         className={`modal-button-future`}
        //       >
        //         {leverage}x
        //       </div>
        //       {isModalOpen && (
        //         <div id="demo-modal" className="gift-card-modal">
        //           <div className="future-modal__content section-padding-custom">
        //             <h3>Leverage</h3>
        //             {/* <div className="leverage-section">{leverage}x</div> */}
        //             {/* <div className="mt-3 percent-container mb-5 d-flex flex-wrap"> */}
        //             {/*   {[1, 2, 5, 10, 25]?.map((leverage: number, index: number) => ( */}
        //             {/*     <span */}
        //             {/*       key={index} */}
        //             {/*       className="percent-btn col-3 mb-2" */}
        //             {/*       onClick={() => { */}
        //             {/*         modifyLeverage(leverage); */}
        //             {/*       }} */}
        //             {/*     > */}
        //             {/*       {leverage}x */}
        //             {/*     </span> */}
        //             {/*   ))} */}
        //             {/* </div> */}
        //             <select
        //               name="status"
        //               className="form-control h-50 ticketFilterBg mt-3 percent-container mb-5 d-flex flex-wrap"
        //               onChange={(e: any) => {
        //                 setLeverage(e.target.val);
        //               }}
        //             >
        //               {/* <option>{t(`Select leverage`)}</option> */}
        //               {Array.from({ length: 25 }).map((v, i)) => (
        //               <option value={v}>{v}</option>)}
        //             </select>
        //
        //             <div>
        //               <button
        //                 className="primary-btn w-98-p margin-2"
        //                 onClick={closeModal}
        //               >
        //                 Close
        //               </button>
        //             </div>
        //           </div>
        //         </div>
        //       )}
        //     </>
        //   );
        // };
        //
        // export default Leverage;

        import useTranslation from "next-translate/useTranslation";
        import React, { useEffect, useState } from "react";
        import { AiOutlineClose } from "react-icons/ai";
        import { toast } from "react-toastify";

        const Leverage = ({ leverage, setLeverage, dashboard }: any) => {
          const [isModalOpen, setIsModalOpen] = useState(false);
          const [leverages, setLeverages] = useState<any>(
            Array.from({ length: 25 }, (_, i) => i + 1)
          );
          const { t } = useTranslation("common");

          const toggle = () => {
            setIsModalOpen(!isModalOpen);
          };

          const closeModal = () => {
            setIsModalOpen(false);
          };
          const modifyLeverage = (value: number) => {
            setLeverage(value);
          };

          return (
            <>
              <div
                id=""
                data-toggle="pill"
                role="tab"
                aria-controls="pills-transfer-1"
                aria-selected="true"
                onClick={toggle}
                className={`modal-button-future`}
              >
                {leverage}x
              </div>
              {isModalOpen && (
                <div id="demo-modal" className="gift-card-modal">
                  <div className="future-modal__content section-padding-custom">
                    <h3>Leverage</h3>
                    <select
                      className="form-control tradex-border-primary-30 ticketFilterBg h-50 mt-3 mb-5"
                      value={leverage}
                      onChange={(e) => {
                        modifyLeverage(Number(e.target.value));
                      }}
                    >
                      {leverages.map((value: number, index: number) => (
                        <option key={index} value={value}>
                          {value}x
                        </option>
                      ))}
                    </select>

                    <div>
                      <button
                        className="primary-btn w-98-p margin-2"
                        onClick={closeModal}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          );
        };

        export default Leverage;
