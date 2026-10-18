using System.Security.Cryptography;
using System.Text;

namespace Backend.Services;

/// <summary>
/// Demo-grade password hashing: salted SHA-256.
/// Good enough for a starter template, but NOT for production —
/// use PBKDF2, bcrypt, or ASP.NET Core Identity's PasswordHasher instead.
/// </summary>
public class PasswordHasher
{
    public (string Hash, string Salt) HashPassword(string password)
    {
        var saltBytes = RandomNumberGenerator.GetBytes(32);
        var salt = Convert.ToBase64String(saltBytes);
        return (ComputeHash(password, salt), salt);
    }

    public bool Verify(string password, string hash, string salt)
        => ComputeHash(password, salt) == hash;

    private static string ComputeHash(string password, string salt)
    {
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(salt + password));
        return Convert.ToBase64String(bytes);
    }
}
