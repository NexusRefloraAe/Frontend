import React, { useState, useRef, useEffect } from 'react'
import './ImageUpload.css'
import cameraIcon from '../../assets/camera-icon.svg'

/**
 * @param {object} props
 * @param {string} props.label - O texto do label (ex: "Upload de Imagem")
 * @param {function(File): void} props.onFileChange = - Função chamada quando o arquivo é selecionado
 * @param {string} props.className - Classe CSS adicional para customização
 * @param {string} [props.previewUrl] - URL da imagem existente (vinda do banco) para exibição inicial
 */
function ImageUpload({ label, onFileChange, className = '', previewUrl }) {
    // Renomeei o estado para 'preview' para diferenciar da prop 'previewUrl'
    const [preview, setPreview] = useState(null);

    const fileInputRef = useRef(null);

    // --- NOVO: Efeito para carregar a imagem vinda do banco (Edição) ---
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
            if (onFileChange) {
                onFileChange(file);
            }
            // Cria o preview local para o novo arquivo selecionado
            setPreview(URL.createObjectURL(file));
        }
    };

    return (
        <div className={`image-upload-wrapper ${className}`}>
            {label && <label>{label}</label>}

            <div className="image-upload-container" onClick={handleContainerClick} title='Clique para selecionar uma imagem'>
                {preview ? (
                    <img src={preview} alt="Preview" className="image-preview" />
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

export default ImageUpload;