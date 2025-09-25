import React from 'react';

const Home = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <h1 className="text-4xl font-bold text-center text-blue-600">Welcome to My Portfolio</h1>
            <p className="mt-4 text-lg text-gray-700">This is the home page of my personal website built with React and Tailwind CSS.</p>
            <div className="mt-8">
                <a href="#projects" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300">View My Projects</a>
            </div>
        </div>
    );
};

export default Home;