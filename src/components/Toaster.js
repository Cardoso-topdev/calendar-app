import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useToasts } from 'react-toast-notifications'
import { messageActionTypes } from '../helper/constants';

/**
 * 
 * @param {*} children children component
 * It is a toaster wrapper 
 */
const Toaster = ({children}) => {

    const { addToast } = useToasts();
    /**
     * dispatch function from the store
     */
    const dispatch = useDispatch();
    /**
     * to get message state from the store
     */
    const { message, success, info } = useSelector(state => state.message);
    /**
     * whenever message state changes, the inner part triggers.
     * 
     */
    useEffect(() => {
        if(!message) {
            return;
        }
        addToast(message, {
            appearance: info ? 'warning' : (success ? 'success' : 'error'),
            autoDismiss: true
        });
        //after some time, message clears.
        const timeId = setTimeout(() => dispatch({type: messageActionTypes.CLEAR_MESSAGE}), 5000)
        return () => {
            clearTimeout(timeId);
        }
    }, [message, addToast, dispatch, info, success]);
    
    return (
        <>
            {children}
        </>
    )
}

export default Toaster;