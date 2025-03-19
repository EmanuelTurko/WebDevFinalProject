import React, { FC } from 'react';
import styles from './PopUpModel.module.css';
import {faX} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

interface PopUpModelProps {
    isVisible: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const PopUpModel: FC<PopUpModelProps> = ({ isVisible, onClose, children }) => {
    if (!isVisible) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <FontAwesomeIcon
                    icon={faX}
                    className={styles.closeButton}
                    onClick={onClose}>

                </FontAwesomeIcon>
                {children} {}
            </div>
        </div>
    );
};

export default PopUpModel;