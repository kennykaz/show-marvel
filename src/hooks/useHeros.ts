import { useState, useEffect } from "react";
import { Hero } from "../shared/models";

type HeroMap = Map<string, Hero> | undefined;
const HEROS_KEY = 'show-marvel-data';

export const useHeros = (): [HeroMap, (value: HeroMap) => void] => {
    const [data, setData] = useState<HeroMap>();
    useEffect(() => {
        if (!data) {
            const storedData = localStorage.getItem(HEROS_KEY);
            if (storedData && storedData !== 'undefined') {
                const entries = JSON.parse(storedData);
                if (entries && Object.keys(entries).length) {
                    setData(new Map<string, Hero>(entries));
                    return;
                }
            }
            
            setData(new Map<string, Hero>);
        }
    }, []);

    const onSetData = (value: HeroMap) => {
        if (value) {
            if (value.size > 0) {
                const entries = Array.from(value.entries());
                if (entries) {
                    const data = JSON.stringify(entries);
                    localStorage.setItem(HEROS_KEY, data);
                }
            }
            setData(new Map<string, Hero>(value));
        }
    }
    
    return [data, onSetData];
};
//     const [data, setData] = useState<Map<string, Hero>>();
//       useEffect(() => {
//         if (!data) {
//             const storedData = localStorage.getItem(HEROS_KEY);
//             if (storedData) {
//                 setData(JSON.parse(storedData) as Map<string, Hero>);
//             }
//             else {
//                 setData(new Map<string, Hero>);
//             }
//         }
//       }, []);
      
//       const addItem = (value: Hero) => {
//         if (data && value) {
//             data.set(value.id, value);
//             localStorage.setItem(HEROS_KEY, JSON.stringify(data));
//         }
//       }

//       const removeItem = (value: Hero) => {
//         if (value) {
//             data?.delete(value.id);
//             localStorage.setItem(HEROS_KEY, JSON.stringify(data));
//         }
//       }
      
//       return [data?.values(), addItem, removeItem];
//     };

// export const useHeros = (): [Hero[] | undefined, React.Dispatch<React.SetStateAction<Hero[] | undefined>>] => {
// const [data, setData] = useState<Hero[]>();
//   useEffect(() => {
//     if (!data) {
//         const storedData = localStorage.getItem(HEROS_KEY);
//         if (storedData) {
//             setData(JSON.parse(storedData) as Hero[]);
//         }
//         else {
//             setData([]);
//         }
//     }
//   }, []);

//   const onSetData = (value: React.SetStateAction<Hero[] | undefined>) => {
//     setData(value);
//   }
  
//   return [data, onSetData];
// };