import CreateCustomer from "./features/customers/CreateCustomer";
import Customer from "./features/customers/Customer";
import BalanceDisplay from "./features/accounts/BalanceDisplay";
import AccountOperations from "./features/accounts/AccountOperations";
import { useSelector } from "react-redux";

function App() {
  const fullName = useSelector((state) => state.customer.fullName);
  return (
    <div>
      <h1>🏦 Redux Toolkit ⚛️</h1>
      {fullName === "" ? (
        <CreateCustomer />
      ) : (
        <>
          <Customer />
          <AccountOperations />
          <BalanceDisplay />
        </>
      )}
    </div>
  );
}

export default App;
