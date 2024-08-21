import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  balance: 0,
  loan: 0,
  loanPurpose: "",
  isLoading: false,
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    deposit(state, action) {
      state.balance += action.payload;
      state.isLoading = false;
    },
    withdraw(state, action) {
      state.balance -= action.payload;
    },
    requestLoan: {
      prepare(loanAmount, loanPurpose) {
        return { payload: { loanAmount, loanPurpose } };
      },
      reducer(state, action) {
        if (state.loan > 0) return;
        const { loanAmount, loanPurpose } = action.payload;

        state.loan = loanAmount;
        state.loanPurpose = loanPurpose;
        state.balance = state.balance + loanAmount;
      },
    },
    payLoan(state, action) {
      state.balance -= state.loan;
      state.loan = 0;
      state.loanPurpose = "";
    },
    convertingCurrency(state) {
      state.isLoading = true;
    },
  },
});

export function deposit(amount, currency) {
  if (currency === "USD") return { type: "account/deposit", payload: amount };

  return async function (dispatch, getState) {
    dispatch({ type: "account/convertingCurrency" });
    try {
      const res = await axios.get(
        `https://api.frankfurter.app/latest?amount=${amount}&from=${currency}&to=USD`
      );
      const converted = res.data.rates.USD;
      dispatch({ type: "account/deposit", payload: converted });
    } catch (err) {
      console.error(err);
    }
  };
}

export const {
  withdraw,
  requestLoan,
  payLoan,
  convertingCurrency,
  conversionComplete,
} = accountSlice.actions;

export default accountSlice.reducer;
