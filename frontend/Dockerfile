FROM rust:1.89-busybox

USER root

RUN apt-get update -y
RUN apt-get install -y git

RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
RUN apt-get install -y nodejs
RUN corepack enable

RUN rustup component add clippy
RUN rustup component add rustfmt
RUN cargo install wasm-pack

WORKDIR /usr/workspace/frontend

VOLUME ./frontend:/usr/workspace/frontend