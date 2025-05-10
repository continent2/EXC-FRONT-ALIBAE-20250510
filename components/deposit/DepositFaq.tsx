import { FAQ_TYPE_DEPOSIT } from "helpers/core-constants";
import useTranslation from "next-translate/useTranslation";
import React from "react";
// const questions = [ '' ,
//   // "What is Btbex Exchange ?"   ,
//   // "How i place a order ?"  ,
//   // "How i make a withdrawal ?"  ,
//   "What about the deposit process ?"
// ]
// const answers = [
//   // "BTBEX Exchange is the abbreviation for Alibaba Exchange",
//   // "The coin exchange is currently the USDT market",
//   // "There are two withdrawal methods",
//   "There are two ways to deposit"
// ]
let faqs__ = [
  // { question : "What is Btbex Exchange ?" , key word : "BTBEX Exchange is the abbreviation for Alibaba Exchange" } ,
  // { question : "How i place a order ?" , keywo rd : "The coin exchange is currently the USDT market" },
  // { question : "How i make a withdrawal ?" , keywo rd : "There are two withdrawal methods" },
  {
    question: "What about the deposit process?",
    keyword: "There are two ways to deposit",
    faq_type_id: 2,
    id: 6,
  },
];
// for ( let idx = 0 ; idx < questions?.length ; idx ++ ){//   faqs.push ( { question : questions [ idx ] , keyw ord : answers[ idx ] } )// }
const DepositFaq = ({ faqs }: any) => {
  //  const DepositFaq = () => {   // { faqs }: any
  const { t } = useTranslation("common");
  return (
    <div className="m-3">
      <div id="accordion">
        <h4>{t("FAQ")}</h4>
        {faqs__.map(
          (faq: any) =>
            // ( true || faq.faq_type_id === FAQ_TYPE_DEPOSIT ) && (
            true && (
              <div className="faq-body">
                <div className="faq-head" id={"headingOne" + faq.id}>
                  <h5 className="mb-0">
                    <button
                      className="btn "
                      data-toggle="collapse"
                      data-target={"#collapseOne" + faq.id}
                      aria-expanded="true"
                      aria-controls="collapseOne"
                    >
                      {/* { t( faq.question ) } */}
                      {t(faq.question)}
                    </button>
                  </h5>
                </div>
                <div
                  id={"collapseOne" + faq.id}
                  className="collapse "
                  aria-labelledby={"headingOne" + faq.id}
                  data-parent="#accordion"
                >
                  <div className="faq-body">
                    {/* { t( faq.keyword ) } */}
                    {t("There are two ways to deposit")}
                  </div>
                </div>
              </div>
            )
        )}
      </div>
    </div>
  );
};

export default DepositFaq;
