FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ["services/finance-api/FinanceApi.csproj", "services/finance-api/"]
COPY ["shared/FarmManagement.SharedKernel/SharedKernel.csproj", "shared/FarmManagement.SharedKernel/"]
RUN dotnet restore "services/finance-api/FinanceApi.csproj"
COPY . .
WORKDIR "/src/services/finance-api"
RUN dotnet build "FinanceApi.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "FinanceApi.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "FinanceApi.dll"]
