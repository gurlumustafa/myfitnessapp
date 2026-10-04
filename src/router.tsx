import { createBrowserRouter } from 'react-router'
import App from './App'
import Antrenman from './pages/Antrenman'
import Ayarlar from './pages/Ayarlar'
import Bugun from './pages/Bugun'
import Raporlar from './pages/Raporlar'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Bugun /> },
      { path: 'antrenman', element: <Antrenman /> },
      { path: 'raporlar', element: <Raporlar /> },
      { path: 'ayarlar', element: <Ayarlar /> },
    ],
  },
])
