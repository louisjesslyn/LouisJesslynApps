import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import StarsBackground from './components/StarsBackground'
import Home from './pages/Home'
import MapPage from './pages/MapPage'
import Milestones from './pages/Milestones'
import BucketList from './pages/BucketList'
import Letters from './pages/Letters'

export default function App() {
  return (
    <BrowserRouter>
      <StarsBackground />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/milestones" element={<Milestones />} />
        <Route path="/bucket-list" element={<BucketList />} />
        <Route path="/letters" element={<Letters />} />
      </Routes>
    </BrowserRouter>
  )
}
