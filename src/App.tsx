import { Outlet } from 'react-router-dom';
// Còn này cấu hình Root Component
function App() {
  return (
    <div className="app-main-layout w-100 h-100">
          <Outlet />
    </div>
  );
}

export default App;