import PropTypes from 'prop-types'
import React from 'react'

function Logo (props) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fillRule='evenodd'
      strokeLinejoin='round'
      strokeMiterlimit='2'
      clipRule='evenodd'
      viewBox='0 0 12 12'
      className={props.className}
    >
      <path
        fill='#36d7b7'
        fillRule='nonzero'
        d='M1 5v5c0 .549.451 1 1 1h8c.555 0 1-.445 1-1V5H1zm5 2.182c.328-.619.984-.619 1.312-.309.328.309.328.928 0 1.547-.229.464-.82.928-1.312 1.238-.492-.31-1.083-.774-1.312-1.238-.328-.619-.328-1.238 0-1.547.328-.31.984-.31 1.312.309zM2.08 2.75l-.49.095A1.004 1.004 0 00.805 4.02L1 5l2.45-.485L2.08 2.75zm2.455-.5l-.985.205L4.925 4.22l.98-.195-1.37-1.775zm2.45-.48L6 1.965 7.375 3.73l.98-.195-1.37-1.765zm3.435-.68l-1.965.39 1.37 1.77.985-.2-.39-1.96z'
      ></path>
    </svg>
  )
}

Logo.propTypes = {
  className: PropTypes.string
}

export default Logo
