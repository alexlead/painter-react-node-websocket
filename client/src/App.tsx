import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Toolbar from './components/Toolbar'
import SettingBar from './components/SettingBar'
import Canvas from './components/Canvas'


function App() {
  const defaultId: string = `f${Date.now().toString(16)}`;

  return (
    <>
      <BrowserRouter>
        <div className="app flex flex-col h-screen bg-gray-100">
          <Routes>
            <Route
              path="/:id"
              element={
                <>
                  <Toolbar />
                  <SettingBar />
                  <Canvas />
                </>
              }
            />
            <Route
              path="*"
              element={<Navigate to={`/${defaultId}`} replace />}
            />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  )
}

export default App
