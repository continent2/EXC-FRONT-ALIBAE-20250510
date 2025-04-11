import { Html, Head, Main, NextScript } from "next/document";
export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@300..900&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="/style/bootstrap.min.css" />
        <link rel="stylesheet" href="/style/meanmenu.min.css" />
        <link rel="stylesheet" href="/style/metisMenu.min.css" />
        <link rel="stylesheet" href="/style/jquery.scrollbar.css" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
          integrity="sha512-9usAa10IRO0HhonpyAIVpjrylPvoDwiPUiKdWk5t3PyolY1cOd4DSE0Ga+ri4AuTroPR5aQvXU9xC6qOPnzFeg=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        {/* <link rel="shortcut icon" href="../fav.png" /> */}
        <script src="/static/datafeeds/udf/dist/bundle.js" />
      </Head>
      <body className=" tradex-overflow-x-hidden !tradex-bg-background-main">
        <Main />
        <NextScript />
        <script src="/js/jquery-3.6.0.min.js" />
        <script src="/js/bootstrap.bundle.min.js" />
        <script src="/js/jquery.meanmenu.js" />
        <script src="/js/metisMenu.min.js" />
        <script src="/js/jquery.scrollbar.min.js" />
        <script src="/js/main.js" />
      </body>
    </Html>
  );
}
