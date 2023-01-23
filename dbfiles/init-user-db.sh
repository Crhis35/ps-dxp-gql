#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE USER user WITH PASSWORD 'admin';
    CREATE DATABASE ps-dxp-development;
    GRANT ALL PRIVILEGES ON DATABASE ps-dxp-development TO user;
EOSQL
