using System;
using GameStore.Api.Data;
using GameStore.Api.DTOs;
using GameStore.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace GameStore.Api.Endpoints;

public static class GenresEndpoints
{
    const string GetGenresGameEndPoint = "GetGenre";
    public static void MapGenresEndpoints(this WebApplication app)
    {

        var group = app.MapGroup("/genres");

        group.MapGet("/", async (GameStoreContext dbContext) =>
        await dbContext.Genres.Select(genre => new GenreSummaryDTO(
                genre.Id,
                genre.Name
            )).AsNoTracking().ToListAsync()
        );

        group.MapGet("/{id}", async (int id, GameStoreContext dbContext) =>
        {
            var data = await dbContext.Genres.FindAsync(id);

            return Results.Ok(data);
        }).WithName(GetGenresGameEndPoint);

        group.MapPost("/", async (CreateGenreDTO newGenre, GameStoreContext dbContext) =>
        {
            Genre genre = new()
            {
                Name = newGenre.Name
            };

            dbContext.Genres.Add(genre);
            await dbContext.SaveChangesAsync();

            GenreSummaryDTO summaryDTO = new (
                genre.Id,
                genre.Name
            );

            return Results.CreatedAtRoute(GetGenresGameEndPoint , new {id = summaryDTO.Id}, summaryDTO);
        });

        group.MapPut("/{id}", async (int id, UpdateGenreDTO updatedGenre, GameStoreContext dbContext) =>
        {
            var existingGenre = await dbContext.Genres.FindAsync(id);

            if(existingGenre is null)
            {
                return Results.NotFound();
            }

            existingGenre.Name = updatedGenre.Name;

            await dbContext.SaveChangesAsync();

            return Results.NoContent();
        });

        group.MapDelete("/{id}", async (int id, GameStoreContext dbContext) =>
        {
            await dbContext.Genres.Where(x => x.Id == id).ExecuteDeleteAsync();

            return Results.NoContent();
        });
    }
}
