
import { useState, useRef } from "react"
import "./FileUpload.css"

function FileUpload({ onFileSelect, label, accept = "image/*", currentImage = null }) {
  const [preview, setPreview] = useState(currentImage)
  const [fileName, setFileName] = useState("")
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    setFileName(file.name)
    onFileSelect(file)

    if (file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target.result)
      }
      reader.readAsDataURL(file)
    } else {
      setPreview(null)
    }
  }

  const handleClick = () => {
    fileInputRef.current.click()
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      setFileName(file.name)
      onFileSelect(file)

      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (e) => {
          setPreview(e.target.result)
        }
        reader.readAsDataURL(file)
      } else {
        setPreview(null)
      }
    }
  }

  return (
    <div className="file-upload">
      <label>{label || "Upload Fil"}</label>
      <div className="file-upload-area" onClick={handleClick} onDragOver={handleDragOver} onDrop={handleDrop}>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept={accept} style={{ display: "none" }} />

        {preview ? (
          <div className="file-preview">
            <img src={preview || "/placeholder.svg"} alt="Forhåndsvisning" />
          </div>
        ) : (
          <div className="file-upload-placeholder">
            <div className="file-upload-icon">+</div>
            <p>Klik eller træk fil for at uploade</p>
          </div>
        )}

        {fileName && <div className="file-name">{fileName}</div>}
      </div>
    </div>
  )
}

export default FileUpload

