import React, { useState, useRef } from 'react'
import './ImageUpload.css'
import cameraIcon from '../../assets/camera-icon.svg'

/**
 * @param {object} props
 * @param {string} props.label - O texto do label (ex: "Upload de Imagem")
 * @param {function(File): void} props.onFileChange = - Função chamada quando o arquivo é selecionado
 * @param {string} props.className - Classe CSS adicional para customização
 */

function ImageUpload({ label, onFileChange, className = '' }) {
    const [previewUrl, setPreviewUrl] = React.useState(null);

    const fileInputRef = useRef(null);

    const handleContainerClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            onFileChange(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };
    return (
        <div className={`image-upload-wrapper ${className}`}>
            {label && <label>{label}</label>}

            <div className="image-upload-container" onClick={handleContainerClick} title='Clique para selecionar uma imagem'>
                {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="image-preview" />
                ) : (
                    <div className="image-placeholder">
                        <img src={cameraIcon} alt="Camera Icon" />
                    </div>
                )}
            </div>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
                accept="image/png, image/jpeg"
            />
        </div>
    );
}

export default ImageUpload
