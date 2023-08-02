import React, { useEffect, useState, useCallback, KeyboardEvent } from 'react';
import './App.scss';
import { useFetch } from './hooks/useFetch';
import { Hero } from './shared/models';
import { useHeros } from './hooks/useHeros';
import { Header } from './components/Header';
import { Profile } from './components/Profile';

interface Response {
  attributionText: string,
  data: {
    count: number,
    total: number,
    results: Hero[],
  }
}

function App() {
  const key = process.env.REACT_APP_API_KEY;
  const [isFetching, setIsFetching] = useState(false);
  const [isTeamVisible, setIsTeamVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>();
  const url = `https://gateway.marvel.com:443/v1/public/characters?apikey=${key}&nameStartsWith=${searchTerm}`;
  const query = useFetch<Response>(url, isFetching);
  
  useEffect(() => {
    if (isFetching && query.data && !query.isPending) {
      setIsFetching(false);
    }
  }, [isFetching, query]);
  
  const sendRequest = useCallback(async () => {
    if (isFetching) {
      return;
    }
    setIsFetching(true);
  }, [isFetching]); // update the callback if the state changes

  const [heros, setHeros] = useHeros();

  const onHeroAction = (hero: Hero, action: 'add' | 'remove') => {
    if (!hero || !heros) {
      return;
    }

    if (action === 'add') {
      heros.set(hero.id, hero);
    }
    else if (action === 'remove') {
      heros.delete(hero.id);
    }

    setHeros(heros);
  }

  const onKeyup = (e: KeyboardEvent) => {
    if (e.code === 'Enter') {
      setIsFetching(true);
    }
  }

  return (
    <div className="leaderboard">
      <Header header="Marvel" subHeader="Hero Search"/>
      {/* Search */}
      <div className="wrap">
        <div className="search">
          <input type="text" disabled={isFetching} className="searchTerm" placeholder="Search for a hero" onChange={(e) => setSearchTerm(e.currentTarget.value)} onKeyUp={onKeyup}/>
          <button type="submit" disabled={isFetching} className="searchButton" onClick={sendRequest}>
              {isFetching ? <i/> : <i className="fa fa-search"></i>}
          </button>
        </div>
      </div>
      {/* Messages */}
      <main className="leaderboard-profiles">
        {(!heros || heros.size == 0) && 
          <div className="center">Search for Heros to add to your team!</div>
        }
        {(heros && heros.size > 0) && 
          <div className="center">
            <button className="actionButton view" onClick={() => setIsTeamVisible(true)}>View your team members ({heros.size})</button>
          </div>
        }
        {query && query.data && 
          <div className="center"><sub>Showing top {query.data.data.count} of {query.data.data.total} results. ({query.data.attributionText})</sub></div>
        }
        {
          query.data?.data?.results?.map(result => <Profile key={result.id} hero={result} isInTeam={heros?.has(result.id) === true} onHeroAction={onHeroAction} />)
        }
      </main>
      {/* Team View */}
      <div className={isTeamVisible ? "modal-window open" : "modal-window"}>
        <div>
          <Header header="Team List" subHeader="Your Marvel Team"/>
          <button className="modal-close" onClick={() => setIsTeamVisible(false)}>Close</button>
          <main className="leaderboard-profiles">
            {heros && heros.size > 0 && 
              Array
              .from(heros.values())
              .map(hero => <Profile key={hero.id} hero={hero} isInTeam={true} onHeroAction={onHeroAction}/>)
            }
          </main>
        </div>
      </div>

    </div>
  );
}

export default App;
