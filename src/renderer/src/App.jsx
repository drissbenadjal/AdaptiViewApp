// import Versions from './components/Versions'
import { useState, useEffect } from 'react'
import minimize from './assets/icons/minimize-svg.svg'
import maximize from './assets/icons/maximize-svg.svg'
import close from './assets/icons/close-svg.svg'

const homeIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"><path d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z" /></svg>
)

const terminalIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"><path d="M9.4 86.6C-3.1 74.1-3.1 53.9 9.4 41.4s32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L178.7 256 9.4 86.6zM256 416H544c17.7 0 32 14.3 32 32s-14.3 32-32 32H256c-17.7 0-32-14.3-32-32s14.3-32 32-32z" /></svg>
)

function App() {
  const [isMac, setIsMac] = useState(false)

  useEffect(() => {
    if (window.navigator.platform.toUpperCase().includes('MAC')) {
      setIsMac(true)
    } else {
      setIsMac(false)
    }

    //bloquer le ctrl r
    window.addEventListener("keydown", function (e) {
      if (e.keyCode == 82 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
        console.log('ctrl r')
        e.preventDefault();
      }
      //si ctrl + shift + l on recharge les iframes
      if (e.keyCode == 76 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey) && e.shiftKey) {
        console.log('ctrl + shift + l')
        const iframes = document.querySelectorAll('iframe')
        iframes.forEach(iframe => {
          iframe.contentWindow.location.reload()
        })
      }
    }, false);
  }, [])

  const initialUrl = 'http://localhost:8000'
  const [url, setUrl] = useState(initialUrl)
  const [portContent, setPortContent] = useState('8000')

  const HandleInitialUrl = () => {
    setUrl(initialUrl)
    setPortContent('8000')
  }

  return (
    <>
      <nav className={isMac ? 'mac' : ''}>
        <ul>
          <li>
            <button onClick={HandleInitialUrl}>
              {homeIcon}
            </button>
          </li>
          <li>
            <button onClick={() => { window.electron.ipcRenderer.send('toggle-terminal') }}>
              {terminalIcon}
            </button>
          </li>
        </ul>

        <ul>
          <li>
            <input type="text" placeholder="URL" value={url} disabled />
            <form onSubmit={(e) => {
              e.preventDefault()
              setUrl(`http://localhost:${portContent}`)
            }}>
              <input className='number' type="number" placeholder="Port" value={portContent} onChange={(e) => setPortContent(e.target.value)} />
            </form>
          </li>
        </ul>

        {
          !isMac && (
            <ul className='right'>
              <li className="minimize-window" onClick={() => window.api.minimize()}>
                <img draggable="false" src={minimize} alt="logo" />
              </li>
              <li className="maximize-window" onClick={() => window.api.maximize()}>
                <img draggable="false" src={maximize} alt="logo" />
              </li>
              <li className="close-window" onClick={() => window.api.close()}>
                <img draggable="false" src={close} alt="logo" />
              </li>
            </ul>
          )
        }
      </nav>
      <div className='view-container'>
        <iframe src={url} title="desktop" className='desktop'>
        </iframe>
        <iframe src={url} title="phone" className='phone'>
        </iframe>
      </div>
      <div className='blur'>

      </div>
    </>
  )
}

export default App
