import { useEffect, useState } from "react";

export default function ImagePreview({ file }) {
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        if (!file) return;
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [file]);

    return (
        <div className="text-center my-3">
            <img
                src={preview || "/images/default-avatar.png"}
                alt="preview"
                className="rounded border"
                style={{ width: 120, height: 120, objectFit: "cover" }}
            />
        </div>
    );
}