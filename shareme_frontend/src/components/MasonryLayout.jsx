import React from 'react';
import Masonry from 'react-masonry-css';
import Pin from './Pin';

const breakpointColumnsObj = {
  defaul: 4,
  3000: 6,
  2000: 5,
  1200: 3,
  1000: 2,
  500: 1
}

const MasonryLayout = ({ pins }) => (
    // Background Pins
    <Masonry className='flex animate-slide-fwd bg-black dark:bg-gh-bg-primary rounded-lg p-2 mt-2' breakpointCols={breakpointColumnsObj}>
      {pins?.map((pin) => <Pin key={pin._id} pin={pin} className='w-max'/>)}
    </Masonry>
);

export default MasonryLayout