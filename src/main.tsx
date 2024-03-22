import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { ConfigProvider } from 'antd';
import { MyContextProvider } from './context/context.provider.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ConfigProvider
    theme={{
      token: {
        borderRadius: 3,
        colorPrimary: '#1890FF',
      },
    }}
  >
    <MyContextProvider>
      <App />
    </MyContextProvider>
  </ConfigProvider>,
)
