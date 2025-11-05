'use client';

import { useState, useEffect } from 'react';

import Image from 'next/image';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

import { getRandomChild, searchChild, getActiveDepartments, createDonation } from '@/app/actions';

import CustomDropdown from './CustomDropdown';

import type { Department } from '@/lib/types';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ModalScreen = 'selection' | 'search' | 'child-details' | 'donation-form' | 'thank-you';

interface ChildData {
  id: string;
  recipient: string;
  age: number;
  gender: string;
  giftIdeas: string;
}

export default function DonationModal({ isOpen, onClose }: DonationModalProps) {
  const [currentScreen, setCurrentScreen] = useState<ModalScreen>('selection');
  const [selectedGender, setSelectedGender] = useState<string>('');
  const [selectedAge, setSelectedAge] = useState<string>('');
  const [selectedChild, setSelectedChild] = useState<ChildData | null>(null);
  const [donationType, setDonationType] = useState<'gift' | 'cash' | null>(null);
  const [donorName, setDonorName] = useState<string>('');
  const [donorEmail, setDonorEmail] = useState<string>('');
  const [department, setDepartment] = useState<string>('');
  const [donationAmount, setDonationAmount] = useState<string>('');
  const [isLoadingChild, setIsLoadingChild] = useState<boolean>(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoadingDepartments, setIsLoadingDepartments] = useState<boolean>(false);
  const [isSubmittingDonation, setIsSubmittingDonation] = useState<boolean>(false);

  const handleClose = () => {
    setCurrentScreen('selection');
    setSelectedGender('');
    setSelectedAge('');
    setSelectedChild(null);
    setDonationType(null);
    setDonorName('');
    setDonorEmail('');
    setDepartment('');
    setDonationAmount('');
    onClose();
  };

  // Load departments when donation form screen opens
  useEffect(() => {
    const loadDepartments = async () => {
      if (currentScreen === 'donation-form' && departments.length === 0 && !isLoadingDepartments) {
        setIsLoadingDepartments(true);
        try {
          const result = await getActiveDepartments();
          if (result.success) {
            setDepartments(result.data);
          } else {
            toast.error(result.error);
          }
        } catch (error) {
          console.error('Error loading departments:', error);
          toast.error('Failed to load departments');
        } finally {
          setIsLoadingDepartments(false);
        }
      }
    };

    loadDepartments();
  }, [currentScreen, departments.length, isLoadingDepartments]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-gray-900/10 backdrop-blur-sm z-40"
            onClick={handleClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-end pr-36">
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="relative rounded-3xl p-1"
              style={{
                width: '576px', // Fixed width (equivalent to max-w-xl)
                background: 'linear-gradient(135deg, #DC2626 0%, #059669 50%, #DC2626 100%)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Inner modal with gradient background */}
              <div
                className="relative rounded-3xl p-8 md:p-10 flex flex-col overflow-hidden"
                style={{
                  background: 'linear-gradient(to bottom, #1e293b, #0f172a)',
                  boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.1), 0 20px 60px rgba(0,0,0,0.5)',
                  height: '800px'
                }}
              >
                {/* Close Button */}
                <button
                  onClick={handleClose}
                  className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors border border-white/20"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5 text-white" />
                </button>

                {/* Modal Content */}
                <div className="space-y-8 relative z-10 flex-1 flex flex-col justify-center">
                  {/* Selection Screen */}
                  {currentScreen === 'selection' && (
                    <>
                      {/* Header */}
                      <div className="text-center">
                        <motion.h2
                          className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-400 via-yellow-300 to-green-400 bg-clip-text text-transparent"
                          animate={{
                            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                          }}
                          transition={{
                            duration: 5,
                            repeat: Infinity,
                            ease: 'linear'
                          }}
                          style={{
                            backgroundSize: '200% 200%'
                          }}
                        >
                          Choose a Gift Recipient
                        </motion.h2>
                        <p className="mt-3 text-lg text-gray-300">
                          Select how you&apos;d like to choose a child to help this Christmas
                        </p>
                      </div>

                      {/* Button Options */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    {/* Any Child Button */}
                    <motion.button
                      whileHover={!isLoadingChild ? { scale: 1.05, y: -2 } : {}}
                      whileTap={!isLoadingChild ? { scale: 0.98 } : {}}
                      transition={{ duration: 0.1, ease: 'easeOut' }}
                      onClick={async () => {
                        if (isLoadingChild) return;

                        setIsLoadingChild(true);
                        const result = await getRandomChild();
                        setIsLoadingChild(false);

                        if (result.success) {
                          setSelectedChild(result.data);
                          setCurrentScreen('child-details');
                        } else {
                          toast.error(result.error);
                        }
                      }}
                      disabled={isLoadingChild}
                      className="group relative overflow-hidden text-white font-bold py-8 px-6 rounded-2xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        background: 'linear-gradient(to bottom, #EF4444, #DC2626)',
                        boxShadow: '0 4px 14px rgba(220, 38, 38, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)'
                      }}
                    >
                      {/* Glow effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-red-400/0 via-red-300/30 to-red-400/0"
                        animate={{
                          x: ['-100%', '100%'],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'linear'
                        }}
                      />

                      <div className="relative z-10 flex flex-col items-center gap-3">
                        <Image
                          src="/boy-girl-together.png"
                          alt="Children"
                          width={80}
                          height={80}
                          className="object-contain"
                        />
                        <span className="text-xl">{isLoadingChild ? 'Finding a child...' : 'Any Child'}</span>
                      </div>
                    </motion.button>

                    {/* Choose a Child Button */}
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.1, ease: 'easeOut' }}
                      onClick={() => setCurrentScreen('search')}
                      className="group relative overflow-hidden text-white font-bold py-8 px-6 rounded-2xl cursor-pointer"
                      style={{
                        background: 'linear-gradient(to bottom, #10B981, #059669)',
                        boxShadow: '0 4px 14px rgba(5, 150, 105, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)'
                      }}
                    >
                      {/* Glow effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-300/30 to-green-400/0"
                        animate={{
                          x: ['-100%', '100%'],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'linear',
                          delay: 1
                        }}
                      />

                      <div className="relative z-10 flex flex-col items-center gap-3">
                        <Image
                          src="/girl.png"
                          alt="Child"
                          width={80}
                          height={80}
                          className="object-contain"
                        />
                        <span className="text-xl">Choose a Child</span>
                      </div>
                    </motion.button>
                      </div>
                    </>
                  )}

                  {/* Search Screen */}
                  {currentScreen === 'search' && (
                    <>
                      {/* Header */}
                      <div className="text-center">
                        <motion.h2
                          className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-400 via-yellow-300 to-green-400 bg-clip-text text-transparent"
                          style={{
                            backgroundSize: '200% 200%'
                          }}
                        >
                          Choose a Child
                        </motion.h2>
                        <p className="mt-3 text-lg text-gray-300">
                          Select the age and gender to find a child
                        </p>
                      </div>

                      {/* Search Form */}
                      <div className="space-y-6 mt-8">
                        {/* Gender Dropdown */}
                        <CustomDropdown
                          id="gender"
                          label="Gender"
                          value={selectedGender}
                          onChange={setSelectedGender}
                          options={[
                            { value: 'any', label: 'Any' },
                            { value: 'male', label: 'Male' },
                            { value: 'female', label: 'Female' }
                          ]}
                          placeholder="Select gender..."
                        />

                        {/* Age Dropdown */}
                        <CustomDropdown
                          id="age"
                          label="Age"
                          value={selectedAge}
                          onChange={setSelectedAge}
                          options={[
                            { value: 'any', label: 'Any age' },
                            ...Array.from({ length: 17 }, (_, i) => i + 1).map(age => ({
                              value: age.toString(),
                              label: `${age} ${age === 1 ? 'year' : 'years'} old`
                            }))
                          ]}
                          placeholder="Select age..."
                        />

                        {/* Search Button */}
                        <motion.button
                          whileHover={!isLoadingChild ? { scale: 1.02 } : {}}
                          whileTap={!isLoadingChild ? { scale: 0.98 } : {}}
                          onClick={async () => {
                            if (isLoadingChild) return;

                            // Validate at least one selection made
                            if (!selectedGender && !selectedAge) {
                              toast.error('Please select at least gender or age');
                              return;
                            }

                            setIsLoadingChild(true);

                            // If BOTH are 'any', use fully random
                            if ((selectedGender === 'any' || !selectedGender) && (selectedAge === 'any' || !selectedAge)) {
                              const result = await getRandomChild();
                              setIsLoadingChild(false);

                              if (result.success) {
                                setSelectedChild(result.data);
                                setCurrentScreen('child-details');
                              } else {
                                toast.error(result.error);
                              }
                            } else {
                              // At least one is specific - use search with optional params
                              const searchParams: { gender?: string; age?: number } = {};

                              // Only add gender if it's not 'any'
                              if (selectedGender && selectedGender !== 'any') {
                                searchParams.gender = selectedGender;
                              }

                              // Only add age if it's not 'any'
                              if (selectedAge && selectedAge !== 'any') {
                                searchParams.age = parseInt(selectedAge);
                              }

                              const result = await searchChild(searchParams);
                              setIsLoadingChild(false);

                              if (result.success) {
                                setSelectedChild(result.data);
                                setCurrentScreen('child-details');
                              } else {
                                toast.error(result.error);
                              }
                            }
                          }}
                          disabled={isLoadingChild}
                          className="w-full relative overflow-hidden text-white font-bold py-4 px-6 rounded-xl mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{
                            background: 'linear-gradient(to bottom, #10B981, #059669)',
                            boxShadow: '0 4px 14px rgba(5, 150, 105, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)'
                          }}
                        >
                          {/* Glow effect */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-300/30 to-green-400/0"
                            animate={{
                              x: ['-100%', '100%'],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: 'linear'
                            }}
                          />
                          <span className="relative z-10">{isLoadingChild ? 'Searching...' : 'Search'}</span>
                        </motion.button>
                      </div>

                      {/* Back Button */}
                      <button
                        onClick={() => setCurrentScreen('selection')}
                        className="w-full text-gray-300 hover:text-white font-medium py-3 transition-colors mt-4"
                      >
                        ← Back
                      </button>
                    </>
                  )}

                  {/* Child Details Screen */}
                  {currentScreen === 'child-details' && selectedChild && (
                    <>
                      {/* Header */}
                      <div className="text-center flex flex-col items-center">
                        <Image
                          src={selectedChild.gender === 'male' ? '/boy.png' : '/girl.png'}
                          alt={selectedChild.gender === 'male' ? 'Boy' : 'Girl'}
                          width={120}
                          height={120}
                          className="object-contain"
                        />
                        <motion.h2
                          className="mt-4 text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-400 via-yellow-300 to-green-400 bg-clip-text text-transparent"
                          style={{
                            backgroundSize: '200% 200%'
                          }}
                        >
                          {selectedChild.recipient}
                        </motion.h2>
                        <p className="mt-2 text-lg text-gray-300">
                          {selectedChild.age} year{selectedChild.age !== 1 ? 's' : ''} old
                        </p>
                      </div>

                      {/* Gift Ideas */}
                      <div className="mt-8 bg-white/5 rounded-xl p-6 border border-white/10 text-center">
                        <h3 className="text-lg font-semibold text-yellow-300 mb-3">Has written to Santa and asked for...</h3>
                        <p className="text-gray-200 leading-relaxed">
                          {selectedChild.giftIdeas}
                        </p>
                      </div>

                      {/* Donation Buttons */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                        {/* Donate Gift Button */}
                        <motion.button
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ duration: 0.1, ease: 'easeOut' }}
                          onClick={() => {
                            setDonationType('gift');
                            setCurrentScreen('donation-form');
                          }}
                          className="group relative overflow-hidden text-white font-bold py-8 px-6 rounded-2xl cursor-pointer"
                          style={{
                            background: 'linear-gradient(to bottom, #EF4444, #DC2626)',
                            boxShadow: '0 4px 14px rgba(220, 38, 38, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)'
                          }}
                        >
                          {/* Glow effect */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-red-400/0 via-red-300/30 to-red-400/0"
                            animate={{
                              x: ['-100%', '100%'],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: 'linear'
                            }}
                          />
                          <div className="relative z-10 flex flex-col items-center gap-3">
                            <span className="text-xl">Donate Gift</span>
                          </div>
                        </motion.button>

                        {/* Donate Cash Button */}
                        <motion.button
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ duration: 0.1, ease: 'easeOut' }}
                          onClick={() => {
                            setDonationType('cash');
                            setCurrentScreen('donation-form');
                          }}
                          className="group relative overflow-hidden text-white font-bold py-8 px-6 rounded-2xl cursor-pointer"
                          style={{
                            background: 'linear-gradient(to bottom, #10B981, #059669)',
                            boxShadow: '0 4px 14px rgba(5, 150, 105, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)'
                          }}
                        >
                          {/* Glow effect */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-300/30 to-green-400/0"
                            animate={{
                              x: ['-100%', '100%'],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: 'linear',
                              delay: 1
                            }}
                          />
                          <div className="relative z-10 flex flex-col items-center gap-3">
                            <span className="text-xl">Donate Cash</span>
                          </div>
                        </motion.button>
                      </div>

                      {/* Back Button */}
                      <button
                        onClick={() => setCurrentScreen('search')}
                        className="w-full text-gray-300 hover:text-white font-medium py-3 transition-colors mt-6"
                      >
                        ← Back
                      </button>
                    </>
                  )}

                  {/* Donation Form Screen */}
                  {currentScreen === 'donation-form' && selectedChild && donationType && (
                    <>
                      {/* Header */}
                      <div className="text-center">
                        <motion.h2
                          className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-400 via-yellow-300 to-green-400 bg-clip-text text-transparent"
                          style={{
                            backgroundSize: '200% 200%'
                          }}
                        >
                          {donationType === 'gift' ? 'Donate a Gift' : 'Donate Cash'}
                        </motion.h2>
                        <p className="mt-3 text-lg text-gray-300">
                          For {selectedChild.recipient}
                        </p>
                      </div>

                      {/* Donation Form */}
                      <div className="space-y-6 mt-8">
                        {/* Full Name Input */}
                        <div>
                          <label htmlFor="donorName" className="block text-sm font-medium text-gray-300 mb-2">
                            Your Full Name
                          </label>
                          <input
                            type="text"
                            id="donorName"
                            value={donorName}
                            onChange={(e) => {
                              // Allow only letters, spaces, hyphens, and apostrophes
                              const value = e.target.value.replace(/[^a-zA-Z\s\-']/g, '');
                              setDonorName(value);
                            }}
                            placeholder="e.g., John Smith or Mary-Jane O'Brien"
                            className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                        </div>

                        {/* Email Input (username only) */}
                        <div>
                          <label htmlFor="donorEmail" className="block text-sm font-medium text-gray-300 mb-2">
                            Your Work Email
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              id="donorEmail"
                              value={donorEmail}
                              onChange={(e) => {
                                // Allow only lowercase letters, numbers, dots, and hyphens
                                const value = e.target.value.toLowerCase().replace(/[^a-z0-9.\-]/g, '');
                                setDonorEmail(value);
                              }}
                              placeholder="e.g., john.smith"
                              className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                              @ans-group.co.uk
                            </div>
                          </div>
                          {donorEmail && (
                            <p className="mt-1 text-sm text-gray-400">
                              Full email: {donorEmail}@ans-group.co.uk
                            </p>
                          )}
                        </div>

                        {/* Department Dropdown */}
                        <CustomDropdown
                          id="department"
                          label="Department"
                          value={department}
                          onChange={setDepartment}
                          options={departments.map(dept => ({
                            value: dept.id,
                            label: dept.name
                          }))}
                          placeholder={isLoadingDepartments ? "Loading departments..." : "Select department..."}
                          disabled={isLoadingDepartments}
                        />

                        {/* Donation Amount (Cash only) */}
                        {donationType === 'cash' && (
                          <div>
                            <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-2">
                              Donation Amount (£)
                            </label>
                            <input
                              type="number"
                              id="amount"
                              value={donationAmount || '20'}
                              onChange={(e) => setDonationAmount(e.target.value)}
                              step="0.01"
                              min="20"
                              className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                          </div>
                        )}

                        {/* Submit Button */}
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={async () => {
                            if (isSubmittingDonation) return;

                            // Client-side validation
                            const trimmedName = donorName.trim();

                            if (!trimmedName) {
                              toast.error('Please enter your name');
                              return;
                            }

                            // Check for at least 2 words (first and last name)
                            const nameParts = trimmedName.split(/\s+/);
                            if (nameParts.length < 2) {
                              toast.error('Please enter your full name (first and last name)');
                              return;
                            }

                            // Auto-capitalize each part of the name
                            const capitalizedName = nameParts
                              .map(part => {
                                // Handle hyphenated names (e.g., Mary-Jane, Smith-Jones)
                                return part.split('-')
                                  .map(subPart => subPart.charAt(0).toUpperCase() + subPart.slice(1).toLowerCase())
                                  .join('-');
                              })
                              .join(' ');

                            // Validate email username
                            const trimmedEmail = donorEmail.trim();
                            if (!trimmedEmail) {
                              toast.error('Please enter your work email');
                              return;
                            }

                            // Basic email username validation (at least 2 characters, valid format)
                            if (trimmedEmail.length < 2) {
                              toast.error('Email username must be at least 2 characters');
                              return;
                            }

                            // Construct full email
                            const fullEmail = `${trimmedEmail}@ans-group.co.uk`;

                            if (!department) {
                              toast.error('Please select your department');
                              return;
                            }

                            if (donationType === 'cash' && !donationAmount) {
                              toast.error('Please enter a donation amount');
                              return;
                            }

                            if (donationType === 'cash' && parseFloat(donationAmount) < 20) {
                              toast.error('Minimum donation amount is £20');
                              return;
                            }

                            // Submit donation
                            setIsSubmittingDonation(true);
                            const result = await createDonation({
                              childId: selectedChild.id,
                              donorName: capitalizedName,
                              donorEmail: fullEmail,
                              departmentId: department,
                              donationType: donationType,
                              amount: donationType === 'cash' ? parseFloat(donationAmount) : undefined
                            });
                            setIsSubmittingDonation(false);

                            if (result.success) {
                              toast.success('Donation submitted successfully!');
                              setCurrentScreen('thank-you');
                            } else {
                              toast.error(result.error);
                            }
                          }}
                          disabled={isSubmittingDonation}
                          className="w-full relative overflow-hidden text-white font-bold py-4 px-6 rounded-xl mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{
                            background: 'linear-gradient(to bottom, #10B981, #059669)',
                            boxShadow: '0 4px 14px rgba(5, 150, 105, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)'
                          }}
                        >
                          {/* Glow effect */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-300/30 to-green-400/0"
                            animate={{
                              x: ['-100%', '100%'],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: 'linear'
                            }}
                          />
                          <span className="relative z-10">
                            {isSubmittingDonation ? 'Submitting...' : 'Submit Donation'}
                          </span>
                        </motion.button>
                      </div>

                      {/* Back Button */}
                      <button
                        onClick={() => setCurrentScreen('child-details')}
                        className="w-full text-gray-300 hover:text-white font-medium py-3 transition-colors mt-4"
                      >
                        ← Back
                      </button>
                    </>
                  )}

                  {/* Thank You Screen */}
                  {currentScreen === 'thank-you' && selectedChild && donationType && (
                    <>
                      {/* Header */}
                      <div className="text-center">
                        <motion.h2
                          className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-red-400 via-yellow-300 to-green-400 bg-clip-text text-transparent mb-6"
                          style={{
                            backgroundSize: '200% 200%'
                          }}
                        >
                          Thank You!
                        </motion.h2>
                        <div className="space-y-4 text-gray-200 text-lg">
                          {donationType === 'gift' ? (
                            <p>
                              Thank you for donating a gift to <span className="text-yellow-300 font-semibold">{selectedChild.recipient}</span>! Your donation has been registered and you&apos;ll receive details about gift delivery shortly.
                            </p>
                          ) : (
                            <p>
                              Thank you for donating <span className="text-yellow-300 font-semibold">£{donationAmount ? parseFloat(donationAmount).toFixed(2) : '20.00'}</span> to <span className="text-yellow-300 font-semibold">{selectedChild.recipient}</span>! This amount will be deducted from your next payslip and go directly toward making their Christmas special.
                            </p>
                          )}
                          <p className="text-gray-300 mt-6">
                            You&apos;re making this Christmas magical! 🎄
                          </p>
                        </div>
                      </div>

                      {/* Close Button */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleClose}
                        className="w-full relative overflow-hidden text-white font-bold py-4 px-6 rounded-xl mt-12"
                        style={{
                          background: 'linear-gradient(to bottom, #10B981, #059669)',
                          boxShadow: '0 4px 14px rgba(5, 150, 105, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)'
                        }}
                      >
                        <span className="relative z-10">Close</span>
                      </motion.button>
                    </>
                  )}
                </div>

                {/* Subtle pattern overlay */}
                <div
                  className="absolute inset-0 opacity-5 rounded-3xl pointer-events-none"
                  style={{
                    backgroundImage: 'radial-gradient(circle at 20px 20px, white 1px, transparent 0)',
                    backgroundSize: '40px 40px'
                  }}
                />
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
