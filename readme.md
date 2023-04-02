## Getting Started Locally
Update DEV_BASEURL field of the env field in next.config.ts
First, run the development server:

```bash
npm i
npm run dev
# or
cp sampleenv .env
yarn install
yarn dev
```
update the .env file ans set NODE_ENV to "development"

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Getting Started Staging
Update STAGING_BASEURL field of the env field in next.config.ts
First, run the development server:

```bash
npm i
npm run dev
# or
cp sampleenv .env
yarn install
yarn dev
```
update the .env file ans set NODE_ENV to "staging"
Push code to staging branch to deploy to prod environment


## Getting Started Production
Update PROD_BASEURL field of the env field in next.config.ts
First, run the development server:

```bash
npm i
npm run dev
# or
cp sampleenv .env
yarn install
yarn dev
```
update the .env file ans set NODE_ENV to "production"
Push code to prod branch to deploy to prod environment



