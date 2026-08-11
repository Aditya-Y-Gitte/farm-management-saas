# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY shared/FarmManagement.SharedKernel/SharedKernel.csproj shared/FarmManagement.SharedKernel/
COPY services/catalog-api/CatalogApi.csproj services/catalog-api/

WORKDIR /src/services/catalog-api
RUN dotnet restore

WORKDIR /src
COPY shared/ shared/
COPY services/catalog-api/ services/catalog-api/

WORKDIR /src/services/catalog-api
RUN dotnet publish -c Release -o /app/publish --no-restore

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

RUN groupadd -r appuser && useradd -r -g appuser appuser
USER appuser

COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:5001
EXPOSE 5001

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:5001/health || exit 1

ENTRYPOINT ["dotnet", "CatalogApi.dll"]
