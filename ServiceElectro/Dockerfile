FROM maven:3.8.3-openjdk-17 AS build
COPY . .
RUN mvn clean install

FROM eclipse-temurin:17-jdk
COPY --from=build /ServiceElectro-0.0.1-SNAPSHOT.jar demo.jar
EXPOSE 9090
ENTRYPOINT ["JAVA","-jar","demo.jar"]