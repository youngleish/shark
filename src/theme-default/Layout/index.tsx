import {useState} from 'react';

export function Layout() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <h1>Layout 66</h1>
      <p>count: {count}</p>
      <button onClick={() => setCount(count + 1)}>add</button>
    </div>
  )
}