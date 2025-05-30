import { SSRAuthCheck } from "middlewares/ssr-authentication-check";
import type { GetServerSideProps, NextPage } from "next";
import React, { useEffect, useState } from "react";

import { SearchObjectArrayFuesJS } from "state/actions/wallet";
import Loading from "components/common/SectionLoading";
import Link from "next/link";
import useTranslation from "next-translate/useTranslation";
import { useSelector } from "react-redux";
import { RootState } from "state/store";
import Footer from "components/common/footer";
import { getWalletsAction } from "state/actions/p2p";
import { AiOutlineSend } from "react-icons/ai";
import { BsWallet2 } from "react-icons/bs";
import { P2pTopBar } from "components/P2P/P2pHome/TopBar";
import SectionLoading from "components/common/SectionLoading";
import CustomDataTable from "components/Datatable";
import WalletOverviewSidebar from "layout/WalletOverviewSidebar";
import WalletOverviewHeader from "components/wallet-overview/WalletOverviewHeader";
import PlaceTopLeft from "components/gradient/placeTopLeft";
import PlaceBottomRight from "components/gradient/placeBottomRight";
const MyWallet: NextPage = () => {
  const { t } = useTranslation("common");
  const [search, setSearch] = useState<any>("");
  const [walletList, setWalletList] = useState<any>([]);
  const [Changeable, setChangeable] = useState<any[]>([]);
  const [processing, setProcessing] = useState<boolean>(false);
  const [selectedLimit, setSelectedLimit] = useState<any>("10");

  const columns = [
    {
      Header: t("Asset"),

      Cell: ({ row }: any) => (
        <div className="asset d-flex align-items-center gap-10">
          <div className="h-35 w-35 overflow-hidden rounded-50p">
            <img
              className="asset-icon"
              src={row.original.coin_icon || "/bitcoin.png"}
              alt=""
              width={35}
              height={35}
            />
          </div>
          <div>
            <p className="asset-name font-bold">{row.original?.coin_type}</p>
            <p className="asset-name">{row.original?.name}</p>
          </div>
        </div>
      ),
    },
    {
      Header: t("Available Balance"),
      accessor: "balance",
      Cell: ({ cell }: any) => (
        <div className="blance-text">
          <span className="blance">{parseFloat(cell?.value).toFixed(8)}</span>
        </div>
      ),
    },
    {
      Header: t("Action"),
      Cell: ({ row }: any) => (
        <div className="active-link">
          <ul>
            <div className="active-link">
              <ul>
                <Link href={`/p2p/exchange/1/${row.original?.coin_type}`}>
                  <li className="toolTip relative cursor-pointer" title="Send">
                    <AiOutlineSend />
                  </li>
                </Link>
                <Link href={`/p2p/exchange/2/${row.original?.coin_type}`}>
                  <li
                    className="toolTip relative cursor-pointer"
                    title="Recieve"
                  >
                    <BsWallet2 />
                  </li>
                </Link>
              </ul>
            </div>
          </ul>
        </div>
      ),
    },
  ];

  const getWalletLists = async () => {
    setProcessing(true);
    const response: any = await getWalletsAction(selectedLimit, 1, search);
    setWalletList(response?.data);
    setChangeable(response?.data?.data);
    setProcessing(false);
  };

  const LinkTopaginationString = async (page: any) => {
    const url = page.url.split("?")[1];
    const number = url.split("=")[1];
    const response: any = await getWalletsAction(selectedLimit, number, search);
    setWalletList(response?.data);
    setChangeable(response?.data?.data);
  };

  useEffect(() => {
    getWalletLists();
    return () => {
      setWalletList(null);
    };
  }, [selectedLimit, search]);

  return (
    <>
      <div className="page-wrap">
        {/* <WalletOverviewSidebar /> */}
        <div className="page-main-content pt-0">
          <div className="">
            <WalletOverviewHeader title={`P2P Wallet`} />
            {/* <PlaceTopLeft />
            <PlaceBottomRight /> */}
            <div className=" container-4xl">
              <div className="-tradex-mt-[60px] tradex-mb-10">
                <div className="tradex-shadow-[0px_1px_4px_0px_var(--border-color-1)] tradex-relative tradex-z-10 tradex-rounded-md tradex-bg-background-card tradex-px-4 tradex-py-4 sm:tradex-px-8 sm:tradex-py-8">
                  <div className="tableScroll pr-0">
                    <div className=" table-responsive">
                      <CustomDataTable
                        columns={columns}
                        data={Changeable}
                        selectedLimit={selectedLimit}
                        setSelectedLimit={setSelectedLimit}
                        search={search}
                        setSearch={setSearch}
                        processing={processing}
                        verticalAlignData={`middle`}
                      />
                      <div
                        className="pagination-wrapper !tradex-pb-2"
                        id="assetBalances_paginate"
                      >
                        <span>
                          {walletList?.links?.map((link: any, index: number) =>
                            link.label === "&laquo; Previous" ? (
                              <a
                                className="paginate-button"
                                onClick={() => LinkTopaginationString(link)}
                                key={index}
                              >
                                <i className="fa fa-angle-left"></i>
                              </a>
                            ) : link.label === "Next &raquo;" ? (
                              <a
                                className="paginate-button"
                                onClick={() => LinkTopaginationString(link)}
                                key={index}
                              >
                                <i className="fa fa-angle-right"></i>
                              </a>
                            ) : (
                              <a
                                className={`paginate_button paginate-number ${
                                  link.active === true && "text-warning"
                                }`}
                                aria-controls="assetBalances"
                                data-dt-idx="1"
                                onClick={() => LinkTopaginationString(link)}
                                key={index}
                              >
                                {link.label}
                              </a>
                            )
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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

export default MyWallet;
