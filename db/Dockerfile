FROM openjdk:8-jdk

# Build time arguments
ARG version=8.7.2
ARG edition=free

ENV GRAPHDB_PARENT_DIR=/opt/graphdb
ENV GRAPHDB_HOME=${GRAPHDB_PARENT_DIR}/home

ENV GRAPHDB_INSTALL_DIR=${GRAPHDB_PARENT_DIR}/dist

WORKDIR /tmp

RUN curl -fsSL "http://go.pardot.com/e/45622/38-graphdb-free-8-7-2-dist-zip/67bb36/1374940083" > \
    graphdb-${edition}-${version}.zip && \
    mkdir -p ${GRAPHDB_PARENT_DIR} && \
    cd ${GRAPHDB_PARENT_DIR} && \
    unzip /tmp/graphdb-${edition}-${version}.zip && \
    rm /tmp/graphdb-${edition}-${version}.zip && \
    mv graphdb-${edition}-${version} dist && \
    mkdir -p ${GRAPHDB_HOME}

ENV PATH=${GRAPHDB_INSTALL_DIR}/bin:$PATH

CMD ["-Dgraphdb.home=/opt/graphdb/home"]
CMD ["-Dgraphdb.connector.port=$PORT"]

ENTRYPOINT ["/opt/graphdb/dist/bin/graphdb"]

EXPOSE 7200
