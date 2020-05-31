FROM ubuntu:18.04

RUN apt-get -qq update
RUN apt-get -qq install curl unzip
RUN curl -s "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
RUN unzip -q awscliv2.zip
RUN ./aws/install

RUN curl -sL https://deb.nodesource.com/setup_12.x  | bash -
RUN apt-get -qq install nodejs

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
