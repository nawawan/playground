FROM rust:1.92.0-alpine AS builder

WORKDIR /usr/workspace/src

COPY . /usr/workspace/

ENV CARGO_TARGET_DIR=/usr/workspace/target

RUN cargo build --release

FROM alpine:3.20

COPY --from=builder /usr/workspace/target/release/backend ./

CMD ["./backend"]