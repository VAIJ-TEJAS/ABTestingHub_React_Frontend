import Logo from "./assets/images/logo.png"

function App() {

  return (
    <>
      <div className="w-screen h-screen flex justify-center items-center text-7xl text-blue-500 gap-4">
        <div>
          <img src={Logo} className="w-32 h-32"/>
        </div>
        <div>
          AB Testing Hub
        </div>
      </div>
    </>
  )
}

export default App
