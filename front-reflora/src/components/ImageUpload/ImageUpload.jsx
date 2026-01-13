import React, { useState, useRef, useEffect } from 'react'
import './ImageUpload.css'
import cameraIcon from '../../assets/camera-icon.svg'

function ImageUpload({ label, onFileChange, className = '', previewUrl }) {
    const [preview, setPreview] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (previewUrl) {
            setPreview(previewUrl);
        } else {
            setPreview(null);
        }
    }, [previewUrl]);

    const handleContainerClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (onFileChange) onFileChange(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    return (
        <div className={`upload-wrapper-novo ${className}`}>
            {/* REMOVIDO o style inline que forçava para esquerda. Agora obedece o CSS. */}
            {label && <label>{label}</label>}

            <div 
                className="upload-box-novo" 
                onClick={handleContainerClick} 
                title='Clique para selecionar'
            >
                {preview ? (
                    <img src={preview} alt="Preview" className="upload-preview-img" />
                ) : (
                    <div className="upload-placeholder-novo">
                        <img src={cameraIcon} alt="Ícone" />
                        <span className="upload-text-main">Adicionar<br/>Foto</span>
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

export default ImageUpload;