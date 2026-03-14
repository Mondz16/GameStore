using System.ComponentModel.DataAnnotations;

namespace GameStore.Api.DTOs;

public record CreateGenreDTO(
    [Required][StringLength(50)]string Name
);