import Head from "next/head";
import React from "react";

export const SEO = ({ children, seoData }: any) => {
  return (
    <div>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <title>Btbex</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="title"
          property="og:title"
          // content={seoData?.seo_social_title}
          content="Btbex"
        />
        <meta
          name="description"
          property="og:description"
          content={seoData?.seo_meta_description}
        />
        <meta
          name="keywords"
          property="og:keywords"
          content={seoData?.seo_meta_keywords}
        />
        <meta name="image" property="og:image" content={seoData?.seo_image} />
      </Head>
      {children}
    </div>
  );
};
