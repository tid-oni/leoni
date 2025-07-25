import face_recognition
import numpy as np
import cv2
from PIL import Image
import base64
import io
from django.conf import settings
import os

def encode_face_from_image(image_path):
    """
    Encode un visage à partir d'une image
    """
    try:
        # Charger l'image
        image = face_recognition.load_image_file(image_path)
        
        # Trouver les encodages des visages
        face_encodings = face_recognition.face_encodings(image)
        
        if len(face_encodings) > 0:
            # Retourner le premier encodage trouvé
            return face_encodings[0].tolist()
        else:
            return None
    except Exception as e:
        print(f"Erreur lors de l'encodage du visage: {e}")
        return None

def encode_face_from_base64(base64_image):
    """
    Encode un visage à partir d'une image en base64
    """
    try:
        # Décoder l'image base64
        image_data = base64.b64decode(base64_image.split(',')[1])
        image = Image.open(io.BytesIO(image_data))
        
        # Convertir en array numpy
        image_array = np.array(image)
        
        # Trouver les encodages des visages
        face_encodings = face_recognition.face_encodings(image_array)
        
        if len(face_encodings) > 0:
            return face_encodings[0].tolist()
        else:
            return None
    except Exception as e:
        print(f"Erreur lors de l'encodage du visage depuis base64: {e}")
        return None

def compare_faces(known_encoding, unknown_encoding, tolerance=None):
    """
    Compare deux encodages de visages
    """
    if tolerance is None:
        tolerance = getattr(settings, 'FACE_RECOGNITION_TOLERANCE', 0.6)
    
    try:
        # Convertir les listes en arrays numpy
        known_encoding = np.array(known_encoding)
        unknown_encoding = np.array(unknown_encoding)
        
        # Comparer les visages
        results = face_recognition.compare_faces([known_encoding], unknown_encoding, tolerance=tolerance)
        
        return results[0] if results else False
    except Exception as e:
        print(f"Erreur lors de la comparaison des visages: {e}")
        return False

def detect_face_in_image(image_path):
    """
    Détecte s'il y a un visage dans l'image
    """
    try:
        image = face_recognition.load_image_file(image_path)
        face_locations = face_recognition.face_locations(image)
        return len(face_locations) > 0
    except Exception as e:
        print(f"Erreur lors de la détection du visage: {e}")
        return False