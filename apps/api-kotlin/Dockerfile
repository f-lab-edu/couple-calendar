# syntax=docker/dockerfile:1

# ---- build stage ----
# JDK 21 (build.gradle.kts toolchain 과 일치 → Gradle 이 컨테이너 JDK 를 그대로 사용)
FROM eclipse-temurin:21-jdk AS build
WORKDIR /workspace

# 1) 래퍼 + 빌드 스크립트만 먼저 복사해서 의존성 레이어를 캐시한다.
COPY gradlew ./
COPY gradle ./gradle
COPY build.gradle.kts settings.gradle.kts ./
RUN chmod +x gradlew \
 && ./gradlew --no-daemon dependencies > /dev/null 2>&1 || true

# 2) 소스 복사 후 실행 가능한 boot jar 빌드
COPY src ./src
RUN ./gradlew --no-daemon clean bootJar

# ---- runtime stage ----
# JRE 만 담아 이미지 경량화
FROM eclipse-temurin:21-jre AS runtime
WORKDIR /app

# 비루트 사용자로 실행
RUN useradd -r -u 1001 appuser
COPY --from=build /workspace/build/libs/*.jar app.jar
USER appuser

# Cloud Run 은 PORT 환경변수를 주입한다(기본 8080). application.yml 의 ${PORT:8080} 가 받는다.
ENV JAVA_OPTS=""
EXPOSE 8080
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /app/app.jar"]
