const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// All currencies
app.get("/getAllCurrencies", async (req, res) => {
  const nameURL = `https://openexchangerates.org/api/currencies.json?app_id=017781910ac546ec92128cf30fc72c2a`;

  try {
    const nameResponse = await axios.get(nameURL);
    const nameData = nameResponse.data;
    return res.json(nameData);
  } catch (err) {
    console.error(err);
  }
});

// Get the target amount
app.get("/convert", async (req, res) => {
  const { date, sourceCurrency, targetCurrency, amountInSourceCurrency } = req.query;

  try {
    const dataURL = `https://openexchangerates.org/api/historical/${date}.json?app_id=017781910ac546ec92128cf30fc72c2a`;
    const dataResponse = await axios.get(dataURL);
    const rates = dataResponse.data.rates;

    const sourceRate = rates[sourceCurrency];
    const targetRate = rates[targetCurrency];

    const targetAmount = (targetRate / sourceRate) * amountInSourceCurrency;

    const currencyNamesURL = `https://openexchangerates.org/api/currencies.json?app_id=017781910ac546ec92128cf30fc72c2a`;
    const currencyNamesResponse = await axios.get(currencyNamesURL);
    const currencyNames = currencyNamesResponse.data;

    return res.json({
      amountInTargetCurrency: targetAmount,
      sourceCurrencyName: currencyNames[sourceCurrency],
      targetCurrencyName: currencyNames[targetCurrency],
    });
  } catch (err) {
    console.error(err);
  }
});

// Listen to a port

//listen to aport
app.listen(5000,()=>{
  console.log("SERVER STARTED");
})