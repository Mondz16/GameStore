using System.ComponentModel.DataAnnotations;

namespace GameStore.Api.DTOs;

public record UpdateGenreDTO(
    [Required][StringLength(50)] string Name
);