import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface ApodDataInterface {
  date: string;
  explanation: string;
  title: string;
  url: string;
}

const NasaAPOD: React.FC = () => {
  const API_KEY = "iX59Z8ovbOvqAcL2EwNDqqUd7dakD9PX91VG0Xpg";

  const [apoData, setApoData] = useState<ApodDataInterface | null>(null);
  const [date, setDate] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (date?: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}${date ? `&date=${date}` : ''}`);
      setApoData(response.data);
    } catch (error) {
      console.log("Error while fetching apodData for the specified date", error);
      setError('Failed to fetch data for the selected date. Displaying today\'s data instead.');
      try {
        const response = await axios.get(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`);
        setApoData(response.data);
        setError(null); 
      } catch (error) {
        console.log("Error while fetching today's apodData", error);
        setError('Failed to fetch data. Please try again later.');
      }
    }
    setLoading(false);
  };

  const handleSearch = () => {
    fetchData(date);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-4 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300">NASA Astronomy Picture of the Day</h1>
      <div className="flex justify-center mb-4">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-2 rounded mr-2"
        />
        <button onClick={handleSearch} className="bg-slate-900 text-white p-2 rounded w-24">
          Search
        </button>
      </div>
      {loading && <div className="text-center">Loading...</div>}
      {error && <div className="text-center text-red-500">{error}</div>}
      {apoData && !loading && (
        <div className="bg-gray-100 border border-gray-200 rounded-lg shadow dark:bg-gray-800 py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row -mx-4">
              <div className="md:flex-1 px-4">
                <div className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 h-[460px] rounded-lg bg-gray-300 border border-gray-500 shadow dark:bg-gray-700 mb-4 align-middle">
                  <img className="w-full h-full object-cover" src={apoData.url} alt={apoData.title} />
                </div>
              </div>
              <div className="md:flex-1 px-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{apoData.title}</h2>
                <div>
                  <p className="text-gray-600 text-justify leading-8 dark:text-gray-300 text-lg mt-2">
                    {apoData.explanation}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NasaAPOD;