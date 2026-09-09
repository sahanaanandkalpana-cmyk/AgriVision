import base64
import io
import json
import os
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

import torch
from PIL import Image
from torchvision import transforms
from transformers import AutoModelForImageClassification


MODEL_ID = os.getenv(
    "PLANT_DISEASE_MODEL",
    "linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification",
)
PORT = int(os.getenv("PLANT_DISEASE_PORT", "8000"))
MIN_CONFIDENCE = float(os.getenv("PLANT_DISEASE_MIN_CONFIDENCE", "0.80"))
MIN_MARGIN = float(os.getenv("PLANT_DISEASE_MIN_MARGIN", "0.15"))
MODEL = AutoModelForImageClassification.from_pretrained(MODEL_ID)
MODEL.eval()
PROCESSOR = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225],
    ),
])


def classify_image(image_data):
    encoded = image_data.split(",", 1)[-1]
    image = Image.open(io.BytesIO(base64.b64decode(encoded))).convert("RGB")
    inputs = {"pixel_values": PROCESSOR(image).unsqueeze(0)}

    with torch.no_grad():
        probabilities = torch.softmax(MODEL(**inputs).logits, dim=-1)[0]

    top_probabilities, top_indices = torch.topk(probabilities, k=2)
    confidence = top_probabilities[0]
    index = top_indices[0]
    confidence_value = float(confidence)
    margin = float(top_probabilities[0] - top_probabilities[1])
    label = MODEL.config.id2label[int(index)]

    if confidence_value < MIN_CONFIDENCE or margin < MIN_MARGIN:
        return {
            "isCropImage": False,
            "disease": "Uncertain result",
            "confidence": f"{confidence_value * 100:.1f}%",
            "medicine": "Not recommended without a confirmed diagnosis",
            "recommendation": "The image does not produce a reliable classification. Upload a clear close-up image of one affected leaf and confirm the result with an agriculture expert.",
        }

    healthy = "healthy" in label.lower()
    readable_label = label.replace("___", " - ").replace("_", " ")
    return {
        "isCropImage": True,
        "disease": "Healthy crop" if healthy else readable_label,
        "confidence": f"{confidence_value * 100:.1f}%",
        "medicine": "None needed" if healthy else "Confirm treatment with a local agriculture expert",
        "recommendation": "Continue monitoring the crop." if healthy else "Remove severely affected material where appropriate and confirm treatment locally.",
    }


class DiseaseHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        if self.path != "/predict":
            self.send_error(404)
            return

        try:
            length = int(self.headers.get("Content-Length", "0"))
            body = json.loads(self.rfile.read(length))
            result = classify_image(body["image"])
            payload = json.dumps(result).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(payload)))
            self.end_headers()
            self.wfile.write(payload)
        except Exception as error:
            payload = json.dumps({"message": str(error)}).encode("utf-8")
            self.send_response(400)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(payload)))
            self.end_headers()
            self.wfile.write(payload)

    def log_message(self, format_string, *args):
        return


if __name__ == "__main__":
    print(f"Plant disease model ready on http://127.0.0.1:{PORT}", flush=True)
    ThreadingHTTPServer(("127.0.0.1", PORT), DiseaseHandler).serve_forever()