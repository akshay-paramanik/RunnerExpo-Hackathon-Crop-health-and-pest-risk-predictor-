import { useState, useEffect } from "react"
import { Camera, Loader2, Upload, AlertTriangle, CheckCircle } from "lucide-react"
import API from "../api/api"

export function UploadImage() {
  const [image, setImage] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [showOverlay, setShowOverlay] = useState(false)
  const [pestMessage, setPestMessage] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [pestData, setPestData] = useState(null)
  const [isLoadingPestData, setIsLoadingPestData] = useState(true)

  // Fetch pest data on component mount
  useEffect(() => {
    fetchPestData()
  }, [])

  const fetchPestData = async () => {
    try {
      const response = await API.get('/api/pest/')
      if (response.data && response.data.length > 0) {
        setPestData(response.data[0]) // Get the latest pest data
      }
    } catch (error) {
      console.error('Failed to fetch pest data:', error)
    } finally {
      setIsLoadingPestData(false)
    }
  }

  const handleFileSelect = (file) => {
    if (!file) return

    const imgURL = URL.createObjectURL(file)
    setImage(imgURL)
    setSelectedFile(file)
    setShowOverlay(false)
    setPestMessage("")
  }

  const handleSubmit = async () => {
    if (!selectedFile) return

    setIsAnalyzing(true)

    try {
      const formData = new FormData()
      formData.append('pestImage', selectedFile)

      const response = await API.post('/api/pest/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      setPestMessage(response.data.message)
      setShowOverlay(true)
      
      // Refresh pest data after new analysis
      await fetchPestData()
    } catch (error) {
      console.error('Pest analysis failed:', error)
      setPestMessage("Analysis failed. Please try again.")
      setShowOverlay(true)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="rounded-xl bg-white p-6 shadow-lg">
      <h3 className="mb-4 text-lg font-semibold text-slate-800">
        Pest Detection & Risk Analysis
      </h3>

      {/* Current Pest Risk Status */}
      <div className="mb-6 p-4 bg-slate-50 rounded-lg">
        <h4 className="text-sm font-medium text-slate-700 mb-2">Current Pest Risk Status</h4>
        {isLoadingPestData ? (
          <div className="flex items-center gap-2 text-slate-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Loading pest data...</span>
          </div>
        ) : pestData ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {pestData.pestRisk ? (
                <AlertTriangle className="w-4 h-4 text-red-500" />
              ) : (
                <CheckCircle className="w-4 h-4 text-green-500" />
              )}
              <span className={`text-sm font-medium ${pestData.pestRisk ? 'text-red-700' : 'text-green-700'}`}>
                {pestData.pestRisk ? 'High Risk' : 'Low Risk'}
              </span>
            </div>
            <div className="text-xs text-slate-600">
              <p><strong>Pest:</strong> {pestData.pestName || 'Unknown'}</p>
              <p><strong>Confidence:</strong> {pestData.confidence ? `${pestData.confidence.toFixed(1)}%` : 'N/A'}</p>
              {pestData.cause && <p><strong>Cause:</strong> {pestData.cause}</p>}
              {pestData.cure && <p><strong>Recommendation:</strong> {pestData.cure}</p>}
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-500">No pest analysis data available</p>
        )}
      </div>

      {/* Upload Box */}
      <div className="w-full h-[300px] border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center bg-slate-50 hover:bg-slate-100 transition">

        <label
          htmlFor="upload"
          className="cursor-pointer flex flex-col items-center justify-center w-full h-full"
        >
          {!image ? (
            <div className="flex flex-col items-center gap-3 text-slate-500">
              <Camera className="w-10 h-10" />
              <p className="text-sm">Click to upload image for pest analysis</p>
            </div>
          ) : (
            <div className="relative w-full h-full">

              {/* Image */}
              <img
                src={image}
                alt="preview"
                className="w-full h-full object-cover rounded-xl"
              />

              {/* Loading overlay */}
              {isAnalyzing && (
                <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center text-center p-4">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-8 h-8 animate-spin text-white" />
                    <p className="text-white text-sm">Analyzing for pests...</p>
                  </div>
                </div>
              )}

              {/* Pest risk message overlay */}
              {showOverlay && !isAnalyzing && (
                <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center text-center p-4">
                  <p className="text-white text-lg font-semibold">
                    {pestMessage}
                  </p>
                </div>
              )}

            </div>
          )}
        </label>

        <input
          id="upload"
          type="file"
          className="hidden"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0]
            if (file) {
              handleFileSelect(file)
            }
          }}
        />
      </div>

      {/* Submit Button */}
      {image && !showOverlay && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={isAnalyzing}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Analyze for Pests
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}