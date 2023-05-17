import Document, { Head, Html, Main, NextScript } from 'next/document';

import { AppConfig } from '@/components/utils/AppConfig';
// Need to create a custom _document because i18n support is not compatible with `next export`.
class MyDocument extends Document {
  // eslint-disable-next-line class-methods-use-this
  render() {
    return (
      <Html lang={AppConfig.locale}>
        <Head>
          <link rel="icon" type="image/png" href="/logo/icon2.png" />
        </Head>
        <body>
          <Main />
          <NextScript />
          <img
            className="fixed bottom-36 right-0 -z-10 h-1/2 rounded-full p-8 opacity-25 sm:opacity-100"
            src="/logo/logorr.png"
            alt="RoadRunner Logo"
          />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
