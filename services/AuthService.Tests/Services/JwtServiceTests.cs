using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Threading.Tasks;
using AuthService.Data;
using AuthService.Models;
using AuthService.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace AuthService.Tests.Services
{
    public class JwtServiceTests : IDisposable
    {
        private readonly AuthDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly JwtService _jwtService;

        public JwtServiceTests()
        {
            var options = new DbContextOptionsBuilder<AuthDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            
            _context = new AuthDbContext(options);

            var inMemorySettings = new Dictionary<string, string> {
                {"Jwt:SecretKey", "SuperSecretKeyForTestingWhichNeedsToBeAtLeast32Bytes!"},
                {"Jwt:Issuer", "TestIssuer"},
                {"Jwt:Audience", "TestAudience"},
                {"Jwt:AccessTokenExpiryMinutes", "15"},
                {"Jwt:RefreshTokenExpiryDays", "7"}
            };

            _configuration = new ConfigurationBuilder()
                .AddInMemoryCollection(inMemorySettings)
                .Build();

            var mockLogger = new Mock<ILogger<JwtService>>();

            _jwtService = new JwtService(_configuration, _context, mockLogger.Object);
        }

        public void Dispose()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }

        [Fact]
        public void GenerateAccessToken_ReturnsValidJwtWithExpectedClaims()
        {
            // Arrange
            var user = new User
            {
                Id = Guid.NewGuid(),
                Email = "test@example.com",
                DisplayName = "Test User",
                TenantId = "tenant-123",
                Role = "admin"
            };

            // Act
            var tokenString = _jwtService.GenerateAccessToken(user);

            // Assert
            Assert.NotNull(tokenString);
            
            var handler = new JwtSecurityTokenHandler();
            var jwtToken = handler.ReadJwtToken(tokenString);

            Assert.Equal("TestIssuer", jwtToken.Issuer);
            Assert.Contains(jwtToken.Claims, c => c.Type == JwtRegisteredClaimNames.Sub && c.Value == user.Id.ToString());
            Assert.Contains(jwtToken.Claims, c => c.Type == JwtRegisteredClaimNames.Email && c.Value == user.Email);
            Assert.Contains(jwtToken.Claims, c => c.Type == JwtRegisteredClaimNames.Name && c.Value == user.DisplayName);
            Assert.Contains(jwtToken.Claims, c => c.Type == "tenant_id" && c.Value == user.TenantId);
            Assert.Contains(jwtToken.Claims, c => c.Type == "role" && c.Value == user.Role);
        }

        [Fact]
        public async Task GenerateRefreshTokenAsync_CreatesTokenAndPersists()
        {
            // Arrange
            var user = new User { Id = Guid.NewGuid(), Email = "test@example.com", TenantId = "tenant-123" };
            
            // Act
            var tokenString = await _jwtService.GenerateRefreshTokenAsync(user);

            // Assert
            Assert.NotNull(tokenString);
            Assert.NotEmpty(tokenString);

            var storedToken = await _context.RefreshTokens.FirstOrDefaultAsync(rt => rt.UserId == user.Id);
            Assert.NotNull(storedToken);
            Assert.False(storedToken.IsRevoked);
            Assert.True(storedToken.ExpiresAt > DateTime.UtcNow);
        }

        [Fact]
        public async Task RefreshTokensAsync_ValidToken_RotatesSuccessfully()
        {
            // Arrange
            var user = new User { Id = Guid.NewGuid(), Email = "test@example.com", TenantId = "tenant-123" };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var originalToken = await _jwtService.GenerateRefreshTokenAsync(user);

            // Act
            var result = await _jwtService.RefreshTokensAsync(originalToken);

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(result.Value.accessToken);
            Assert.NotNull(result.Value.refreshToken);
            Assert.NotEqual(originalToken, result.Value.refreshToken);

            // Verify original token is revoked
            var tokens = await _context.RefreshTokens.Where(rt => rt.UserId == user.Id).ToListAsync();
            Assert.Equal(2, tokens.Count);
            
            var originalStored = tokens.First(rt => rt.IsRevoked);
            var newStored = tokens.First(rt => !rt.IsRevoked);

            Assert.Equal(newStored.Id, originalStored.ReplacedByTokenId);
        }

        [Fact]
        public async Task RefreshTokensAsync_ReusedToken_RevokesAllTokensForUser()
        {
            // Arrange
            var user = new User { Id = Guid.NewGuid(), Email = "test@example.com", TenantId = "tenant-123" };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var firstToken = await _jwtService.GenerateRefreshTokenAsync(user);
            var secondResult = await _jwtService.RefreshTokensAsync(firstToken); // rotate once successfully
            var secondToken = secondResult.Value.refreshToken;

            // Act: Attempt to use the already rotated (revoked) first token
            var replayResult = await _jwtService.RefreshTokensAsync(firstToken);

            // Assert
            Assert.Null(replayResult); // Replay fails

            // All tokens for the user should now be revoked
            var allTokens = await _context.RefreshTokens.Where(rt => rt.UserId == user.Id).ToListAsync();
            Assert.True(allTokens.All(rt => rt.IsRevoked));
        }

        [Fact]
        public async Task RefreshTokensAsync_ExpiredToken_ReturnsNull()
        {
            // Arrange
            var user = new User { Id = Guid.NewGuid(), Email = "test@example.com", TenantId = "tenant-123" };
            _context.Users.Add(user);
            
            // To simulate expiry, we insert directly
            var refreshToken = new RefreshToken
            {
                UserId = user.Id,
                TokenHash = "testhash", // We will mock hash function if needed, but since it's private we can't easily. 
                // Let's just create it normally, then modify expiry
            };
            await _context.SaveChangesAsync();
            
            var tokenString = await _jwtService.GenerateRefreshTokenAsync(user);
            var storedToken = await _context.RefreshTokens.FirstAsync();
            storedToken.ExpiresAt = DateTime.UtcNow.AddDays(-1); // Expired
            await _context.SaveChangesAsync();

            // Act
            var result = await _jwtService.RefreshTokensAsync(tokenString);

            // Assert
            Assert.Null(result);
        }
    }
}
