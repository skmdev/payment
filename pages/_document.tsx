import Document, { Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  render() {
    return (
      <html>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta charSet="utf-8" />
        </Head>
        <body style={{ maxWidth: '700px', margin: '0 auto' }}>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
