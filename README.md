# Payment
A test

## Before start
Please make sure you already installed these software
1. Redis
2. MongoDB
3. Node.js
4. Npm

Also, please update the config.[env].json with your config, the config setting is as below
```json
// config/config.dev.json
{
  "port": 3000, // Server port
  "db": {
    "url": "mongodb://payment:xyz123@ds151293.mlab.com:51293/payment" // Mongodb url
  },
  "redis": {
    "host": "127.0.0.1", // Redis Host
    "port": 6379, // Redis port
    "expireTime": 10 // Redis document expiry time
  },
  "paypal": { // Dummy Data
    "key": "test-key-paypal"
  },
  "braintree": { // Dummy Data
    "key": "test-key-braintree"
  }
}
```

## Start

```bash
// For Development
npm install
npm run dev
```
#### or
```bash
// For Production
npm install
npm i -g pm2
npm run build
pm2 start pm2.prod.config.json
```
## Directory
```
Payment
├── .next // next.js build directory
├── config // Config
│   ├── config.dev.json
│   ├── config.prod.json
│   └── index.ts
├── pages // Next.js page directory
├── server // Koa server
│   ├── controllers
│   ├── models
│   ├── services 
│   ├── types 
│   │   ├── enum.ts // enum
│   │   ├── global.d.ts // Override module interface
│   │   └── interface.ts // Common interfaces
│   ├── utils // utils function 
│   ├── index.ts // server start point
│   └──  server.ts // server class
├── package.json
├── tsconfig.json // Typescript config
├── gulpfile.js // Gulp task
├── pm2.prod.config.json // PM2 config
└── next.config.js // Next config for bundle
```

## Data Structure

### - Payment record
```
{
    reference: string; // local payment reference
    status: PaymentStatus; // -1: Failed, 0: Pending, 1: Success
    paymentGateway: PaymentGatewayName; // "HKD", "USD", "AUD", "EUR", "JPY", "CNY"
    paymentReference: string; // payment gateway reference
    paymentGatewayResponse: any; // Since the response is different in different payments
    customer: {
        name: string;
        phone: string;
    };
    payment: {
        amount: number;
        currency: Currency;
    };
}
```

### - Api response 
```
// Success (status = 200...)
{
    data: { 
        .... // The response data
    }
}

// Fail (status = 400, 404 ...)
{
    message: string // Error message
    data: {
        .... // The response data
    }
}
```

## Api postman collection
https://www.getpostman.com/collections/797b25d28cbaffd14883

## Tech stack 
Backend - Koa
Frontend - React
Database - MongoDB
Cache - Redis
Language - Typescript

Libarary 
- koa-decorators-ts (Using for decorate route)
- JSON Schema (Check request body type)
- axios (Request lib)
- pino (logger)
- gulp (build task)
- pm2 (Project manager)
