import { useState } from "react"
import { Camera } from "lucide-react"

export function UploadImage() {
  const [image, setImage] = useState(null)
  const [showOverlay, setShowOverlay] = useState(false)
  const [loading, setLoading] = useState(false)

  return (
    <div className="rounded-xl bg-white p-6 shadow-lg">
      <h3 className="mb-4 text-lg font-semibold text-slate-800">
        Upload Image
      </h3>

      <div className="w-full h-[300px] border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center bg-slate-50 hover:bg-slate-100 transition">

        <label
          htmlFor="upload"
          className="cursor-pointer flex flex-col items-center justify-center w-full h-full"
        >
          {!image ? (
            <div className="flex flex-col items-center gap-3 text-slate-500">
              <Camera className="w-10 h-10" />
              <p className="text-sm">Click to upload image</p>
            </div>
          ) : (
            <div className="relative w-full h-full">

              {/* Image */}
              <img
                src={image}
                alt="preview"
                className="w-full h-full object-cover rounded-xl"
              />

              {/* Overlay */}
              {showOverlay && (
                <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center text-center p-4">

                  {loading ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-white text-sm">Analyzing image...</p>
                    </div>
                  ) : (
                    <p className="text-white text-sm">
                      • Improve irrigation balance <br />
                      • Apply organic fertilizers <br />
                      • Monitor pest activity regularly <br />
                      • Maintain proper soil moisture
                    </p>
                  )}

                </div>
              )}

            </div>
          )}
        </label>

        <input
          id="upload"
          type="file"
          className="hidden"
          onChange={(e) => {
            if (e.target.files[0]) {
              const imgURL = URL.createObjectURL(e.target.files[0])
              setImage(imgURL)

              setShowOverlay(true)
              setLoading(true)

              // show loader for 2 sec, then text
              setTimeout(() => {
                setLoading(false)
              }, 2000)
            }
          }}
        />
      </div>
    </div>
  )
}