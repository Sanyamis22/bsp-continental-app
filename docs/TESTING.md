# Testing

| Layer | Command | Needs |
|-------|---------|-------|
| Types | `npm run typecheck` | nothing |
| Lint | `npm run lint` | nothing |
| Unit + route authz | `npm test` | nothing (services/guards are mocked) |
| API integration (51 checks: authz, ownership, OTP, pricing, payments) | `bash tests/integration/api-regression.sh` | running app + throwaway Mongo |

## Running the integration suite

```bash
docker run -d --name bsp-test-mongo -p 27099:27017 mongo:7
export MONGODB_URI=mongodb://localhost:27099/bsptest NEXTAUTH_SECRET=<32+ chars> NEXTAUTH_URL=http://localhost:3000 \
       JWT_SECRET=<32+ chars> ADMIN_USERNAME=admin@test.com ADMIN_PASSWORD=<pw> RAZORPAY_KEY_SECRET=x \
       RESILIO_API_TOKEN=x FEATURE_CHAT=true FEATURE_CIBIL=true
npm run build && npm start &
BASE_URL=localhost:3000 MONGO_CONTAINER=bsp-test-mongo bash tests/integration/api-regression.sh
```

`RESILIO_API_TOKEN` must be a dummy: OTP codes are seeded straight into Mongo, so no WhatsApp message is needed.
Never point `MONGODB_URI` at production: the script deletes users, requests and notifications.

## Not automated

Browser end-to-end (login, create a request, admin approves) and the Razorpay checkout need real keys and a browser; check them manually before a release.
