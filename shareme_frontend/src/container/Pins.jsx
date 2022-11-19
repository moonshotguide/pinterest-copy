import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Navbar, Feed, PinDetail, CreatePin, Search } from '../components';

const Pins = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="px-2 md:px-5">
      <div className="bg-slate-100 dark:bg-slate-800 dark:bg-grid-slate-100/[0.03] dark:bg-[center_top_-1px] dark:border dark:border-slate-100/5 bg-hero-pattern">
        Pins
      </div>
    </div>
  )
}

export default Pins
