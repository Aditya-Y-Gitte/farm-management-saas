using System;
using System.Threading.Tasks;
using AuthService.DTOs;
using AuthService.Models;
using AuthService.Repositories;
using AuthService.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;
using BCrypt.Net;

namespace AuthService.Tests.Services
{
    public class AuthenticationServiceTests
    {
        private readonly Mock<IUserRepository> _mockUserRepository;
        private readonly Mock<IGoogleOAuthService> _mockGoogleOAuthService;
        private readonly Mock<IJwtService> _mockJwtService;
        private readonly Mock<ILogger<AuthenticationService>> _mockLogger;
        private readonly AuthenticationService _service;

        public AuthenticationServiceTests()
        {
            _mockUserRepository = new Mock<IUserRepository>();
            _mockGoogleOAuthService = new Mock<IGoogleOAuthService>();
            _mockJwtService = new Mock<IJwtService>();
            _mockLogger = new Mock<ILogger<AuthenticationService>>();

            _service = new AuthenticationService(
                _mockUserRepository.Object,
                _mockGoogleOAuthService.Object,
                _mockJwtService.Object,
                _mockLogger.Object
            );
        }

        [Fact]
        public async Task RegisterAsync_ValidRequest_ReturnsSuccessAndTokens()
        {
            // Arrange
            var request = new RegisterRequest { Email = "test@example.com", Password = "password123", DisplayName = "Test User" };
            _mockUserRepository.Setup(x => x.GetUserByEmailAsync(request.Email)).ReturnsAsync((User?)null);
            _mockUserRepository.Setup(x => x.CreateUserAsync(It.IsAny<User>())).Returns(Task.CompletedTask);
            _mockJwtService.Setup(x => x.GenerateAccessToken(It.IsAny<User>())).Returns("access_token");
            _mockJwtService.Setup(x => x.GenerateRefreshTokenAsync(It.IsAny<User>())).ReturnsAsync("refresh_token");

            // Act
            var result = await _service.RegisterAsync(request);

            // Assert
            Assert.Equal(StatusCodes.Status200OK, result.StatusCode);
            Assert.Null(result.ErrorMessage);
            Assert.NotNull(result.Response);
            Assert.Equal("access_token", result.Response.AccessToken);
            Assert.Equal("refresh_token", result.Response.RefreshToken);
            Assert.Equal(request.Email, result.Response.User.Email);
            Assert.NotEmpty(result.Response.User.TenantId);
        }

        [Fact]
        public async Task RegisterAsync_DuplicateEmail_ReturnsConflict()
        {
            // Arrange
            var request = new RegisterRequest { Email = "duplicate@example.com", Password = "password123" };
            _mockUserRepository.Setup(x => x.GetUserByEmailAsync(request.Email))
                .ReturnsAsync(new User { Email = request.Email });

            // Act
            var result = await _service.RegisterAsync(request);

            // Assert
            Assert.Equal(StatusCodes.Status409Conflict, result.StatusCode);
            Assert.Equal("Email is already in use.", result.ErrorMessage);
            Assert.Null(result.Response);
        }

        [Fact]
        public async Task LoginAsync_ValidCredentials_ReturnsSuccess()
        {
            // Arrange
            var request = new LoginRequest { Email = "test@example.com", Password = "password123" };
            var existingUser = new User 
            { 
                Email = request.Email, 
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                TenantId = Guid.NewGuid().ToString()
            };
            
            _mockUserRepository.Setup(x => x.GetUserByEmailAsync(request.Email)).ReturnsAsync(existingUser);
            _mockJwtService.Setup(x => x.GenerateAccessToken(existingUser)).Returns("access_token");
            _mockJwtService.Setup(x => x.GenerateRefreshTokenAsync(existingUser)).ReturnsAsync("refresh_token");

            // Act
            var result = await _service.LoginAsync(request);

            // Assert
            Assert.Equal(StatusCodes.Status200OK, result.StatusCode);
            Assert.NotNull(result.Response);
            Assert.Equal(existingUser.TenantId, result.Response.User.TenantId);
            _mockJwtService.Verify(x => x.GenerateAccessToken(existingUser), Times.Once);
        }

        [Fact]
        public async Task LoginAsync_InvalidPassword_ReturnsUnauthorized()
        {
            // Arrange
            var request = new LoginRequest { Email = "test@example.com", Password = "wrongpassword" };
            var existingUser = new User 
            { 
                Email = request.Email, 
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("correctpassword") 
            };
            
            _mockUserRepository.Setup(x => x.GetUserByEmailAsync(request.Email)).ReturnsAsync(existingUser);

            // Act
            var result = await _service.LoginAsync(request);

            // Assert
            Assert.Equal(StatusCodes.Status401Unauthorized, result.StatusCode);
            Assert.Equal("Invalid email or password.", result.ErrorMessage);
        }

        [Fact]
        public async Task LoginAsync_NonExistentUser_ReturnsUnauthorized()
        {
            // Arrange
            var request = new LoginRequest { Email = "unknown@example.com", Password = "password123" };
            _mockUserRepository.Setup(x => x.GetUserByEmailAsync(request.Email)).ReturnsAsync((User?)null);

            // Act
            var result = await _service.LoginAsync(request);

            // Assert
            Assert.Equal(StatusCodes.Status401Unauthorized, result.StatusCode);
            Assert.Equal("Invalid email or password.", result.ErrorMessage);
        }
    }
}
