import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// css
import './styles/global.css';

// components
// import FullScreenLoader from './components/FullScreenLoader.jsx';
import NotFound from "./components/404NotFound";

import TransactionMonitoring from "./pages/TransactionMonitoring.jsx";
import Auth from "./pages/Auth.jsx"
import Transaction from "./pages/transaction";
// lazy loading
// const Website = React.lazy(() => import("./pages/website/Landing.jsx"));
// const ComingSoon = React.lazy(() => import("./pages/website/comingSoon/ComingSoon"));

function App() {
	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Auth />} />
					<Route path="/monitoring" element={<TransactionMonitoring />} />
					<Route path="/transaction" element={<Transaction />} />
					<Route path="*" element={<NotFound />} />
				</Routes>
			</BrowserRouter>
		</>
	);
}

export default App;
