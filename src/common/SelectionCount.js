import React from 'react';

const style = {
    right: `-8px`,
    top: `-8px`,
    color: 'black',
    background: 'white',
    borderRadius: '50%',
    height: `30px`,
    width: `30px`,
    lineHeight: `30px`,
    position: 'absolute',
    textAlign: 'center',
    fontSize: '0.8rem',
}

export const SelectionCount = ({children}) => (
    <div style={style} >
        {children}
    </div>
)