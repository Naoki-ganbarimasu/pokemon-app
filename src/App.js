import './App.css';
import { useEffect, useState } from 'react';
import { getAllPokemon, getPokemon } from './utils/pokemon.js';
import Card from './components/Card/Card.js';
import Navber from './components/Navber/Navber.js';

const App = () => {
  const initialURL = "https://pokeapi.co/api/v2/pokemon";
  const [loading, setLoading] = useState(true);
  const [PokemonData, setPokemonData] = useState([]);
  const [nextURL, setNextURL] = useState("");
  const [prevURL, setPrevURL] = useState("");

  useEffect(() => {
    const  fetchPokemonData = async () => {
      // 全てのポケモンデータを取得
      let res = await getAllPokemon(initialURL);
      // 各ポケモンの詳細なデータを取得
      loadPokemon(res.results);
      // console.log(res);
      setNextURL(res.next);
      setPrevURL(res.previous);//null
      setLoading(false);
    }
  fetchPokemonData();
},[]); 

const loadPokemon = async (data) => {
  let _PokemonData = await Promise.all(
    data.map((pokemon) => {
      // console.log(pokemon);
      let pokemonRecord = getPokemon(pokemon.url);
      return pokemonRecord;
    })
     
  );
  setPokemonData(_PokemonData);
};

// console.log(PokemonData);

const handleNextPage = async () => {
  setLoading(true);
  let data = await getAllPokemon(nextURL);
  // console.log(data)
  await loadPokemon(data.results);
  setNextURL(data.next);
  setPrevURL(data.previous);
  setLoading(false);
}; 

const handlePrevPage = async () => {
  if(!prevURL) return;

  setLoading(true);
  let data = await getAllPokemon(prevURL);
  await loadPokemon(data.results);
  setNextURL(data.next);
  setPrevURL(data.previous);
  setLoading(false);
};


return ( 
  <>
    <Navber />
    <div>
      {loading ? (
        <h1>ロード中・・・</h1>
      ) : (
      <>
        <div className='pokemonCardContainer'>
          {PokemonData.map((pokemon, i) => {
            return <Card key={i} pokemon={pokemon} />;
          })}
    </div>
    <div className='btn'>
      <button　onClick={handlePrevPage}>前へ</button>
      <button　onClick={handleNextPage}>次へ</button>
    </div>
  </>
      )}
    </div>
  </>
)}

export default App;
