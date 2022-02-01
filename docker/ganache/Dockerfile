FROM trufflesuite/ganache-cli:latest

COPY ganache_with_accounts.sh /app/

RUN apk add --no-cache bash

ENTRYPOINT bash ganache_with_accounts.sh
