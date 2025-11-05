'use client'

import { useState } from 'react'

export default function HeartStories() {
  const stories = [
    {
      id: 1,
      childName: 'Emma',
      age: 7,
      donorName: 'Sarah',
      department: 'Marketing',
      gift: 'art supplies',
      story: "Thanks to Sarah from Marketing, Emma, age 7, will have a complete set of art supplies under her tree this Christmas. Emma loves to draw and has been asking for colored pencils and a sketchbook."
    },
    {
      id: 2,
      childName: 'Marcus',
      age: 10,
      donorName: 'David',
      department: 'Engineering',
      gift: 'science kit',
      story: "David from Engineering made Marcus's dream come true with a chemistry set! Marcus, age 10, wants to be a scientist when he grows up and can't wait to start experimenting."
    },
    {
      id: 3,
      childName: 'Sofia',
      age: 5,
      donorName: 'Lisa',
      department: 'Sales',
      gift: 'books and teddy bear',
      story: "Lisa from Sales brought magic to Sofia's Christmas with a collection of picture books and a soft teddy bear. Sofia, age 5, loves bedtime stories and now has new adventures to explore."
    },
    {
      id: 4,
      childName: 'Alex',
      age: 8,
      donorName: 'Mike',
      department: 'Design',
      gift: 'building blocks',
      story: "Mike from Design gifted Alex, age 8, an amazing building set! Alex loves creating and constructing, and now he has endless possibilities to build his dream castles and spaceships."
    }
  ]

  const [currentStory, setCurrentStory] = useState(0)

  const nextStory = () => {
    setCurrentStory((prev) => (prev + 1) % stories.length)
  }

  const prevStory = () => {
    setCurrentStory((prev) => (prev - 1 + stories.length) % stories.length)
  }

  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Real Christmas Magic
          </h2>
          <p className="text-lg md:text-xl text-slate-600">
            Every gift tells a story of kindness and hope
          </p>
        </div>

        {/* Story carousel */}
        <div className="relative">
          <div className="bg-gradient-to-br from-red-50 to-green-50 rounded-2xl p-8 border border-red-200 shadow-sm">
            <div className="text-center mb-6">
              <div className="text-4xl mb-4">❤️</div>
              <div className="text-lg md:text-xl text-slate-700 leading-relaxed">
                {stories[currentStory].story}
              </div>
            </div>

            {/* Story details */}
            <div className="flex justify-center items-center gap-4 text-sm text-slate-500">
              <span>Story {currentStory + 1} of {stories.length}</span>
              <span>•</span>
              <span>From {stories[currentStory].department}</span>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              onClick={prevStory}
              className="p-2 rounded-full bg-white border border-slate-300 hover:bg-slate-50 transition-colors"
              aria-label="Previous story"
            >
              <span className="text-xl">←</span>
            </button>

            {/* Dots indicator */}
            <div className="flex gap-2">
              {stories.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStory(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentStory ? 'bg-red-500' : 'bg-slate-300'
                  }`}
                  aria-label={`Go to story ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextStory}
              className="p-2 rounded-full bg-white border border-slate-300 hover:bg-slate-50 transition-colors"
              aria-label="Next story"
            >
              <span className="text-xl">→</span>
            </button>
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center mt-12">
          <div className="p-6 bg-yellow-50 rounded-2xl border border-yellow-200">
            <div className="text-lg font-semibold text-yellow-800 mb-2">
              ✨ Create Your Own Christmas Story
            </div>
            <div className="text-yellow-700 mb-4">
              Choose a child and become part of their Christmas magic
            </div>
            <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-full font-semibold transition-colors">
              Start Your Story
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}