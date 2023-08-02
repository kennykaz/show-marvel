import { Hero } from "../shared/models";

type HeroAction = (hero: Hero, action: 'add' | 'remove') => void;
type ProfileProps = { 
    hero: Hero, 
    isInTeam: boolean, 
    onHeroAction: HeroAction
  }

export const Profile = (props: ProfileProps) => {
    
    const { hero, isInTeam, onHeroAction } = props;
    
    return (
      <article key={hero.id} className="leaderboard-profile">
        <img src={`${hero.thumbnail.path}/standard_medium.${hero.thumbnail.extension}`} alt={hero.name} className={isInTeam ? 'leaderboard-picture selected' : 'leaderboard-picture'}/>
        <span className="leaderboard-name">{hero.name}</span>
        <span className="leaderboard-value">
          {!isInTeam && <button className="actionButton add" onClick={() => onHeroAction(hero, 'add')}>Add Team Member</button>}
          {isInTeam && <button className="actionButton remove" onClick={() => onHeroAction(hero, 'remove')}>Remove Team Member</button>}
        </span>
      </article>
    );
  }