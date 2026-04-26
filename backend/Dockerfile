FROM rust:1.92.0-alpine AS builder

WORKDIR /usr/workspace/src

COPY . /usr/workspace/

RUN cargo build --release --target x86_64-unknown-linux-musl --out-dir /usr/workspace/target/release

FROM rust:1.92.0-alpine

COPY --from=builder /usr/workspace/target/release/backend ./

CMD ["./backend"]