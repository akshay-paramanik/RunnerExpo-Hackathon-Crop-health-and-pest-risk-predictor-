import React from 'react';
import { FaLeaf } from "react-icons/fa";

export default function Nav() {
    return (
        <nav className="bg-green-500 w-full h-16 flex items-center justify-between px-4">
            <div className="text-white font-bold text-lg"><FaLeaf />Crop Health & Pest Risk Predictor</div>
            <ul className="flex space-x-4">
                <li><a href="#" className="text-white hover:text-gray-200">Home</a></li>
                <li><a href="#" className="text-white hover:text-gray-200">Predict</a></li>
                <li><a href="#" className="text-white hover:text-gray-200">About</a></li>
            </ul>
        </nav>
    );
}