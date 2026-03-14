using Microsoft.AspNetCore.SignalR;

namespace GameStore.Api.DTOs;

public record GenreSummaryDTO (
    int Id,
    string Name
);
