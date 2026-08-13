using System.Threading.Tasks;
using AuthService.Controllers;
using AuthService.DTOs;
using AuthService.Services;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace AuthService.Tests.Controllers
{
    public class AuthControllerTests
    {
        private readonly Mock<IAuthenticationService> _mockAuthService;
        private readonly Mock<IJwtService> _mockJwtService;
        private readonly Mock<ILogger<AuthController>> _mockLogger;
        private readonly Mock<IWebHostEnvironment> _mockEnvironment;
        private readonly AuthController _controller;

        public AuthControllerTests()
        {
            _mockAuthService = new Mock<IAuthenticationService>();
            _mockJwtService = new Mock<IJwtService>();
            _mockLogger = new Mock<ILogger<AuthController>>();
            _mockEnvironment = new Mock<IWebHostEnvironment>();

            _mockEnvironment.Setup(x => x.EnvironmentName).Returns("Development");

            _controller = new AuthController(
                _mockAuthService.Object,
                _mockJwtService.Object,
                _mockLogger.Object,
                _mockEnvironment.Object
            );

            // Mock HttpContext for cookies
            var httpContext = new DefaultHttpContext();
            _controller.ControllerContext = new ControllerContext()
            {
                HttpContext = httpContext
            };
        }

        [Fact]
        public async Task Login_InvalidCredentials_ReturnsProblemDetails401()
        {
            // Arrange
            var request = new LoginRequest { Email = "test@example.com", Password = "wrong" };
            _mockAuthService.Setup(x => x.LoginAsync(request))
                .ReturnsAsync((null, "Invalid email or password.", StatusCodes.Status401Unauthorized));

            // Act
            var result = await _controller.Login(request);

            // Assert
            var objectResult = Assert.IsType<ObjectResult>(result);
            Assert.Equal(StatusCodes.Status401Unauthorized, objectResult.StatusCode);
            
            var problemDetails = Assert.IsType<ProblemDetails>(objectResult.Value);
            Assert.Equal(StatusCodes.Status401Unauthorized, problemDetails.Status);
            Assert.Equal("Login Failed", problemDetails.Title);
            Assert.Equal("Invalid email or password.", problemDetails.Detail);
        }

        [Fact]
        public async Task Register_DuplicateEmail_ReturnsProblemDetails409()
        {
            // Arrange
            var request = new RegisterRequest { Email = "dup@example.com", Password = "pwd" };
            _mockAuthService.Setup(x => x.RegisterAsync(request))
                .ReturnsAsync((null, "Email is already in use.", StatusCodes.Status409Conflict));

            // Act
            var result = await _controller.Register(request);

            // Assert
            var objectResult = Assert.IsType<ObjectResult>(result);
            Assert.Equal(StatusCodes.Status409Conflict, objectResult.StatusCode);

            var problemDetails = Assert.IsType<ProblemDetails>(objectResult.Value);
            Assert.Equal(StatusCodes.Status409Conflict, problemDetails.Status);
            Assert.Equal("Registration Failed", problemDetails.Title);
            Assert.Equal("Email is already in use.", problemDetails.Detail);
        }

        [Fact]
        public async Task Login_ValidCredentials_SetsCookieAndReturnsOk()
        {
            // Arrange
            var request = new LoginRequest { Email = "test@example.com", Password = "correct" };
            var authResponse = new AuthResponse { AccessToken = "access", RefreshToken = "refresh" };
            
            _mockAuthService.Setup(x => x.LoginAsync(request))
                .ReturnsAsync((authResponse, null, StatusCodes.Status200OK));

            // Act
            var result = await _controller.Login(request);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(StatusCodes.Status200OK, okResult.StatusCode);
            Assert.Equal(authResponse, okResult.Value);

            var setCookieHeader = _controller.Response.Headers["Set-Cookie"].ToString();
            Assert.Contains("refreshToken=refresh", setCookieHeader);
            Assert.Contains("httponly", setCookieHeader, StringComparison.OrdinalIgnoreCase);
        }
    }
}
