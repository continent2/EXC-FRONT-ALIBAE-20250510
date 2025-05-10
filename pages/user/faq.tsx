import BottomLeftInnerPageCircle from "components/BottomLeftInnerPageCircle";
import BottomRigtInnerPageCircle from "components/BottomRigtInnerPageCircle";
import Footer from "components/common/footer";
import StartTrending from "components/StartTrending";
import TopLeftInnerPageCircle from "components/TopLeftInnerPageCircle";
import TopRightInnerPageCircle from "components/TopRightInnerPageCircle";
import type { GetServerSideProps, NextPage } from "next";
import useTranslation from "next-translate/useTranslation";
import { useState } from "react";
import { getFaqList } from "service/faq";
import { customPage, landingPage } from "service/landing-page";

const questions = [
  "",
  "What is Btbex Exchange ?",
  "How i place a order ?",
  "How i make a withdrawal ?",
  "What about the deposit process?",
];
const answers = [
  "BTBEX Exchange is the abbreviation for Alibaba Exchange",
  "The coin exchange is currently the USDT market",
  "There are two withdrawal methods",
  "There are two ways to deposit",
];
let faqs = [
  {
    question: "What is Btbex Exchange?",
    keyword: "BTBEX Exchange is the abbreviation for Alibaba Exchange",
  },
  {
    question: "How i place a order?",
    keyword: "The coin exchange is currently the USDT market",
  },
  {
    question: "How i make a withdrawal?",
    keyword: "There are two withdrawal methods",
  },
  {
    question: "What about the deposit process?",
    keyword: "There are two ways to deposit",
  },
];
// let faqs = []
// for ( let idx = 0 ; idx < questions?.length ; idx ++ ){
//   faqs.push ( { question : questions [ idx ] , keyword : answers[ idx ] } )
// }
// const Index: NextPage = ({ faq }: any) => {
const Index: NextPage = ({ faq }: any) => {
  const { t } = useTranslation("common");
  const [active, setActive] = useState<number>(1);
  const handleActive = (index: number) => {
    if (index === active) {
      setActive(0);
    } else {
      setActive(index);
    }
  };
  return (
    <>
      <div className={` tradex-relative`}>
        <section className="tradex-pt-[50px] tradex-relative">
          <TopLeftInnerPageCircle />
          <TopRightInnerPageCircle />
          <div className=" tradex-container tradex-relative tradex-z-10 tradex-space-y-16">
            <div className=" tradex-flex tradex-gap-6 tradex-items-center">
              <h2 className="!tradex-text-title tradex-text-3xl sm:tradex-text-[40px] sm:tradex-leading-[48px] tradex-font-bold tradex-text-nowrap">
                {t("Frequently Asked Questions")}
              </h2>
              <hr className=" tradex-w-full tradex-bg-background-primary" />
            </div>
            <div className=" tradex-grid md:tradex-grid-cols-2 tradex-gap-6">
              <div>
                <img src="/faq_default_image.png" alt="faq-image" />
              </div>
              <div className="accordion" id="accordionExample">
                {/* {faq?.data?.map((item: any, index: number) => ( */}
                {faqs.map((item: any, index: number) => (
                  <div key={`faq${index}`} className="">
                    <div className="card">
                      <div
                        className="card-header"
                        id="headingOne"
                        onClick={() => handleActive(index + 1)}
                      >
                        <h5 className="mb-0 header-align">
                          <button
                            className="btn btn-link collapsed"
                            data-toggle="collapse"
                            data-target={`#collapseOne1${index + 1}`}
                            aria-expanded="true"
                            aria-controls="collapseOne"
                          >
                            {/* {  item.  } */}
                            {t(item.question)}
                          </button>
                          <i
                            className={`fas ${
                              active === index + 1
                                ? "fa-caret-up"
                                : "fa-caret-down"
                            } mright-5`}
                          ></i>
                        </h5>
                      </div>

                      <div
                        id={`collapseOne1${index + 1}`}
                        className={`collapse ${index + 1 === 1 && "show"}`}
                        aria-labelledby="headingOne"
                        data-parent="#accordionExample"
                      >
                        <div className="card-body">{t(item.keyword)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        <StartTrending />
        <BottomLeftInnerPageCircle />
        <BottomRigtInnerPageCircle />
      </div>

      <Footer />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  const { data: faqs } = await getFaqList();
  return {
    props: {
      faq: faqs,
    },
  };
};

export default Index;
