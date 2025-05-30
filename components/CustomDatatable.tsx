import SectionLoading from "components/common/SectionLoading";
import CustomPagination from "components/Pagination/CustomPagination";
import useTranslation from "next-translate/useTranslation";
import React, { useMemo } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { useTable, useSortBy, useGlobalFilter } from "react-table";
import { NoItemFound } from "./NoItemFound/NoItemFound";
import {useRouter} from "next/router"

// function getnumberwithcommas(x:any) {   return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); }

const toFixedFix = function (n : number , prec : number ) {
  // Fix for IE parseFloat(0.55).toFixed(0) = 0;
  var k = Math.pow(10, prec);
  return Math.round(n * k) / k;
} 
function number_format(number:string ,    decimals: number) { // , dec_point:string, thousands_sep:
  let n = !isFinite(+number) ? 0 : +number 
  let    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals) 
  let sep = ',' // (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
  let dec = '.' // (typeof dec_point === 'undefined') ? '.' : dec_point,
  let s = (prec ? toFixedFix(n, prec) : Math.round(n)).toString().split('.') 
  if (s[0].length > 3) {
      s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || '').length < prec) {
      s[1] = s[1] || '';
      s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
}
const CustomDatatable = ({
  columns,
  data,
  setSelectedLimit,
  selectedLimit,
  search,
  setSearch,
  dataNotFoundText,
  processing,
  verticalAlignData = "middle",
  isOverflow = false,
  isSortEnable = true,
  isSearchable = true,
}: any) => {
  const router = useRouter()
  const dataColumns = useMemo(() => columns, [columns]);
  const tableData = useMemo(() => data, [data]);
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    //@ts-ignore
    setGlobalFilter,
  } = useTable(
    {
      columns: dataColumns,
      data: tableData,
    },
    useGlobalFilter,
    useSortBy
  );
  const { t } = useTranslation("common");

  // const findthelastindexofdecimal = ( strofnumber : string ) : number =>{
  //   const regexp = /\..*(\d)$/
  //   var matches = strofnumber .match(regexp );
  //   if (!matches) { return 0 }
  //   else { return matches.index || 0 }
  // }
  const findthelastindexofdecimal = ( strofnumber  : string ) : number =>{
    const numofnumber = +strofnumber
    strofnumber = ''+numofnumber
    const      d = strofnumber.indexOf('.') + 1;
    return !d ? 0 : strofnumber.length - d;  
  }
  
  return (
    <div className="overflow-x-auto">
      <div className=" tradex-flex tradex-justify-between tradex-items-center tradex-gap-6">
        {isSortEnable && (
          <div className="dataTables_length" id="assetBalances_length">
            <label className="">
              {t("Show")}
              <select
                name="assetBalances_length"
                aria-controls="assetBalances"
                className="h-auto text-14"
                placeholder="10"
                onChange={(e) => {
                  setSelectedLimit(e.target.value);
                }}
                value={selectedLimit}
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </label>
          </div>
        )}

        {isSearchable && (
          <div id="table_filter" className="dataTables_filter_class">
            <label className=" tradex-flex tradex-items-center">
              <AiOutlineSearch />
              <input
                type="search"
                className="data_table_input bg-transparent"
                aria-controls="table"
                placeholder="Search..."
                value={search || ""}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>
          </div>
        )}
      </div>
      {processing ? (
        <SectionLoading />
      ) : (
        <>
          <table
            {...getTableProps()}
            className="tradex-w-full tradex-bg-background-main tradex-rounded-lg tradex-overflow-hidden  tradex-border-separate tradex-border-spacing-y-2"
          >
            <thead>
              {headerGroups.map((headerGroup, index) => (
                <tr
                  {...headerGroup.getHeaderGroupProps()}
                  key={index}
                  className=" tradex-bg-background-primary "
                >
                  {headerGroup.headers.map((column: any, key: number) => (
                    <th
                      key={key}
                      {...column.getHeaderProps(column.getSortByToggleProps())} // Add sorting props to the column header
                      className=" first:tradex-rounded-tl-lg last:tradex-rounded-tr-lg tradex-min-w-[200px] tradex-py-3 tradex-px-4 first:tradex-pl-9 last:tradex-pr-9 tradex-text-nowrap tradex-text-base tradex-leading-5 !tradex-text-title tradex-font-semibold tradex-h-[60px]"
                    >
                      {column.render("Header")}
                      <span>
                        {column.isSorted ? (
                          column.isSortedDesc ? (
                            <i className="fa fa-caret-down" />
                          ) : (
                            <i className="fa fa-caret-up" />
                          )
                        ) : (
                          ""
                        )}
                      </span>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.length > 0 && (
                <>
                  {rows.map((row, index) => { // console.log ( row )
                    prepareRow(row);
                    return (
                      <tr
                        {...row.getRowProps()}
                        key={index}
                        className="custom-datatable-row hover:!tradex-bg-tradex-bg-current/80 !tradex-cursor-pointer tradex-group hover:tradex-shadow-[2px_2px_37px_0px_#0000000D]"
                        onClick={()=> router.replace(`/exchange/dashboard?coin_pair=${((row?.original as any).coin_type)}_USDT`)}
                      >
                        {row.cells.map((cell, key) => { // console.log ( { cell } )

if ( key == 1 && Number.isFinite(+cell.value)  ) {
//  cell.value = '$'+   (+(+cell.value).toFixed( findthelastindexofdecimal( cell.value) ) ).toLocaleString()
//  cell.value =    (+(+cell.value).toFixed( findthelastindexofdecimal( cell.value) ) ) // .toLocaleString()
  let tmp = ((+cell.value).toFixed( findthelastindexofdecimal( cell.value) ) )
  // cell.value =    String( tmp )    .replace('.', ',')    .replace(/\d(?=(?:(?:\d{3})+),)/g, match => `${ match }.`)
//  cell.value =    tmp.replace('.', ',')    .replace(/\d(?=(?:(?:\d{3})+),)/g, match => `${ match }.`)
  // cell.value =    tmp    .replace(/\d(?=(?:(?:\d{3})+),)/g, match => `${ match }.`)
  cell.value = number_format ( tmp , findthelastindexofdecimal( cell.value) )
}
else {}
                          return (
                          <td
                            //@ts-ignore
                            key={key}
                            {...cell.getCellProps()}
                            style={{
                              verticalAlign: verticalAlignData,
                            }}
                            className="tradex-min-w-[200px] tradex-h-11 first:tradex-pl-9 last:tradex-pr-9"
                          >
                            <div
                              className={`${
                                index + 1 != rows?.length && "tradex-border-b"
                              } ${isOverflow ? "" : "overflow-hidden"} ${
                                key == 0 && "tradex-pl-0"
                              } ${
                                key + 1 == row.cells.length && "tradex-pr-0"
                              } tradex-flex tradex-items-center tradex-h-full group-hover:tradex-border-b-0 tradex-border-background-primary                                
                              tradex-py-3 tradex-px-4 tradex-text-nowrap tradex-text-ellipsis tradex-min-h-11                              
                              `                              
                            }
                              style={ key == 1 ?  {fontSize: '16px'} : // {}
                                ( key == 2 && Number.isFinite( +cell.value) && +cell.value>= 0 ? {color:'green' ,} : {} )  //  fontWeight: 'bold' 
                            }
                            >
                              {/* {  cell.render("Cell") } */}
                              { key == 1 && Number.isFinite(+ (''+cell.value).replace (',', '') ) ? 
                                '$'+ ( (cell.value) ) :
                                // '$'+ ( (+cell.value).toLocaleString() ) :
//                                (+(+cell.value).toFixed( findthelastindexofdecimal( cell.value) ) ).toLocaleString()
//                                  getnumberwithcommas ((+cell.value).toFixed( findthelastindexofdecimal( cell.value) ) ) 
//                                 :  
                                ( // key == 2 && Number.isFinite ( cell.value ) && +cell.value > 0 ?  '+' + cell.value
//                                  key == 2 && ( /^(\d+|(\.\d+))(\.\d+)?%$/ ) .test( cell.value ) && +cell.value.substr(0,cell.value.length-2 ) > 0 ? '+' + cell.value //^\d+(\.\d+)?%$/.test ( cell.value ) && 
                                  key == 2 && +cell.value > 0 ? '+' + (+cell.value).toFixed( 2 ) + '%' //^\d+(\.\d+)?%$/.test ( cell.value ) && 
                                  : 
                                  cell.render("Cell")
                                )  
                                }
                            </div>
                          </td>
                        ) }
                        )}
                      </tr>
                    );
                  })}
                </>
              )}
            </tbody>
          </table>
          {rows.length == 0 && <NoItemFound />}
        </>
      )}
    </div>
  );
};

export default CustomDatatable;
