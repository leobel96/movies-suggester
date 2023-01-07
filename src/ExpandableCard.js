import { Icon } from '@iconify/react'
import PropTypes from 'prop-types'
import React, { useLayoutEffect, useRef, useState } from 'react'

function ExpandableCard (props) {
  const [expanded, setExpanded] = useState(false)
  const [height, setHeight] = useState(null)
  const paragraphEl = useRef(null)

  useLayoutEffect(() => {
    setHeight(paragraphEl.current.clientHeight)
  }, [])

  return (
    <div className='flex flex-col rounded-lg overflow-hidden bg-gray-600'>
      <div className='bg-gray-600'>
        <img src={props.image} loading="lazy" className='w-full'></img>
      </div>
      <div className='px-4'>
        <h3 className='my-3 text-xl'>{props.title}</h3>
        <p ref={paragraphEl} className='text-sm text-justify overflow-hidden text-ellipsis' style={{ maxHeight: expanded ? 'initial' : '150px' }}>{props.overview}</p>
      </div>
      {paragraphEl.current !== null && height >= 150
        ? <button className='italic text-sm mx-auto my-2 bg-transparent border-0 cursor-pointer' onClick={() => setExpanded(!expanded)}>
            <Icon icon={`material-symbols:expand-${expanded ? 'less' : 'more'}-rounded`} width="20" inline={true} />
          </button>
        : <div className='h-3'/>
      }
    </div>
  )
}

ExpandableCard.propTypes = {
  image: PropTypes.string,
  title: PropTypes.string,
  overview: PropTypes.string
}

export default ExpandableCard
