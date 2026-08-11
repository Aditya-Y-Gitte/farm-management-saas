# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy shared kernel
COPY shared/FarmManagement.SharedKernel/SharedKernel.csproj shared/FarmManagement.SharedKernel/
# Copy service
COPY services/auth-service/AuthService.csproj services/auth-service/

# Restore
WORKDIR /src/services/auth-service
RUN dotnet restore

# Copy everything and build
WORKDIR /src
COPY shared/ shared/
COPY services/auth-service/ services/auth-service/

WORKDIR /src/services/auth-service
RUN dotnet publish -c Release -o /app/publish --no-restore

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

# Run as non-root
RUN groupadd -r appuser && useradd -r -g appuser appuser
USER appuser

COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:5003
EXPOSE 5003

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:5003/health || exit 1

ENTRYPOINT ["dotnet", "AuthService.dll"]
