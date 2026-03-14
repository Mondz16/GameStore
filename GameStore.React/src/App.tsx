import { useEffect, useState } from "react";
import "./App.css";
import API from "./utils/api.tsx";

interface Game {
  id: number;
  name: string;
  genre: string;
  price: number;
  releaseDate: string;
}

interface Genre {
  id: number;
  name: string;
}

function App() {
  const [data, setData] = useState<Game[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [showModal, setShowModal] = useState(false);

  const [name, setName] = useState<string>("");
  const [genreId, setGenreId] = useState<number>(0);
  const [price, setPrice] = useState<string>("");
  const [releaseDate, setReleaseDate] = useState<string>("");

  useEffect(() => {
    fetchGames();
    fetchGenres();
  }, []);

  const fetchGames = async () => {
    try {
      const { data } = await API.get("/games");
      setData(data);
    } catch (error) {
      console.error("Error fetching games:", error);
    }
  };

  const fetchGenres = async () => {
    try {
      const { data } = await API.get("/genres");
      setGenres(data);
    } catch (error) {
      console.error("Error fetching genres:", error);
    }
  };

  const resetForm = () => {
    setName("");
    setGenreId(0);
    setPrice("");
    setReleaseDate("");
  };

  const openModal = () => setShowModal(true);

  const closeModal = () => {
    resetForm();
    setShowModal(false);
  };

  const addGame = async () => {
    try {
      await API.post("/games", {
        name,
        genreId,
        price: parseFloat(price) || 0,
        releaseDate,
      });
      closeModal();
      fetchGames();
    } catch (error) {
      console.error("Error adding game:", error);
    }
  };

  return (
    <>
      <div className="page-header">
        <h1>Game Store</h1>
        <div className="header-actions">
          <button className="btn btn-ghost" onClick={fetchGames}>
            ↻ Refresh
          </button>
          <button className="btn btn-primary" onClick={openModal}>
            + Add Game
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="games-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Genre</th>
              <th>Price</th>
              <th>Release Date</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <div className="empty-state">
                    No games found. Add one to get started.
                  </div>
                </td>
              </tr>
            ) : (
              data.map((game: Game, index: number) => (
                <tr key={game.id}>
                  <td className="index-cell">{index + 1}</td>
                  <td>{game.name}</td>
                  <td>
                    <span className="badge-genre">{game.genre}</span>
                  </td>
                  <td className="price-cell">${game.price.toFixed(2)}</td>
                  <td>{game.releaseDate}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div
          className="modal-overlay"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="modal">
            <div className="modal-header">
              <h2>Add New Game</h2>
              <button
                className="modal-close"
                onClick={closeModal}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="game-name">Name</label>
                <input
                  id="game-name"
                  type="text"
                  placeholder="e.g. The Last of Us"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label htmlFor="game-genre">Genre</label>
                <select
                  id="game-genre"
                  value={genreId}
                  onChange={(e) => setGenreId(parseInt(e.target.value))}
                >
                  <option value="0">Select a genre…</option>
                  {genres.map((genre: Genre) => (
                    <option key={genre.id} value={genre.id}>
                      {genre.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="game-price">Price ($)</label>
                <input
                  id="game-price"
                  type="number"
                  placeholder="e.g. 59.99"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label htmlFor="game-date">Release Date</label>
                <input
                  id="game-date"
                  type="date"
                  value={releaseDate}
                  onChange={(e) => setReleaseDate(e.target.value)}
                />
              </div>
            </div>

            <div className="form-actions">
              <button className="btn btn-danger" onClick={closeModal}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={addGame}>
                Add Game
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
