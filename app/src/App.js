import Rout from './Routes'
import './static/css/app.scss'
import { useEffect, useState } from 'react'
import Loader from './components/loader'
import provider from './store/web3Provider'

function App() {
  const [loaded, setLoaded] = useState(false);
  console.log("testing00");
  useEffect(() => {
    console.log("testing01");
    async function setProvider() {
      await provider.setProvider()
      await provider.setContract();
      setLoaded(true)
    }
    setProvider()
  }, [])

  return (
    <div>
      {(loaded) ? <Rout /> : <Loader />}
    </div>
  );
}

export default App;

