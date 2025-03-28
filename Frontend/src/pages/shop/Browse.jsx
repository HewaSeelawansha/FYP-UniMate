import React, { useEffect, useState } from 'react';
import Cards from '../../components/Cards';
import { FaFilter, FaSearch } from 'react-icons/fa'

const Browse = () => {
  const [hostel, setHostel] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOptions, setSortOptions] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [searchQuery, setSearchQuery] = useState('');
  //loading data
  useEffect(()=>{
    //fetch data
    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:3000/listing');
            const data = await response.json();
            const availableItems = data.filter((item) => item.available >= 0);
            //console.log(data);
            setHostel(availableItems);
            setFilteredItems(availableItems);
        } catch (error) {
            console.log("Error fetching data: ",error);
        }
    };
    //calling function
    fetchData();
  },[]);

  const filterItems = (type) => {
    const filtered = type === "all" ? hostel : hostel.filter((item) => item.type === type);

    setFilteredItems(filtered);
    setSelectedCategory(type);
    setCurrentPage(1);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    applyFilters(selectedCategory, event.target.value);
    setCurrentPage(1);
  };

  //show all dat
  const showAll = () => {
    setFilteredItems(hostel);
    setSelectedCategory("all");
    setCurrentPage(1);
  }

  const applyFilters = (category, search) => {
    let filtered = category === "all" ? hostel : hostel.filter((item) => item.type === category);
    
    if (search.trim() !== '') {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    setFilteredItems(filtered);
  };

  //sorting based on A-Z likewise
  const handleSortChange = (option) => {
    setSortOptions(option);
    let sortedItems = [...filteredItems]
    //logic
    switch(option) {
        case "newly":
        sortedItems.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
        case "A-Z":
            sortedItems.sort((a, b) => a.name.localeCompare(b.name))
            break;
        case "Z-A":
            sortedItems.sort((a, b) => b.name.localeCompare(a.name))
            break;
        case "low-high":
            sortedItems.sort((a, b) => a.price - b.price)
            break;
        case "high-low":
            sortedItems.sort((a, b) => b.price - a.price)
            break;
        default:
            break;
    }
    setFilteredItems(sortedItems);
    setCurrentPage(1);
  }
  // pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems?.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
        {/*menu banner*/}
        <div className='section-container bg-gradient-to-r from-[#FAFAFA] from-0 to-[#FCFCFC] to-100% mb-10'>
            <div className='py-48 flex flex-col justify-center items-center gap-8'>
                {/*text*/}
                <div className='text-center space-y-7 px-4'>
                    <h2 className='md:text-5xl text-4xl font-bold md:leading-snug leading-snug'>For the 
                    <span className='text-green'> Love </span>of Comfortable Living</h2>
                    <p className='mx-auto md:w-4/5 text-xl text-[#4A4A4A]'>Find the perfect boarding house for your university life! Explore affordable, safe, and student-friendly accommodations with essential amenities, all designed to make your stay comfortable and convenient. Your home away from home is just a click away!</p>
                    {/* Search Bar */}
                    <div className='flex justify-center items-center my-4'>
                        <div className='relative'>
                        <input
                            type='text'
                            placeholder='Search boardings...'
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className='px-4 py-2 w-80 border rounded-full'
                        />
                        <FaSearch className='absolute right-3 top-3 text-gray-500' />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {/*menu items*/}
        <div className='section-container'>
            {/*filtering & sorting*/}
            <div className='flex flex-col md:flex-row flex-wrap md:justify-between items-center space-y-3 mb-6'>
                {/*btns*/}
                <div className='flex flex-row justify-start md:items-center md:gap-8 gap-4 flex-wrap mt-5'>
                    <button onClick={showAll} className={selectedCategory === "all" ? "active" : ""}>All</button>
                    <button onClick={() => filterItems("1-Person Boarding Room")} className={selectedCategory === "1-Person Boarding Room" ? "active" : ""}>1 Person</button>
                    <button onClick={() => filterItems("2-Person Shared Room")} className={selectedCategory === "2-Person Shared Room" ? "active" : ""}>2 Person</button>
                    <button onClick={() => filterItems("2 to 4-Person Shared Room")} className={selectedCategory === "2 to 4-Person Shared Room" ? "active" : ""}>2-4 Person</button>
                    <button onClick={() => filterItems("Whole House-Short Term")} className={selectedCategory === "Whole House-Short Term" ? "active" : ""}>Whole House-ST</button>
                    <button onClick={() => filterItems("Whole House-Long Term")} className={selectedCategory === "Whole House-Long Term" ? "active" : ""}>Whole House-LT</button>
                </div>
                {/*sort*/}
                <div className='flex justify-end mb-4 rounded-sm'> 
                    <div className='bg-green p-2'>
                        <FaFilter className='h-4 w-4 text-black'/>
                    </div>
                    {/*sorting options*/}
                    <select name="sort" id='sort' onChange={(e) => handleSortChange(e.target.value)} value={sortOptions} className='bg-black text-white px-2 py-1 rounded-sm'>
                        <option value='' disabled>Sort by</option>
                        <option value="newly">Newest First</option>
                        <option value="A-Z">A-Z</option>
                        <option value="Z-A">Z-A</option>
                        <option value="low-high">Price(Low to High)</option>
                        <option value="high-low">Price(High to Low)</option>
                    </select>
                </div>
            </div>
            {/*produc card*/}
            <div className='grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-4'>
                {
                    currentItems.map((item) => (
                        <Cards key={item._id} item={item}/>
                    ))
                }
            </div>
        </div>
        {/*pagination*/}
        <div className='flex justify-center my-8'>
            {
                Array.from({length: Math.ceil(filteredItems.length / itemsPerPage)}).map((_, index) =>(
                    <button key={index + 1} onClick={() => paginate(index + 1)} className={`${currentPage === index + 1? 'bg-green text-white' : 'bg-gray-100'} px-3 mx-1 py-1 font-semibold rounded-full`}>
                        {index + 1}
                    </button>
                ))
            }
        </div>
    </div>
  )
}

export default Browse
