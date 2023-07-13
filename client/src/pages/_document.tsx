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
         
        </body>
      </Html>
    );
  }
}

export default MyDocument;
