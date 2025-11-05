'use client';

import { useState } from 'react';

type Child = {
  id: string;
  recipient: string;
  age: number;
  gender: string;
  giftIdeas: string;
};

type PopupStep =
  | 'initial'
  | 'specify'
  | 'loading'
  | 'details'
  | 'donation-form'
  | 'thank-you';

type DonationType = 'gift' | 'cash';

interface DonationPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DonationPopup({ isOpen, onClose }: DonationPopupProps) {
  const [step, setStep] = useState<PopupStep>('initial');
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [donationType, setDonationType] = useState<DonationType | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [donorName, setDonorName] = useState('');
  const [department, setDepartment] = useState('');
  const [cashAmount, setCashAmount] = useState('');

  const resetState = () => {
    setStep('initial');
    setSelectedChild(null);
    setDonationType(null);
    setError(null);
    setGender('');
    setAge('');
    setDonorName('');
    setDepartment('');
    setCashAmount('');
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const fetchRandomChild = async () => {
    setStep('loading');
    setError(null);

    try {
      const response = await fetch('/api/random-child');
      if (!response.ok) {
        throw new Error('Failed to fetch child');
      }
      const child = await response.json();
      setSelectedChild(child);
      setStep('details');
    } catch {
      setError('Unable to fetch recipient details. Please try again.');
      setStep('initial');
    }
  };

  const fetchChildByCriteria = async () => {
    if (!gender || !age) {
      setError('Please select both gender and age');
      return;
    }

    setStep('loading');
    setError(null);

    try {
      const response = await fetch(
        `/api/search-child?gender=${gender}&age=${age}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch child');
      }
      const child = await response.json();
      setSelectedChild(child);
      setStep('details');
    } catch {
      setError('No matching children found. Please try different criteria.');
      setStep('specify');
    }
  };

  const handleDonationSubmit = async () => {
    if (!donorName || !department || !selectedChild || !donationType) {
      setError('Please fill in all required fields');
      return;
    }

    if (donationType === 'cash' && !cashAmount) {
      setError('Please enter a donation amount');
      return;
    }

    setStep('loading');
    setError(null);

    try {
      const response = await fetch('/api/donation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          childId: selectedChild.id,
          donorName,
          department,
          donationType,
          amount: donationType === 'cash' ? parseFloat(cashAmount) : null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit donation');
      }

      setStep('thank-you');
    } catch {
      setError('Unable to submit donation. Please try again.');
      setStep('donation-form');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-800/30 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white p-4 md:p-8 rounded-2xl relative w-full md:min-w-[500px] md:min-h-[500px] md:max-w-[500px] md:max-h-[600px] shadow-2xl flex flex-col items-center justify-center overflow-y-auto max-h-[90vh]">
        <button
          onClick={handleClose}
          className="absolute right-6 top-4 text-3xl font-light text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          &times;
        </button>

        {error && (
          <div className="absolute top-16 left-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {step === 'initial' && (
          <>
            <h2 className="text-xl md:text-2xl font-bold mb-2 text-[#2b0e05] text-center">
              Choose a Gift Recipient
            </h2>
            <p className="text-gray-600 mb-6 text-center px-4">
              Select how you&apos;d like to choose your gift recipient
            </p>
            <div className="flex flex-col md:flex-row justify-center gap-4 mt-auto mb-6 w-full px-4">
              <button
                onClick={fetchRandomChild}
                className="w-full md:w-[160px] px-6 py-3 bg-[#620e07] text-white font-medium rounded-lg transition-all duration-200 hover:bg-[#2b0e05] hover:shadow-lg active:transform active:scale-95"
              >
                Any Child
              </button>
              <button
                onClick={() => setStep('specify')}
                className="w-full md:w-[160px] px-6 py-3 bg-[#b06447] text-white font-medium rounded-lg transition-all duration-200 hover:bg-[#684d32] hover:shadow-lg active:transform active:scale-95"
              >
                Specify Child
              </button>
            </div>
          </>
        )}

        {step === 'specify' && (
          <>
            <h2 className="text-2xl font-bold mb-4 text-[#2b0e05]">
              Specify Child Criteria
            </h2>
            <div className="flex flex-col items-center gap-4 mb-6 w-full max-w-md">
              <div className="w-full">
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Gender:
                </label>
                <select
                  id="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div className="w-full">
                <label
                  htmlFor="age"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Age:
                </label>
                <select
                  id="age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="">Select Age</option>
                  {Array.from({ length: 17 }, (_, i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={fetchChildByCriteria}
                className="w-[160px] px-6 py-3 bg-[#b06447] text-white font-medium rounded-lg transition-all duration-200 hover:bg-[#684d32] hover:shadow-lg active:transform active:scale-95 mt-4"
              >
                Search
              </button>
            </div>
          </>
        )}

        {step === 'loading' && (
          <div className="flex flex-col items-center justify-center flex-grow">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#620e07] mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        )}

        {step === 'details' && selectedChild && (
          <>
            <h2 className="text-2xl font-bold mb-4 text-[#2b0e05]">
              Gift Recipient Details
            </h2>
            <div className="text-left mb-8 w-full max-w-md">
              <p className="mb-2">
                <strong>Recipient:</strong> {selectedChild.recipient}
              </p>
              <p className="mb-2">
                <strong>Age:</strong> {selectedChild.age}
              </p>
              <p className="mb-2">
                <strong>Gender:</strong> {selectedChild.gender}
              </p>
              <p className="mb-2">
                <strong>Gift Ideas:</strong> {selectedChild.giftIdeas}
              </p>
            </div>
            <div className="flex flex-row justify-center gap-4 mt-auto mb-6">
              <button
                onClick={() => {
                  setDonationType('gift');
                  setStep('donation-form');
                }}
                className="w-[160px] px-6 py-3 bg-[#620e07] text-white font-medium rounded-lg transition-all duration-200 hover:bg-[#2b0e05] hover:shadow-lg active:transform active:scale-95"
              >
                Donate Gift
              </button>
              <button
                onClick={() => {
                  setDonationType('cash');
                  setStep('donation-form');
                }}
                className="w-[160px] px-6 py-3 bg-[#b06447] text-white font-medium rounded-lg transition-all duration-200 hover:bg-[#684d32] hover:shadow-lg active:transform active:scale-95"
              >
                Donate Cash
              </button>
            </div>
          </>
        )}

        {step === 'donation-form' && donationType && (
          <>
            <h2 className="text-2xl font-bold mb-4 text-[#2b0e05]">
              Donate {donationType === 'cash' ? 'Cash' : 'a Gift'}
            </h2>
            <div className="flex flex-col items-center gap-4 w-full max-w-md mx-auto">
              <div className="w-full">
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name:
                </label>
                <input
                  type="text"
                  id="fullName"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div className="w-full">
                <label
                  htmlFor="department"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Department:
                </label>
                <select
                  id="department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="">Select Department</option>
                  <option value="marketing">Marketing</option>
                  <option value="sales">Sales</option>
                  <option value="accounts">Accounts</option>
                </select>
              </div>
              {donationType === 'cash' && (
                <div className="w-full">
                  <label
                    htmlFor="cashAmount"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Donation Amount (£):
                  </label>
                  <input
                    type="number"
                    id="cashAmount"
                    value={cashAmount}
                    onChange={(e) => setCashAmount(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                    min="0"
                    step="0.01"
                    placeholder="Enter amount"
                  />
                </div>
              )}
              <div className="flex flex-row justify-center gap-4 mt-auto mb-6">
                <button
                  onClick={handleDonationSubmit}
                  className="w-[160px] px-6 py-3 bg-[#620e07] text-white font-medium rounded-lg transition-all duration-200 hover:bg-[#2b0e05] hover:shadow-lg active:transform active:scale-95"
                >
                  Submit
                </button>
                <button
                  onClick={() => setStep('details')}
                  className="w-[160px] px-6 py-3 bg-[#b06447] text-white font-medium rounded-lg transition-all duration-200 hover:bg-[#684d32] hover:shadow-lg active:transform active:scale-95"
                >
                  Back
                </button>
              </div>
            </div>
          </>
        )}

        {step === 'thank-you' && (
          <div className="flex flex-col items-center justify-center h-full">
            <h2 className="text-2xl font-bold mb-4 text-[#2b0e05]">
              Thank You!
            </h2>
            <p className="text-gray-600 text-center">
              Your {donationType} donation
              {donationType === 'cash' && cashAmount
                ? ` of £${parseFloat(cashAmount).toFixed(2)}`
                : ''}{' '}
              has been registered successfully.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
