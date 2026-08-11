# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY shared/FarmManagement.SharedKernel/SharedKernel.csproj shared/FarmManagement.SharedKernel/
COPY services/api-gateway/ApiGateway.csproj services/api-gateway/

WORKDIR /src/services/api-gateway
RUN dotnet restore

WORKDIR /src
COPY shared/ shared/
COPY services/api-gateway/ services/api-gateway/

WORKDIR /src/services/api-gateway
RUN dotnet publish -c Release -o /app/publish --no-restore

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

RUN groupadd -r appuser && useradd -r -g appuser appuser
USER appuser

COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:5000
EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

ENTRYPOINT ["dotnet", "ApiGateway.dll"]
