import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, setDoc, doc, query, where, deleteDoc } from 'firebase/firestore/lite';
import { Pokemon } from './types';
import { Accordion, Container, Form,Stack } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';

const pokemonJson: Pokemon[] = require('./pokemon.json');

const firebaseConfig = {
  apiKey: "AIzaSyAGepzjDTRsPLjOoVu7Ov3Xtr5hVQ0Qvv8",
  authDomain: "testpokemon-b0eea.firebaseapp.com",
  projectId: "testpokemon-b0eea",
  storageBucket: "testpokemon-b0eea.appspot.com",
  messagingSenderId: "552231622450",
  appId: "1:552231622450:web:f39e2a9a6680d4dbdea92b"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);



function App() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);

  const clearPokemon = async () => {
    const q = query(collection(db, "pokemon"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(doc => {
      deleteDoc(doc.ref);
    });
  }

  const savePokemon = async () => {
    setPokemon([]);

    await clearPokemon();

    for (let i = 0; i < pokemonJson.length; i++) {
      await setDoc(doc(db, "pokemon", pokemonJson[i].name), pokemonJson[i]);
    }
    await loadPokemon();
    alert("Pokemon data loaded");
  }

  const loadPokemon = async () => {
    const q = query(collection(db, "pokemon"));
    const querySnapshot = await getDocs(q);
    let pokemon: Pokemon[] = [];
    querySnapshot.forEach((doc) => {
      pokemon.push(doc.data() as Pokemon);
    });
    setPokemon(pokemon);

  }

  const addPokemon = async (pokemon: Pokemon) => {
    await setDoc(doc(db, "pokemon", pokemon.name), pokemon);
    await loadPokemon();
  }

  useEffect(() => {
    //savePokemon();
    loadPokemon();
  }, [])



  return (
    <Container>
      <Stack gap={3} className="col-md-5 mx-auto">
        <Button onClick={() => { savePokemon() }}>Initialise firestore database</Button>
        <Accordion defaultActiveKey="0">
          {pokemon.map((pokemon) => {
            return <PokemonView pokemon={pokemon} />
          })}
        </Accordion>
        <hr/>
        <NewPokemonForm addPokemon={(pokemon) => { addPokemon(pokemon); }}/>
      </Stack>
    </Container>
  );
}

interface NewPokemonFormProps {
  addPokemon: (pokemon: Pokemon) => void;
}

const NewPokemonForm = ({addPokemon} : NewPokemonFormProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  return (
    <Form>
      <Stack gap={0}>
        <Form.Group className="mb-3" controlId="formPokemonName">
          <Form.Label>Pokemon name</Form.Label>
          <Form.Control type="text" placeholder="Enter pokemon name" value={name} onChange={(e) => { setName(e.target.value)}}/>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formPokemonDescription">
          <Form.Label>Pokemon description</Form.Label>
          <Form.Control as="textarea" rows={3} placeholder="Enter pokemon description" value={description} onChange={(e) => { setDescription(e.target.value)}}/>
        </Form.Group>

        <Button variant="primary" onClick={() => { addPokemon({name, description}) }}>
          Submit
        </Button>
      </Stack>
</Form>
  )
}

interface PokemonViewProps {
  pokemon: Pokemon
}
const PokemonView = ({pokemon} : PokemonViewProps) => {
  return (
    <Accordion.Item eventKey={pokemon.name.toString()}>
      <Accordion.Header>{pokemon.name}</Accordion.Header>
      <Accordion.Body>
        {pokemon.description}
      </Accordion.Body>
    </Accordion.Item>
  )
}

export default App;
