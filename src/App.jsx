import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function FinanceTools() {
  const [stocks, setStocks] = useState([]);
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loanTerm, setLoanTerm] = useState("");
  const [sipAmount, setSipAmount] = useState("");
  const [sipPeriod, setSipPeriod] = useState("");
  const [sipReturns, setSipReturns] = useState("");
  const [sipStepUp, setSipStepUp] = useState("");

  const addStock = () => {
    if (!price || !quantity) return;
    setStocks([...stocks, { price: parseFloat(price), quantity: parseInt(quantity) }]);
    setPrice("");
    setQuantity("");
  };

  const removeStock = (index) => {
    setStocks(stocks.filter((_, i) => i !== index));
  };

  const calculateAverage = () => {
    const totalCost = stocks.reduce((acc, stock) => acc + stock.price * stock.quantity, 0);
    const totalQuantity = stocks.reduce((acc, stock) => acc + stock.quantity, 0);
    return totalQuantity ? (totalCost / totalQuantity).toFixed(2) : "0.00";
  };

  const calculateEMI = () => {
    if (!loanAmount || !interestRate || !loanTerm) return { emi: "0.00", totalInterest: "0.00", totalAmount: "0.00" };
    const P = parseFloat(loanAmount);
    const r = parseFloat(interestRate) / 12 / 100;
    const n = parseInt(loanTerm);
    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalAmount = emi * n;
    const totalInterest = totalAmount - P;
    return {
      emi: emi.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      totalAmount: totalAmount.toFixed(2),
    };
  };

  const { emi, totalInterest, totalAmount } = calculateEMI();

  const calculateSIP = () => {
    if (!sipAmount || !sipPeriod || !sipReturns || sipStepUp === "") return { expectedAmount: "0.00", totalInvested: "0.00", totalGain: "0.00" };
    let P = parseFloat(sipAmount);
    const n = parseInt(sipPeriod) * 12;
    const r = parseFloat(sipReturns) / 12 / 100;
    const stepUp = parseFloat(sipStepUp) / 100;
    let FV = 0;
    let totalInvested = 0;
    for (let i = 0; i < n; i++) {
      FV += P * Math.pow(1 + r, n - i);
      totalInvested += P;
      if ((i + 1) % 12 === 0) P *= 1 + stepUp;
    }
    const totalGain = FV - totalInvested;
    return {
      expectedAmount: FV.toFixed(2),
      totalInvested: totalInvested.toFixed(2),
      totalGain: totalGain.toFixed(2),
    };
  };

  const { expectedAmount, totalInvested, totalGain } = calculateSIP();

  return (
    <div className="p-6 max-w-4xl mx-auto grid grid-cols-2 gap-6 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg shadow-lg">
      <div className="col-span-1">
        <Card className="bg-white text-black p-4 mb-6">
          <h2 className="text-xl font-bold mb-2">Stock Average Calculator</h2>
          <div className="flex space-x-2">
            <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} className="border p-2 rounded w-full text-black" />
            <input type="number" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="border p-2 rounded w-full text-black" />
            <Button onClick={addStock}>Add</Button>
          </div>
          {stocks.map((stock, index) => (
            <motion.div key={index} className="flex justify-between p-2 bg-gray-200 rounded mt-2">
              <span className="font-semibold">{index + 1}. {stock.quantity} x ₹{stock.price} = ₹{(stock.quantity * stock.price).toFixed(2)}</span>
              <Button size="sm" variant="destructive" onClick={() => removeStock(index)}>X</Button>
            </motion.div>
          ))}
          <p className="text-lg font-bold mt-3">Average Price: ₹{calculateAverage()}</p>
        </Card>
        
        <Card className="bg-white text-black p-4">
          <h2 className="text-xl font-bold mb-2">SIP Calculator</h2>
          <input type="number" placeholder="Monthly Investment Amount" value={sipAmount} onChange={(e) => setSipAmount(e.target.value)} className="border p-2 rounded w-full text-black mb-2" />
          <input type="number" placeholder="Investment Period (Years)" value={sipPeriod} onChange={(e) => setSipPeriod(e.target.value)} className="border p-2 rounded w-full text-black mb-2" />
          <input type="number" placeholder="Expected Annual Returns (%)" value={sipReturns} onChange={(e) => setSipReturns(e.target.value)} className="border p-2 rounded w-full text-black mb-2" />
          <input type="number" placeholder="Step-up (%)" value={sipStepUp} onChange={(e) => setSipStepUp(e.target.value)} className="border p-2 rounded w-full text-black mb-2" />
          <p className="mt-3 font-semibold">Expected Amount: ₹{expectedAmount}</p>
          <p>Amount Invested: ₹{totalInvested}</p>
          <p>Total Gain: ₹{totalGain}</p>
        </Card>
      </div>
      
      <div className="col-span-1">
        <Card className="bg-white text-black p-4">
          <h2 className="text-xl font-bold mb-2">EMI Calculator</h2>
          <input type="number" placeholder="Loan Amount" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} className="border p-2 rounded w-full text-black mb-2" />
          <input type="number" placeholder="Annual Interest Rate (%)" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} className="border p-2 rounded w-full text-black mb-2" />
          <input type="number" placeholder="Loan Term (Months)" value={loanTerm} onChange={(e) => setLoanTerm(e.target.value)} className="border p-2 rounded w-full text-black mb-2" />
          <p className="mt-3 font-semibold">EMI (Per month): ₹{emi}</p>
          <p>Total Principal: ₹{loanAmount}</p>
          <p>Total Interest: ₹{totalInterest}</p>
          <p>Total Amount: ₹{totalAmount}</p>
        </Card>
      </div>
    </div>
  );
}
