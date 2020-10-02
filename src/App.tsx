import React from 'react';

let chickenId = 0;

function Button(props: {
  enabled: boolean;
  timeLeft: number;
  text: string;
  onClick: () => void;
  eggCost: number;
  buckBucksInInventory: number;
  eggsInInventory: number;
}) {
  const [hovered, setHovered] = React.useState(false);
  const { enabled, text, onClick, timeLeft: timeLeftMs, eggCost, buckBucksInInventory, eggsInInventory } = props;
  const timeLeft = Math.ceil(timeLeftMs / 1000);

  let content = (
    <>
      <div>
        {text}
      </div>
      <div>
        {
          eggCost > 0 ? eggCost + " eggs " : ""
        }

        {
          timeLeft > 0 ? (timeLeft > 1 ? (timeLeft + " seconds left") : (timeLeft + " second left")) : ""
        }
      </div>
    </>
  );

  if (hovered && eggCost > eggsInInventory) {
    content = (
      <>
        {eggCost > 1 ? `You need ${eggCost} eggs to make that.` : `You need ${eggCost} egg to make that.`}
      </>
    );
  }

  return (
    <div
      onClick={() => { onClick(); }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        justifyContent: "space-between",
        margin: "6px 8px",
        padding: 8,
        border: enabled ? "1px solid black" : "1px solid lightgray",
        color: enabled ? "black" : "lightgray",
      }}>
      {content}
    </div>
  );
}

const chickenTypes = {
  chicken: { numEggs: 1, refreshTime: 15, timeToDie: 60, timePerEgg: 10 },
  mutantChicken: { numEggs: 5, refreshTime: 30, timeToDie: 45, timePerEgg: 10 },
  superChicken: { numEggs: 10, refreshTime: 45, timeToDie: 45, timePerEgg: 3 },
  thePeckinator: { numEggs: 10, refreshTime: 60, timeToDie: 20, timePerEgg: 1 }
}

const thingsToDo = [
  {
    name: "Lay egg",
    cost: 0,
    timeout: 30,
  },

  {
    name: "Hatch chicken",
    cost: 0,
    timeout: 15,
  },
]

// DONT LOOK EVERYTHING IS FINE HEHE :) :) :)
export function useInterval(
  callback: () => void,
  delay: number | null | false,
  immediate?: boolean
) {
  const savedCallback = React.useRef(() => { });

  // Remember the latest callback.
  React.useEffect(() => {
    savedCallback.current = callback;
  });

  // Execute callback if immediate is set.
  React.useEffect(() => {
    if (!immediate) return;
    if (delay === null || delay === false) return;
    savedCallback.current();
  }, [immediate]);

  // Set up the interval.
  React.useEffect(() => {
    if (delay === null || delay === false) return undefined;
    const tick = () => savedCallback.current();
    const id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay]);
}


const LAY_EGG_TIMEOUT = 1000;
const HATCH_EGG_TIMEOUT = 10000;

function App() {
  // chicken supply
  const [eggs, setEggs] = React.useState(0);
  const [lastTimeLaidEgg, setLastTimeLaidEgg] = React.useState(0);
  const [lastTimeHatchedEgg, setLastTimeHatchedEgg] = React.useState(0);
  const [chickenFeed, setChickenFeed] = React.useState(0);
  const [buckBucks, setBuckBucks] = React.useState(20);
  const [flour, setFlour] = React.useState(0);
  const [milk, setMilk] = React.useState(0);

  const [chickens, setChickens] = React.useState(0);

  // bakery supply
  const [rawEggs, setRawEggs] = React.useState(0);
  const [friedEggs, setFriedEggs] = React.useState(0);
  const [omelets, setOmelets] = React.useState(0);
  const [hardBoiledEggs, setHardBoiledEggs] = React.useState(0);
  const [softBoiledEggs, setSoftBoiledEggs] = React.useState(0);

  const [activities, setActivities] = React.useState([""]);

  // hacks :)
  // :(((((((
  const [, updateState] = React.useState({});
  const forceUpdate = React.useCallback(() => updateState({}), []);

  const [foodToMake, setFoodToMake] = React.useState([
    {
      name: "raw egg",
      cost: 1,
      sellingPrice: 1,
      timeout: 10 / 100,
      lastBoughtTs: 0,
      count: 0,
    },
    {
      name: "fried egg",
      cost: 1,
      sellingPrice: 5,
      timeout: 30 / 100,
      lastBoughtTs: 0,
      count: 0,
    },
    {
      name: "scrambled egg",
      cost: 2,
      sellingPrice: 10,
      timeout: 45 / 100,
      lastBoughtTs: 0,
      count: 0,
    },
    {
      name: "omelet",
      cost: 3,
      sellingPrice: 20,
      timeout: 60 / 100,
      lastBoughtTs: 0,
      count: 0,
    },
    {
      name: "hardboiled egg",
      cost: 6,
      sellingPrice: 30,
      timeout: 90 / 100,
      lastBoughtTs: 0,
      count: 0,
    },
    {
      name: "softboiled egg",
      cost: 8,
      sellingPrice: 50,
      timeout: 90 / 100,
      lastBoughtTs: 0,
      count: 0,
    },
    {
      name: "royal skillet",
      cost: 10,
      sellingPrice: 100,
      timeout: 200 / 100,
      lastBoughtTs: 0,
      count: 0,
    },
    {
      name: "scrambie",
      cost: 100,
      sellingPrice: 1000,
      timeout: 300 / 100,
      lastBoughtTs: 0,
      count: 0,
    },
  ]);

  useInterval(() => {
    const fps = 1000 / 50;

    if (Math.random() * 100 > 99) {
      const r = Math.random();
      const total = 0;
      const totalItems = foodToMake[0].count + foodToMake[1].count + foodToMake[2].count + foodToMake[3].count + foodToMake[4].count + foodToMake[5].count + foodToMake[6].count + foodToMake[7].count;

      for (let i = 0; i < 8; i++) {
        if (r < foodToMake[i].count / totalItems) {
          setFoodToMake(oldFoodToMake => {
            const result = [...oldFoodToMake];
            result[i] = {
              ...result[i],
              count: result[i].count - 1,
            };

            return result;
          });

          setBuckBucks(buckBucks + foodToMake[i].sellingPrice)
          setActivities([`You sell a ${foodToMake[i].name}!!!!!!!!!!!`, ...activities])
        }
      }
    }

    setEggs(eggs + chickens * 0.01);

    setChickenFeed(Math.max(0, chickenFeed - chickens * 0.01));

    forceUpdate();
  }, 50);

  const tryToLayEgg = () => {
    if (Date.now() - lastTimeLaidEgg > LAY_EGG_TIMEOUT) {
      setEggs(eggs + 1);
      setLastTimeLaidEgg(Date.now());
      setActivities(["You laid an egg.", ...activities])
    } else {
      setActivities(["You try and try, but you can't lay an egg!!!", ...activities])
    }
  }

  const tryToHatchChicken = () => {
    if (Date.now() - lastTimeHatchedEgg > HATCH_EGG_TIMEOUT) {
      if (eggs > 0) {
        setChickens(chickens + 1);
        setEggs(eggs - 1);
        chickenId++;
        setActivities([`You hatched chicken #${chickenId}...`, ...activities]);
        setLastTimeHatchedEgg(Date.now());
      } else {
        setActivities(["You dont have enough eggs to hatch an egg!!!!!", ...activities]);
      }
    } else {
      setActivities(["You can't hatch an egg now!!! What the HECK!!!", ...activities])
    }
  }

  const makeRawEgg = () => {
    if (eggs > 0) {
      setEggs(eggs - 1);
      setRawEggs(rawEggs + 1);
    }
  }

  const renderActivities = () => {
    const activitiesToShow = 50;
    let rv = [];
    for (let i = 0; i < Math.min(activities.length, 50); i++) {
      const color = 256 * Math.min(1, i / 20);
      rv.push(<div style={{ margin: 3, color: `rgb(${color},${color},${color})` }}>{activities[i]}</div>)
    }
    return rv;
  }

  return (
    <div className="App" style={{ padding: 20 }}>
      <h1 style={{ paddingBottom: 20 }}>
        <span style={{ fontSize: 5 + (chickens + 10) + "px" }}>
          🐔
        </span>
        🍳

        eps: {chickens * 0.01 * 20} </h1>
      <div style={{ display: "flex", width: 800 }}>
        <div style={{ flex: 1, marginTop: 35, padding: "20 10 20 20", display: 'flex', flexDirection: 'column' }}>
          {renderActivities()}
        </div>

        <div style={{ flex: 1, padding: 20, display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: 2 }}>
            chicken coop
          </div>

          <Button
            eggCost={0}
            eggsInInventory={eggs}
            buckBucksInInventory={buckBucks}
            enabled={Date.now() - lastTimeLaidEgg > LAY_EGG_TIMEOUT}
            timeLeft={
              LAY_EGG_TIMEOUT - (Date.now() - lastTimeLaidEgg)
            }
            onClick={() => tryToLayEgg()}
            text={"lay egg"}
          />

          <Button
            eggCost={0}
            eggsInInventory={eggs}
            buckBucksInInventory={buckBucks}
            enabled={Date.now() - lastTimeHatchedEgg > HATCH_EGG_TIMEOUT}
            timeLeft={
              HATCH_EGG_TIMEOUT - (Date.now() - lastTimeHatchedEgg)
            }
            onClick={() => tryToHatchChicken()}
            text={"hatch chicken"}
          />
          <div style={{ marginTop: 14 }}>bakery</div>

          {
            foodToMake.map(({ name, cost, timeout, lastBoughtTs }) => {
              return (
                <Button
                  enabled={Date.now() - lastBoughtTs > timeout * 1000 && cost <= eggs}
                  eggsInInventory={eggs}
                  buckBucksInInventory={buckBucks}
                  timeLeft={timeout * 1000 - (Date.now() - lastBoughtTs)}
                  onClick={() => {
                    const result = [...foodToMake];
                    const index = result.findIndex(x => x.name === name);

                    setEggs(eggs => eggs - result[index].cost);

                    setFoodToMake(oldFoodToMake => {
                      oldFoodToMake[index] = {
                        ...oldFoodToMake[index],
                        lastBoughtTs: Date.now(),
                        count: oldFoodToMake[index].count + 1,
                      };

                      return result;
                    });
                  }}
                  text={name}
                  eggCost={cost}
                />
              );
            })
          }


        </div>

        <div style={{ flex: 1, padding: 20 }}>
          <div>
            storage
          </div>
          <Button
            enabled={buckBucks > 25}
            eggsInInventory={eggs}
            buckBucksInInventory={buckBucks}
            timeLeft={0}
            onClick={() => {
              if (buckBucks > 25) {
                setChickenFeed(chickenFeed + 10);
                setBuckBucks(buckBucks - 25)
              }
            }}
            text={"buy feed"}
            eggCost={0}
          />
          <div style={{ padding: 8, margin: 8, border: "1px solid black" }}>
            <div>chickens: {chickens} </div>
            <div>eggs: {Math.floor(eggs)} </div>
            <div>chicken feed: {Math.floor(chickenFeed)}</div>
            <div>bawk bucks: {buckBucks}</div>
            <div>flour: {flour}</div>
            <div>milk: {milk}</div>

          </div>
          <div style={{ marginTop: 20, marginBottom: 2 }}>
            for sale
          </div>
          <div style={{ padding: 8, margin: 8, border: "1px solid black" }}>
            {
              foodToMake.map(({ name, count }) => {
                return (
                  <div>
                    { name}: { count}
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    </div >
  );
}

export default App;
// egg
// egg egg

new Audio('./crpg.mp3').play()

